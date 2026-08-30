# Complete File Listing & Descriptions

## 📋 Root Directory Files

### Documentation Files
- **README.md** - Comprehensive project documentation with API reference, setup, and database schema
- **QUICKSTART.md** - Quick reference guide with commands, test accounts, and cheat sheet
- **SETUP_GUIDE.md** - Detailed setup walkthrough with architecture, concepts, and debugging
- **PROJECT_SUMMARY.md** - Complete project overview and summary
- **CODE_EXAMPLES.md** - Backend and frontend code patterns with examples
- **GIT_SETUP.md** - Git and GitHub setup instructions
- **DOCUMENTATION_INDEX.md** - Guide to navigate all documentation (this file)
- **.gitignore** - Git ignore configuration for node_modules, .env, etc.

---

## 🗂️ Backend Directory (`backend/`)

### Configuration Files
- **package.json** - Node.js dependencies and scripts
- **.env.example** - Environment variables template

### Core Files
- **server.js** - Express server setup, middleware, routes, error handling

### Config Directory (`backend/config/`)
- **database.js** - MongoDB connection configuration
- **jwt.js** - JWT token generation and verification utilities

### Models Directory (`backend/models/`)
- **User.js** - User schema (name, email, password, role, enrollment, etc.)
- **Event.js** - Event schema (title, description, date, capacity, organizer, etc.)
- **Registration.js** - Registration schema (student, event, status, cancellation, etc.)

### Controllers Directory (`backend/controllers/`)
- **userController.js** - User endpoints (register, login, profile, list students)
- **eventController.js** - Event endpoints (CRUD, search, filter, statistics)
- **registrationController.js** - Registration endpoints (register, cancel, manage)

### Routes Directory (`backend/routes/`)
- **userRoutes.js** - User API routes with validation
- **eventRoutes.js** - Event API routes with authorization
- **registrationRoutes.js** - Registration API routes

### Middleware Directory (`backend/middleware/`)
- **auth.js** - JWT authentication and role-based authorization middleware

---

## 🗂️ Frontend Directory (`frontend/`)

### Configuration Files
- **package.json** - React dependencies and scripts
- **.env** (optional) - Frontend environment variables

### Public Directory (`frontend/public/`)
- **index.html** - HTML template for React app

### Source Directory (`frontend/src/`)

#### Main Files
- **App.js** - Main React component with routing and route protection
- **index.js** - React entry point
- **index.css** - Global styles (colors, layouts, responsive design)

#### Components Directory (`frontend/src/components/`)
- **Navbar.js** - Navigation bar with user menu
- **Footer.js** - Footer component with links
- **EventCard.js** - Reusable event card with capacity display

#### Context Directory (`frontend/src/context/`)
- **AuthContext.js** - Authentication state management with useAuth hook

#### Pages Directory (`frontend/src/pages/`)
- **Home.js** - Home/landing page with features overview
- **Login.js** - User login page with form
- **Register.js** - User registration page with validation
- **EventList.js** - Events listing with search and filtering
- **EventDetail.js** - Event details page with registration
- **MyRegistrations.js** - Student's event registrations with cancel option
- **CreateEvent.js** - Admin page to create new events
- **AdminDashboard.js** - Admin dashboard with event management
- **Profile.js** - User profile management page

#### Services Directory (`frontend/src/services/`)
- **api.js** - Axios API client with JWT interceptor and all API endpoints

---

## 📊 File Statistics

### Backend Files
- Configuration files: 2
- Model files: 3
- Controller files: 3
- Route files: 3
- Middleware files: 1
- **Total: ~500 lines of backend code**

### Frontend Files
- Component files: 3
- Context files: 1
- Page files: 9
- Service files: 1
- CSS files: 1
- **Total: ~2000+ lines of frontend code**

### Documentation Files
- README.md: ~600 lines
- SETUP_GUIDE.md: ~500 lines
- QUICKSTART.md: ~300 lines
- CODE_EXAMPLES.md: ~400 lines
- PROJECT_SUMMARY.md: ~400 lines
- GIT_SETUP.md: ~300 lines
- DOCUMENTATION_INDEX.md: ~300 lines
- **Total: ~2800 lines of documentation**

**Grand Total: ~5300+ lines of code and documentation**

---

## 🔄 File Dependencies

### Backend Dependencies
```
server.js
├── config/database.js         (Connect to MongoDB)
├── config/jwt.js              (Generate tokens)
├── models/User.js             (User schema)
├── models/Event.js            (Event schema)
├── models/Registration.js     (Registration schema)
├── middleware/auth.js         (Protect routes)
├── controllers/
│   ├── userController.js      (User logic)
│   ├── eventController.js     (Event logic)
│   └── registrationController.js (Reg logic)
└── routes/
    ├── userRoutes.js          (User endpoints)
    ├── eventRoutes.js         (Event endpoints)
    └── registrationRoutes.js  (Reg endpoints)
```

### Frontend Dependencies
```
App.js
├── context/AuthContext.js     (Auth state)
├── components/
│   ├── Navbar.js              (Navigation)
│   ├── Footer.js              (Footer)
│   └── EventCard.js           (Event display)
├── pages/
│   ├── Home.js                (Landing)
│   ├── Login.js               (Auth)
│   ├── Register.js            (Auth)
│   ├── EventList.js           (Browse)
│   ├── EventDetail.js         (Details)
│   ├── MyRegistrations.js     (Student)
│   ├── CreateEvent.js         (Admin)
│   ├── AdminDashboard.js      (Admin)
│   └── Profile.js             (User)
└── services/api.js            (API calls)
```

---

## 🎯 File Purposes Summary

| File | Type | Purpose |
|------|------|---------|
| server.js | Backend | Express setup & middleware |
| User.js | Model | User data structure |
| Event.js | Model | Event data structure |
| Registration.js | Model | Registration data structure |
| userController.js | Logic | User operations |
| eventController.js | Logic | Event operations |
| registrationController.js | Logic | Registration operations |
| auth.js | Security | JWT & authorization |
| userRoutes.js | API | User endpoints |
| eventRoutes.js | API | Event endpoints |
| registrationRoutes.js | API | Registration endpoints |
| App.js | Frontend | Routing & layout |
| AuthContext.js | State | Auth state management |
| Navbar.js | UI | Navigation menu |
| Footer.js | UI | Footer content |
| EventCard.js | UI | Event display card |
| Home.js | Page | Home page |
| Login.js | Page | Login form |
| Register.js | Page | Registration form |
| EventList.js | Page | Events listing |
| EventDetail.js | Page | Event details |
| MyRegistrations.js | Page | Student registrations |
| CreateEvent.js | Page | Create event form |
| AdminDashboard.js | Page | Admin panel |
| Profile.js | Page | User profile |
| api.js | Service | API calls |

---

## 📝 File Relationships

### Authentication Flow Files
1. user submits → Register.js/Login.js
2. API call → api.js
3. Backend processes → userController.js
4. User saved → User.js (model)
5. Token generated → jwt.js
6. Token stored → localStorage
7. State updated → AuthContext.js
8. User redirected → App.js routing

### Event Registration Flow Files
1. Student views → EventDetail.js
2. Clicks register → EventDetail.js
3. API call → api.js
4. Backend validates → registrationController.js
5. Data saved → Registration.js (model)
6. Event count updated → Event.js (model)
7. Status shown → EventDetail.js/MyRegistrations.js

---

## 🔐 Security-Related Files
- **auth.js** - Authentication middleware
- **User.js** - Password hashing
- **jwt.js** - Token management
- **.env.example** - Secrets configuration
- **userController.js** - Password handling

---

## 📱 Responsive Design Files
- **index.css** - Responsive styles
- **Navbar.js** - Bootstrap navbar
- **EventCard.js** - Bootstrap cards
- All pages use Bootstrap grid system

---

## 🧪 Testing Reference Files
- **QUICKSTART.md** - Test accounts and workflows
- **API endpoints in api.js** - All API calls available
- **SETUP_GUIDE.md** - Testing sections

---

## 🎓 Learning Resource Files
- **README.md** - Project explanation
- **SETUP_GUIDE.md** - Concepts & patterns
- **CODE_EXAMPLES.md** - Implementation examples
- **GIT_SETUP.md** - Version control learning
- **DOCUMENTATION_INDEX.md** - Learning paths

---

## 🚀 Deployment Files
- **.env.example** - Config template
- **.gitignore** - Build artifacts
- **package.json** - Dependencies

---

## 📊 Complete File Count

- Backend code files: 10+
- Frontend code files: 15+
- Documentation files: 7
- Configuration files: 4
- **Total: 36+ files**

---

## ⚙️ How to Use Each File

### As a Beginner
1. Run: server.js + frontend
2. Read: README.md
3. Explore: User.js, Event.js, Registration.js
4. Learn: eventController.js logic
5. Study: EventList.js, EventCard.js

### As an Intermediate Developer
1. Understand: auth.js middleware
2. Study: All controllers
3. Learn: All routes
4. Explore: All pages
5. Practice: Modify and extend

### As an Advanced Developer
1. Review: Architecture in SETUP_GUIDE.md
2. Optimize: Database queries
3. Enhance: Add features
4. Deploy: Use deployment checklist
5. Contribute: Create PRs

---

**Every file has a purpose and is essential to the project!** 🎯

---

*For navigation help, see DOCUMENTATION_INDEX.md*
