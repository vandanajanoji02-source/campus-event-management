# Code Examples & Patterns Reference

## Backend Patterns

### 1. Controller Pattern - User Registration

```javascript
// backend/controllers/userController.js
export const register = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract data
    const { name, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create new user (password auto-hashed by middleware)
    user = new User({ name, email, password });
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    // Send response
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name, email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

**Key Concepts:**
- Validation before processing
- Check duplicates
- Hash password before saving
- Generate JWT token
- Return success/error response

### 2. Route Protection Pattern

```javascript
// backend/routes/eventRoutes.js
router.post(
  '/',
  authenticate,              // Check JWT token
  authorize(['admin']),       // Check role
  [body('title', 'Title required').notEmpty()],  // Validate input
  createEvent                 // Controller
);
```

### 3. Database Relationship Pattern

```javascript
// backend/models/Registration.js
const registrationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',              // Reference to User
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',             // Reference to Event
    required: true
  }
});

// In controller, populate relationships:
const registration = await Registration.findById(id)
  .populate('student', 'name email')
  .populate('event', 'title location');
```

### 4. Pagination Pattern

```javascript
// backend/controllers/eventController.js
export const getAllEvents = async (req, res) => {
  const page = req.query.page || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const events = await Event.find()
    .limit(limit)
    .skip(skip)
    .sort({ date: -1 });

  const total = await Event.countDocuments();

  res.json({
    success: true,
    events,
    totalPages: Math.ceil(total / limit),
    currentPage: page
  });
};
```

### 5. Search Pattern

```javascript
// backend/controllers/eventController.js
export const searchEvents = async (req, res) => {
  const { query } = req.query;

  const events = await Event.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ]
  });

  res.json({ success: true, events });
};
```

---

## Frontend Patterns

### 1. Protected Route Pattern

```javascript
// frontend/src/App.js
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Usage
<Route
  path="/admin"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

### 2. Context API Pattern

```javascript
// frontend/src/context/AuthContext.js
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (email, password) => {
    try {
      const response = await userAPI.login({ email, password });
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login }}>
      {children}
    </AuthContext.Provider>
  );
};

// Usage in component
const { user, login } = useAuth();
```

### 3. API Service Pattern

```javascript
// frontend/src/services/api.js
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const eventAPI = {
  getAllEvents: (params) => api.get('/events', { params }),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (data) => api.post('/events', data)
};
```

### 4. Form Handling Pattern

```javascript
// frontend/src/pages/Login.js
const [formData, setFormData] = useState({
  email: '',
  password: ''
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await login(formData.email, formData.password);
  if (result.success) {
    navigate('/');
  } else {
    setError(result.error);
  }
};
```

### 5. Data Fetching Pattern

```javascript
// frontend/src/pages/EventList.js
const [events, setEvents] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getAllEvents();
      setEvents(response.data.events || []);
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  fetchEvents();
}, []);
```

### 6. Modal Pattern

```javascript
// frontend/src/pages/AdminDashboard.js
const [showModal, setShowModal] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);

const handleOpen = (item) => {
  setSelectedItem(item);
  setShowModal(true);
};

const handleClose = () => {
  setShowModal(false);
  setSelectedItem(null);
};

return (
  <>
    <Button onClick={() => handleOpen(event)}>View Details</Button>

    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{selectedItem?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Content here */}
      </Modal.Body>
    </Modal>
  </>
);
```

---

## Common Code Snippets

### 1. Password Hashing

```javascript
// backend/models/User.js
import bcryptjs from 'bcryptjs';

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};
```

### 2. JWT Token Generation

```javascript
// backend/config/jwt.js
import jwt from 'jsonwebtoken';

export const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
```

### 3. Input Validation

```javascript
// backend/routes/eventRoutes.js
import { body } from 'express-validator';

router.post(
  '/',
  [
    body('title', 'Title is required').trim().notEmpty(),
    body('email', 'Valid email required').isEmail(),
    body('password', 'Password must be 6+ chars').isLength({ min: 6 }),
    body('capacity', 'Capacity must be positive').isInt({ min: 1 })
  ],
  controller
);
```

### 4. Error Handling Middleware

```javascript
// backend/server.js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});
```

### 5. Consistent Response Format

```javascript
// Backend responses follow this pattern:

// Success
res.json({
  success: true,
  message: 'Operation successful',
  data: { /* data */ }
});

// Error
res.status(400).json({
  success: false,
  message: 'Error description'
});

// Frontend handling
if (response.data.success) {
  // Process data
  setEvents(response.data.data);
} else {
  // Show error
  setError(response.data.message);
}
```

### 6. Conditional Rendering in React

```javascript
// frontend/src/components/EventCard.js
export default function EventCard({ event }) {
  const isFull = event.registrationCount >= event.capacity;
  const isUpcoming = new Date(event.date) > new Date();

  return (
    <>
      {isUpcoming ? (
        <Badge bg="success">Upcoming</Badge>
      ) : (
        <Badge bg="secondary">Past</Badge>
      )}

      {isFull ? (
        <Button disabled>Event Full</Button>
      ) : (
        <Button onClick={handleRegister}>Register</Button>
      )}
    </>
  );
}
```

### 7. Responsive Grid Layout

```jsx
// frontend/src/pages/EventList.js
<Row className="g-4">
  {events.map((event) => (
    <Col key={event._id} md={6} lg={4}>
      <EventCard event={event} />
    </Col>
  ))}
</Row>

// Responsive: 
// xs: 1 column
// md: 2 columns
// lg: 3 columns
```

### 8. Date Formatting

```javascript
// Frontend
const eventDate = new Date(event.date);
eventDate.toLocaleDateString('en-IN');    // DD/MM/YYYY
eventDate.toLocaleString('en-IN');        // Full date + time
eventDate.toISOString();                  // ISO format

// Backend
const today = new Date();
const eventDate = new Date(event.date);
const isUpcoming = eventDate > today;
```

### 9. LocalStorage Handling

```javascript
// Save
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));

// Retrieve
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

// Remove
localStorage.removeItem('token');
localStorage.clear();  // Remove all
```

### 10. Async/Await Error Handling

```javascript
async function fetchData() {
  try {
    const response = await api.get('/events');
    setEvents(response.data.events);
  } catch (error) {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      navigate('/login');
    } else if (error.response?.status === 404) {
      // Not found
      setError('Resource not found');
    } else {
      // Generic error
      setError(error.message);
    }
  } finally {
    setLoading(false);
  }
}
```

---

## Quick Reference

### HTTP Status Codes
- 200: OK - Request successful
- 201: Created - Resource created
- 400: Bad Request - Invalid input
- 401: Unauthorized - Auth needed
- 403: Forbidden - No permission
- 404: Not Found - Resource missing
- 500: Server Error - Internal error

### MongoDB Query Operators
- `{ $or: [...] }` - OR condition
- `{ $regex: 'pattern' }` - Pattern matching
- `{ $eq: value }` - Equals
- `{ $gt: value }` - Greater than
- `{ $lt: value }` - Less than

### React Hooks Used
- `useState` - Local state
- `useEffect` - Side effects
- `useContext` - Access context
- `useNavigate` - Navigate between routes
- `useParams` - Get URL parameters

### Bootstrap Classes Used
- `container` - Full-width container
- `row` / `col` - Grid system
- `btn btn-primary` - Button
- `card` - Card component
- `alert` - Alert message
- `modal` - Modal dialog
- `table` - Table styling

---

**Use these patterns as templates for building features!** 🚀
