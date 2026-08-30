# Quick Start Cheat Sheet

## 🚀 Run the Project (2 terminals)

### Terminal 1: Backend
```bash
cd backend
npm install        # First time only
npm run dev        # Runs on http://localhost:5000
```

### Terminal 2: Frontend
```bash
cd frontend
npm install        # First time only
npm start          # Opens http://localhost:3000
```

## 📝 Default Test Accounts

### Admin Account
- Email: `admin@example.com`
- Password: `admin123`

First, register as admin:
1. Go to `/register`
2. Fill form
3. Change role to "admin" before submitting (modify in form)

### Student Account
- Email: `student@example.com`
- Password: `student123`

## 🔑 Key Files to Understand

| File | Purpose |
|------|---------|
| `backend/server.js` | Express app setup |
| `backend/config/jwt.js` | JWT token logic |
| `backend/models/*.js` | Database schemas |
| `backend/controllers/*.js` | Business logic |
| `backend/routes/*.js` | API endpoints |
| `frontend/App.js` | React routing |
| `frontend/context/AuthContext.js` | Auth state |
| `frontend/services/api.js` | API calls |

## 🔍 Common Tasks

### Debug Backend
```bash
# Check MongoDB connection
console.log('Connected:', mongoose.connection.host);

# Check JWT token
console.log('Token:', req.headers.authorization);

# See request body
console.log('Request:', req.body);
```

### Debug Frontend
```javascript
// Check token in browser console
localStorage.getItem('token')

// Check auth state
const { user, isAuthenticated } = useAuth();
console.log(user, isAuthenticated);

// Check API response
.then(res => console.log(res.data))
.catch(err => console.log(err.response?.data));
```

## 🗂️ Project Structure Quick Reference

```
backend/
  ├── models/          ← Database schemas
  ├── controllers/     ← Business logic
  ├── routes/          ← API endpoints
  ├── middleware/      ← Auth & validation
  ├── config/          ← Database & JWT
  └── server.js        ← Entry point

frontend/
  ├── pages/           ← Full page components
  ├── components/      ← Reusable components
  ├── context/         ← State management
  ├── services/        ← API calls
  └── App.js           ← Router setup
```

## 📊 Database Collections

### Users
```javascript
{ name, email, password, role, enrollmentNumber, department, semester }
```

### Events
```javascript
{ title, description, category, date, time, location, capacity, 
  registrationDeadline, organizer, registrationCount }
```

### Registrations
```javascript
{ student, event, registeredAt, status, cancellationReason, cancelledAt }
```

## 🔐 Authentication Flow

```
User Login → Email/Password
           → Check in DB
           → Generate JWT
           → Store in localStorage
           → Send with every request
           → Backend verifies JWT
           → Allow/deny access
```

## 🛣️ API Endpoints Reference

### Users
- `POST /users/register` - Register
- `POST /users/login` - Login
- `GET /users/profile` - Get profile
- `PUT /users/profile` - Update profile

### Events
- `GET /events` - List events
- `GET /events/:id` - Get event
- `POST /events` - Create (admin)
- `PUT /events/:id` - Update (admin)
- `DELETE /events/:id` - Delete (admin)
- `GET /events/:id/statistics` - Stats (admin)

### Registrations
- `POST /registrations` - Register for event
- `GET /registrations/my-registrations` - My registrations
- `DELETE /registrations/:id` - Cancel registration
- `GET /registrations/event/:eventId` - See students (admin)

## 🚨 Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `Cannot POST /api/users/register` | Backend not running |
| `MongoDB connection failed` | Check MONGODB_URI in .env |
| `JWT is not defined` | `npm install jsonwebtoken` |
| `CORS error` | Check backend CORS setup |
| `Cannot read property of undefined` | Check response structure |

## 💡 Best Practices

✅ DO:
- Create feature branches
- Make meaningful commits
- Validate on both frontend & backend
- Use environment variables
- Comment complex logic
- Test before pushing

❌ DON'T:
- Commit `.env` file
- Leave console.log in production
- Hardcode URLs/secrets
- Skip error handling
- Modify other's branches

## 🎯 Feature Checklist

### Student Features
- [ ] Register/Login
- [ ] Browse events
- [ ] Search events
- [ ] Filter by category
- [ ] View event details
- [ ] Register for event
- [ ] View my registrations
- [ ] Cancel registration
- [ ] Update profile

### Admin Features
- [ ] Login as admin
- [ ] Create event
- [ ] Update event
- [ ] Delete event
- [ ] View statistics
- [ ] View registered students
- [ ] See capacity filled

## 📚 File Size Reference

- Backend package: ~50MB (node_modules)
- Frontend package: ~200MB (node_modules)
- MongoDB data: Varies (empty by default)

## ⏱️ Expected Load Times

- Backend startup: 2-3 seconds
- Frontend startup: 5-10 seconds (first time)
- API response: <500ms (local)

## 🔄 Workflow for New Feature

1. Create branch: `git checkout -b feature/name`
2. Make changes
3. Test thoroughly
4. Commit: `git commit -m "Add feature"`
5. Push: `git push origin feature/name`
6. Create Pull Request on GitHub

## 📞 Quick Help

```bash
# See npm scripts
npm run

# Clear node_modules
rm -rf node_modules
npm install

# Check port usage
lsof -i :5000        # Mac/Linux
netstat -ano | find ":5000"  # Windows

# See git history
git log --oneline
```

## 🎓 Learning Path

1. **Week 1**: Understand project structure & authentication
2. **Week 2**: Learn event CRUD operations
3. **Week 3**: Understand registration system
4. **Week 4**: Explore admin features & statistics
5. **Week 5+**: Deploy & enhance with new features

---

**Save this file! You'll reference it often.** 📌
