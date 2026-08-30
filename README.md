# Campus Event Management System

A complete MERN Stack application for managing campus events, allowing students to explore, register for events, and enabling administrators to create and manage events. Perfect for BCA freshers to understand full-stack development!

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Key Concepts](#key-concepts)
- [Project Explanation](#project-explanation)

## ✨ Features

### 👨‍🎓 Student Features
- **User Authentication**: Register and login with secure password hashing
- **Browse Events**: View all campus events with filtering options
- **Search & Filter**: Filter events by category, search by title/description
- **Event Details**: View comprehensive event information
- **Event Registration**: Register for events with capacity checking
- **Manage Registrations**: View registered events and cancel registrations
- **Profile Management**: Update personal information

### 👨‍💼 Admin Features
- **Event Management**: Create, update, and delete events
- **View Registrations**: See list of registered students per event
- **Event Statistics**: Track registrations, cancellations, and attendance
- **Capacity Management**: Track event capacity and registration counts
- **Student List**: View all registered students for events

### 👥 Organizer Features
- **Create Events**: Create campus events as an organizer
- **Manage Own Events**: Update events and view registrations for managed events
- **Registration Statistics**: Monitor registration counts and event capacity

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing
- **Validation**: express-validator
- **CORS**: Cross-Origin Resource Sharing

### Frontend
- **Library**: React 18
- **Routing**: React Router v6
- **UI Framework**: Bootstrap 5 with React-Bootstrap
- **HTTP Client**: Axios
- **State Management**: React Context API

## 📁 Project Structure

```
campus-event-management/
├── backend/
│   ├── config/
│   │   ├── database.js           # MongoDB connection
│   │   └── jwt.js                # JWT utilities
│   ├── controllers/
│   │   ├── userController.js     # User-related APIs
│   │   ├── eventController.js    # Event-related APIs
│   │   └── registrationController.js  # Registration APIs
│   ├── middleware/
│   │   └── auth.js               # Authentication & Authorization
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Event.js              # Event schema
│   │   └── Registration.js       # Registration schema
│   ├── routes/
│   │   ├── userRoutes.js         # User endpoints
│   │   ├── eventRoutes.js        # Event endpoints
│   │   └── registrationRoutes.js # Registration endpoints
│   ├── .env.example              # Environment variables template
│   ├── scripts/
│   │   └── seedDemoUsers.js       # Create demo accounts
│   ├── package.json
│   └── server.js                 # Express server entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js         # Navigation bar
│   │   │   ├── Footer.js         # Footer
│   │   │   └── EventCard.js      # Event card component
│   │   ├── context/
│   │   │   └── AuthContext.js    # Auth state management
│   │   ├── pages/
│   │   │   ├── Home.js           # Home page
│   │   │   ├── Login.js          # Login page
│   │   │   ├── Register.js       # Registration page
│   │   │   ├── EventList.js      # Events listing page
│   │   │   ├── EventDetail.js    # Event details page
│   │   │   ├── MyRegistrations.js # Student registrations
│   │   │   ├── AdminDashboard.js # Admin dashboard
│   │   │   ├── CreateEvent.js    # Create event page
│   │   │   └── Profile.js        # User profile page
│   │   ├── services/
│   │   │   └── api.js            # API service with axios
│   │   ├── App.js                # Main app component
│   │   ├── index.js              # React entry point
│   │   └── index.css             # Global styles
│   └── package.json
│
├── .gitignore                    # Git ignore file
└── README.md                     # This file
```

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
cd campus-event-management
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env
# (On Linux/Mac: cp .env.example .env)

# Edit .env and update:
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: A secure random string
# - PORT: Server port (default: 5000)
```

**Example .env file:**
```
MONGODB_URI=mongodb://localhost:27017/campus-event-management
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

### Demo Accounts

After MongoDB is running, create the demo accounts with:

```bash
cd backend
npm run seed:demo
```

Use these credentials on the login page:

| Role | Email | Password |
| --- | --- | --- |
| Student | `student@campus.test` | `Student@123` |
| Organizer | `organizer@campus.test` | `Organizer@123` |
| Admin | `admin@campus.test` | `Admin@123` |

Public registration supports the `Student` and `Organizer` roles. Admin accounts should be created by the demo seeder or through a protected administration workflow.

### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file (optional, defaults to localhost:5000)
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

## ▶️ Running the Application

### Start Backend Server

```bash
cd backend

# Development mode with auto-reload
npm run dev

# Or production mode
npm start

# Server will run on http://localhost:5000
```

### Start Frontend Server (in another terminal)

```bash
cd frontend

npm start

# App will open on http://localhost:3000
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

### User Endpoints

#### Register
```
POST /users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",
  "enrollmentNumber": "BCA-2024-001",
  "department": "Computer Science",
  "semester": 1
}
```

#### Login
```
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { ... }
}
```

#### Get Profile
```
GET /users/profile
Authorization: Bearer <token>
```

#### Update Profile
```
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "department": "Computer Science",
  "semester": 2
}
```

### Event Endpoints

#### Get All Events
```
GET /events?category=technical&search=hackathon&sortBy=date
```

#### Get Event by ID
```
GET /events/:id
```

#### Create Event (Admin)
```
POST /events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Web Development Workshop",
  "description": "Learn modern web development...",
  "category": "technical",
  "date": "2024-12-15",
  "time": "14:00",
  "location": "Lab 1",
  "capacity": 50,
  "registrationDeadline": "2024-12-10",
  "tags": ["web", "beginner"]
}
```

#### Update Event (Admin)
```
PUT /events/:id
Authorization: Bearer <token>
Content-Type: application/json

{ ... fields to update ... }
```

#### Delete Event (Admin)
```
DELETE /events/:id
Authorization: Bearer <token>
```

#### Get Event Statistics (Admin)
```
GET /events/:id/statistics
Authorization: Bearer <token>
```

### Registration Endpoints

#### Register for Event
```
POST /registrations
Authorization: Bearer <token>
Content-Type: application/json

{
  "eventId": "507f1f77bcf86cd799439011"
}
```

#### Get My Registrations
```
GET /registrations/my-registrations
Authorization: Bearer <token>
```

#### Cancel Registration
```
DELETE /registrations/:registrationId
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Unable to attend"
}
```

#### Get Event Registrations (Admin)
```
GET /registrations/event/:eventId
Authorization: Bearer <token>
```

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (student/admin),
  enrollmentNumber: String,
  department: String,
  semester: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Events Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String (technical/cultural/sports/academic/other),
  date: Date,
  time: String,
  location: String,
  capacity: Number,
  registrationDeadline: Date,
  organizer: ObjectId (ref: User),
  image: String (URL),
  tags: [String],
  registrationCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Registrations Collection
```javascript
{
  _id: ObjectId,
  student: ObjectId (ref: User),
  event: ObjectId (ref: Event),
  registeredAt: Date,
  status: String (registered/cancelled/attended),
  cancellationReason: String,
  cancelledAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎓 Key Concepts

### 1. JWT Authentication
- Users receive a JWT token on login
- Token contains userId and role
- Token is sent in `Authorization` header for protected requests
- Token expires based on `JWT_EXPIRE` setting

### 2. Role-Based Authorization
- Two roles: `student` and `admin`
- `authorize` middleware checks user role
- Admin-only routes check for admin role

### 3. Password Security
- Passwords are hashed using bcryptjs before storing
- `matchPassword` method compares plain text with hashed password

### 4. MongoDB Relationships
- `Event.organizer` references `User._id`
- `Registration.student` and `Registration.event` use references
- Mongoose `populate()` fetches related documents

### 5. Validation
- express-validator for request validation
- Email format, password length, required fields

### 6. Error Handling
- Consistent error response format
- HTTP status codes (201, 400, 401, 403, 404, 500)

## 📖 Project Explanation

### How Registration Works

1. **Student Browsing Events**
   - User visits `/events` to see all events
   - Events are filtered by category and search terms
   - Each event shows registration count and capacity

2. **Registering for Event**
   - Student clicks "Register Now" on event card
   - Frontend sends POST to `/registrations` with eventId
   - Backend checks: capacity, deadline, duplicate registration
   - Registration record created with status "registered"
   - Event's `registrationCount` incremented

3. **Cancelling Registration**
   - Student can cancel from "My Registrations"
   - Registration status changed to "cancelled"
   - Event's `registrationCount` decremented

### How Admin Event Management Works

1. **Creating Event**
   - Admin navigates to `/admin/create-event`
   - Fills event details and submits
   - Event created with organizer as current admin
   - Event appears in dashboard

2. **Viewing Statistics**
   - Admin clicks "Statistics" on event card
   - Shows registered, cancelled, attended counts
   - Shows capacity filled percentage

3. **Viewing Registrations**
   - Admin clicks "View Students"
   - Shows list of all registered students
   - Displays student info: name, email, enrollment, department

### Authentication Flow

```
User Registers/Logins
        ↓
Backend hashes password & creates JWT
        ↓
Frontend stores JWT in localStorage
        ↓
All API requests include JWT in header
        ↓
Backend verifies JWT with middleware
        ↓
Request processed or rejected based on role
```

## 🔐 Security Considerations

1. **Password Hashing**: bcryptjs with salt rounds
2. **JWT Secret**: Should be strong and never committed
3. **CORS**: Configured to allow requests from frontend
4. **Validation**: All inputs validated server-side
5. **Authorization**: Role-based access control

## 🎯 Learning Outcomes

By completing this project, you'll understand:
- Full-stack application architecture
- REST API design and implementation
- Database design with MongoDB and relationships
- Authentication and authorization
- Frontend routing and state management
- Bootstrap responsive design
- Error handling and validation
- Git version control

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- For MongoDB Atlas, whitelist your IP

### Port Already in Use
- Change PORT in .env (backend)
- Kill process: `lsof -ti:5000 | xargs kill -9` (Mac/Linux)

### CORS Error
- Check backend CORS configuration
- Ensure frontend URL is allowed

### JWT Token Expired
- Clear localStorage and login again
- Adjust JWT_EXPIRE if needed

## 📝 License

MIT License - feel free to use for educational purposes

## 🤝 Contributing

This is an educational project. Feel free to modify and improve it!

---

**Happy Coding! 🚀**

For more information or issues, please create an issue in the repository.