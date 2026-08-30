# Campus Event Management System - Setup & Development Guide

## Quick Start

### Prerequisites
- Node.js v14+ and npm
- MongoDB (local or MongoDB Atlas)
- Git

### 5-Minute Setup

#### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev
```

#### 2. Frontend Setup (new terminal)
```bash
cd frontend
npm install
npm start
```

Visit `http://localhost:3000`

---

## Detailed Walkthrough

### Understanding the Architecture

This is a 3-tier MERN Stack application:

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                       │
│              (localhost:3000)                          │
│        - Components, Pages, Routing                    │
│        - Context API for state                         │
│        - Bootstrap for UI                              │
└──────────────────────────┬──────────────────────────────┘
                           │
                    REST API (HTTP)
                    Authorization: JWT
                           │
┌──────────────────────────┴──────────────────────────────┐
│                   Express.js Backend                    │
│              (localhost:5000)                          │
│        - Routes, Controllers, Middleware               │
│        - Business logic & validation                   │
│        - JWT authentication                            │
└──────────────────────────┬──────────────────────────────┘
                           │
                    MongoDB Driver
                           │
┌──────────────────────────┴──────────────────────────────┐
│                  MongoDB Database                       │
│        - Users, Events, Registrations Collections      │
└─────────────────────────────────────────────────────────┘
```

### Request Flow Example: User Registration

```
User enters email/password → React Form
                    ↓
POST /api/users/register (axios)
                    ↓
Express validation middleware
                    ↓
userController.register()
  - Hash password with bcryptjs
  - Save to MongoDB
  - Generate JWT token
                    ↓
Response: { token, user }
                    ↓
Frontend stores token in localStorage
                    ↓
Redirect to home page
```

### Core Concepts Explained

#### 1. JWT Authentication
A JWT token is like a digital ID card:
- Generated on login
- Contains: userId, role, expiration
- Sent with every API request in header
- Backend verifies it before processing

```javascript
// Token includes this payload
{
  userId: "507f1f77bcf86cd799439011",
  role: "student",
  iat: 1234567890,
  exp: 1234654290
}
```

#### 2. Middleware Chain
```
Request → CORS Check → JSON Parse → Authentication 
       → Authorization → Validation → Controller 
       → Database Operation → Response
```

#### 3. Database Relationships

**One Event - Many Registrations:**
```
Event (capacity: 50)
  ├── Registration 1 (student1)
  ├── Registration 2 (student2)
  └── Registration 3 (student3)
```

**Event References:**
- Event.organizer → User._id (Admin who created)
- Registration.student → User._id (Student registered)
- Registration.event → Event._id (Event registered for)

#### 4. State Management with Context

Frontend uses React Context to manage:
- User authentication state
- JWT token
- User profile information

No Redux needed for this project!

---

## File-by-File Explanation

### Backend Files

#### `server.js`
- Express app setup
- Middleware configuration
- Route mounting
- Error handling

#### `config/database.js`
- MongoDB connection logic
- Connection error handling

#### `config/jwt.js`
- JWT token generation
- JWT token verification

#### `models/User.js`
- User schema definition
- Password hashing before save
- Password comparison method

#### `middleware/auth.js`
- `authenticate`: Verify JWT token
- `authorize`: Check user role

#### `controllers/userController.js`
- register: New user signup
- login: User login
- getProfile: Get user info
- updateProfile: Update user info
- getAllStudents: Admin endpoint

#### `routes/userRoutes.js`
- Public routes: /register, /login
- Protected routes: /profile
- Admin routes: /students

### Frontend Files

#### `services/api.js`
- Axios instance
- All API endpoints
- JWT token injection in headers

#### `context/AuthContext.js`
- Auth state (user, token, isAuthenticated)
- login, register, logout functions
- useAuth hook for components

#### `App.js`
- Route definitions
- ProtectedRoute wrapper
- Role-based access

#### `pages/EventList.js`
- Fetch all events
- Filter by category
- Search functionality
- Sort by date/popularity

#### `pages/EventDetail.js`
- Event information display
- Registration logic
- Admin statistics

---

## Common Development Tasks

### Add New Event Field

1. **Update MongoDB Schema** (`backend/models/Event.js`)
```javascript
eventSchema.add({
  duration: Number,  // Add this
});
```

2. **Update Controller** (`backend/controllers/eventController.js`)
```javascript
const { duration } = req.body;
// Use it in event creation/update
```

3. **Update Frontend Form** (`frontend/src/pages/CreateEvent.js`)
```jsx
<Form.Group>
  <Form.Label>Duration (minutes)</Form.Label>
  <Form.Control type="number" name="duration" />
</Form.Group>
```

### Add Admin Function

1. **Create controller function**
```javascript
export const someAdminFunction = async (req, res) => {
  // Only admins reach here
};
```

2. **Add route with authorization**
```javascript
router.get('/admin-only', authenticate, authorize(['admin']), someAdminFunction);
```

3. **Call from frontend**
```javascript
// Only if user.role === 'admin'
const response = await api.get('/admin-only');
```

---

## Testing the App

### Test Student Flow
1. Register as student
2. Browse events
3. Register for an event
4. View My Registrations
5. Cancel a registration

### Test Admin Flow
1. Register as admin (change role in registration form)
2. Go to Admin Dashboard
3. Create an event
4. View statistics
5. View registered students

### Test Authentication
1. Login with valid credentials
2. Token stored in localStorage
3. Logout clears token
4. Access protected routes without token → redirect to login

---

## Debugging Tips

### Backend Debugging
```bash
# Add console logs to see request data
console.log('User registering:', req.body);

# Check MongoDB connection
console.log('MongoDB Connected:', mongoose.connection.host);

# Verify JWT token
const decoded = jwt.verify(token, JWT_SECRET);
console.log('Token payload:', decoded);
```

### Frontend Debugging
```javascript
// Check if token exists
console.log('Token:', localStorage.getItem('token'));

// Check API response
.then(res => console.log('Response:', res.data))
.catch(err => console.log('Error:', err.response?.data));

// Check auth context
const { user, isAuthenticated } = useAuth();
console.log('User:', user, 'Auth:', isAuthenticated);
```

---

## Production Deployment

### Before Deployment

1. **Backend .env**
```
MONGODB_URI=<production-mongodb-uri>
JWT_SECRET=<strong-random-secret>
NODE_ENV=production
PORT=5000
```

2. **Frontend**
```
REACT_APP_API_URL=https://your-api-domain.com/api
```

3. **Build Frontend**
```bash
cd frontend
npm run build
# Creates optimized build in /build folder
```

### Deployment Options

**Backend**: Heroku, AWS, DigitalOcean
**Frontend**: Vercel, Netlify, GitHub Pages
**Database**: MongoDB Atlas (cloud)

---

## Interview Questions & Answers

### Q1: How does authentication work?
A: Users login → server generates JWT → client stores in localStorage → client sends JWT with every request → server verifies JWT.

### Q2: How do you prevent duplicate registrations?
A: MongoDB compound index on (student, event) fields ensures only one registration per student per event.

### Q3: How does role-based access control work?
A: JWT contains role → middleware checks role → allows/denies access based on allowed roles.

### Q4: How do you handle event capacity?
A: Check registrationCount < capacity before allowing registration → increment count on registration → decrement on cancellation.

### Q5: How is the frontend secured?
A: JWT validation on backend → sensitive data not stored on frontend → routes protected with ProtectedRoute wrapper.

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Cannot POST /api/users/register" | Ensure backend is running on port 5000 |
| "JWT is not defined" | Install jsonwebtoken: `npm install jsonwebtoken` |
| "Cannot read property '_id' of null" | User not found in DB, check email |
| CORS errors | Enable CORS in server.js |
| 404 on API routes | Check route paths and mounting in server.js |

---

**Next Steps**: Deploy to production, add more features, contribute to open source! 🚀
