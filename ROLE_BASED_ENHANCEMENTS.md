# Campus Event Management - Role-Based System Enhancements

## Overview
This document outlines the comprehensive role-based management system enhancements made to the Campus Event Management System. The system now supports three distinct roles: **Student**, **Organizer**, and **Admin**, with specific permissions and workflows for each.

---

## 🎯 Key Features Implemented

### 1. **Three-Tier Role System**
- **Student**: Browse events, register for events, view registrations, cancel registrations
- **Organizer**: Create events, manage their own events, view registration statistics
- **Admin**: Global access to all events, manage all registrations, assign roles to users

### 2. **Registration Status Management**
- **Registered**: Active enrollment in an event
- **Cancelled**: User cancelled their registration (cannot re-register)
- **Attended**: Event completed, user attended
- **No-show**: Event completed, user did not attend
- Status transitions with proper validation and error messages

### 3. **Duplicate Registration Prevention**
- Compound unique index on `(student, event)` in MongoDB
- Clear error messages when attempting duplicate registration
- Prevents re-registration after cancellation
- Capacity and deadline checks before registration

### 4. **UI Visual Indicators**
- Registration status badges on event cards ("✓ Registered", "⏸ Cancelled")
- Event full indicators with available seat counts
- Progress bars showing capacity filled (red when full, green otherwise)
- Button state changes based on registration status

---

## 📋 Backend Changes

### **Models**

#### `User.js`
```javascript
// New fields added:
role: {
  enum: ['student', 'organizer', 'admin'],
  default: 'student'
},
canCreateEvents: { type: Boolean, default: false },
canManageRegistrations: { type: Boolean, default: false },
managedEvents: [{ type: ObjectId, ref: 'Event' }]
```

#### `Event.js`
```javascript
// New fields added:
managers: [{ type: ObjectId, ref: 'User' }],
eventStatus: {
  enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled'],
  default: 'published'
}
```

#### `Registration.js`
```javascript
// Enhanced fields:
status: {
  enum: ['registered', 'cancelled', 'attended', 'no-show'],
  default: 'registered'
},
registeredAt: { type: Date, default: Date.now },
cancelledAt: { type: Date, sparse: true },
cancellationReason: { type: String, sparse: true },
attendedAt: { type: Date, sparse: true },
registrationNumber: { type: Number }

// Indexes:
- Compound unique index: { student: 1, event: 1 }
- Event status index: { event: 1, status: 1 }
- Student status index: { student: 1, status: 1 }
```

### **Middleware**

#### `auth.js` - Enhanced Authorization
```javascript
authenticate()      // Verifies JWT token, attaches user/userId/userRole to req
authorize(roles)    // Checks if user's role is in allowed list
checkEventManager() // Allows if user is organizer, manager, or admin
```

### **Controllers**

#### `registrationController.js`
**New/Enhanced Methods:**

1. **registerForEvent()** - Enhanced duplicate prevention
   - Checks if already registered
   - Validates event status (not cancelled)
   - Checks registration deadline
   - Prevents re-registration after cancellation
   - Returns detailed error messages

2. **checkRegistration()** - Enhanced response
   - Returns: isRegistered, registrationStatus, canReregister, registrationDetails
   - Provides full registration object with event details

3. **getMyRegistrations()** - Status filtering
   - Filter by status (registered, attended, cancelled)
   - Returns summary counts
   - Populates event details
   - Sorted by most recent first

#### `eventController.js`
**Enhanced Methods:**

1. **getAllEvents()** - Role-based filtering
   - Students see only published events
   - Organizers/Admins can filter by eventStatus
   - Category and search filtering
   - Populates organizer and managers

#### `userController.js`
**New Methods:**

1. **getAllUsers()** - Role-specific queries
   - Filter by role (student, organizer, admin)
   - Exclude passwords from response
   - Populate managed events
   - Return role breakdown statistics

### **Routes**

#### `eventRoutes.js`
```javascript
// Updated authorization:
POST   / - authorize(['organizer', 'admin'])
PUT    /:id - checkEventManager middleware
DELETE /:id - checkEventManager middleware
GET    /:id/statistics - checkEventManager middleware
```

#### `registrationRoutes.js`
```javascript
// Updated authorization:
POST   / - authenticate (any role)
GET    /my-registrations - authenticate
DELETE /:registrationId - authenticate (own registration check)
GET    /event/:eventId - checkEventManager (organizer/admin only)
```

#### `userRoutes.js`
```javascript
// New route:
GET /all-users - authorize(['admin'])
```

---

## 🎨 Frontend Changes

### **Components**

#### `EventCard.js` - Enhanced
**New Features:**
- Real-time registration status check via useEffect
- Status badges ("✓ Registered", "⏸ Cancelled")
- Event full badge with danger color
- Disabled state for registered events
- Loading state while checking registration
- Responsive button text ("✓ Registered" vs "View Details")

**New State:**
```javascript
[isRegistered, setIsRegistered]
[registrationStatus, setRegistrationStatus]
[loading, setLoading]
```

### **Pages**

#### `EventDetail.js` - Enhanced
**Improvements:**
- Better registration status messages
- Clearer error handling with auto-dismiss alerts
- Available seats count display
- Enhanced admin/organizer action panel
- Improved register button with spinner
- Support for organizer role in management panel

#### `MyRegistrations.js` - Major Enhancements
**New Features:**
- **Tabs Interface**: All, Active, Attended, Cancelled
- **Status Counts**: Shows count for each tab
- **Cancellation Details**: Shows cancel date and reason
- **No Results**: Shows appropriate message per tab
- **Improved Cards**: Better visual hierarchy and info display

**Tab Structure:**
```
All (10) | Active (8) | Attended (2) | Cancelled (0)
```

---

## 🔐 Authorization Flow

### **Student Role**
```
✓ View published events
✓ Register for events (if not full/deadline passed)
✓ View own registrations
✓ Cancel own registrations
✗ Create events
✗ Manage other users' registrations
```

### **Organizer Role**
```
✓ View all published events
✓ Create events
✓ Manage own created events
✓ View registration stats for own events
✓ View registrations for own events
✗ Manage other organizers' events
✗ Delete events (admin only)
```

### **Admin Role**
```
✓ View all events (including unpublished)
✓ Filter by event status
✓ Create events
✓ Manage all events
✓ Manage all registrations
✓ View all users
✓ Assign roles
✓ Delete events
```

---

## 📝 API Endpoints

### **Registration Endpoints**

| Method | Endpoint | Role | Response |
|--------|----------|------|----------|
| POST | `/registrations` | Student+ | `{ success, message, registration, registrationNumber }` |
| GET | `/registrations/my-registrations` | Authenticated | `{ success, registrations, summary }` |
| DELETE | `/registrations/:id` | Student+ | `{ success, message, registration }` |
| GET | `/registrations/check/:eventId` | Student+ | `{ success, isRegistered, registrationStatus, canReregister, registrationDetails }` |
| GET | `/registrations/event/:eventId` | Organizer+ | `{ success, registrations }` |

### **Event Endpoints**

| Method | Endpoint | Role | Notes |
|--------|----------|------|-------|
| GET | `/events` | Public | Role-based filtering |
| POST | `/events` | Organizer+ | Event status defaults to 'published' |
| PUT | `/events/:id` | Organizer+ | Only manager/organizer/admin can edit |
| DELETE | `/events/:id` | Organizer+ | Only manager/organizer/admin can delete |
| GET | `/events/:id/statistics` | Organizer+ | Event manager check |

---

## 🔄 Error Handling

### **Registration Errors**
```javascript
{
  success: false,
  message: string,
  alreadyRegistered?: boolean,      // Duplicate attempt
  cannotReregister?: boolean,        // Previously cancelled
  capacityFull?: boolean,            // Event full
  currentRegistrations?: number,     // Current count
  capacity?: number,                 // Max capacity
  deadlineDate?: date               // Registration deadline
}
```

---

## ✨ UI/UX Improvements

### **Visual Indicators**
- **Green Progress Bar**: < 100% capacity
- **Red Progress Bar**: >= 100% capacity
- **Green Badge**: "✓ Registered"
- **Warning Badge**: "⏸ Cancelled"
- **Danger Badge**: "❌ Event Full"

### **User Feedback**
- Immediate status badges on event cards
- Clear error messages with reasons
- Success notifications with 5-second auto-dismiss
- Loading states with spinners
- Available seats count
- Capacity percentage display

### **Tab Navigation**
- Count indicators on each tab
- Easy switching between registration states
- Empty state messages per tab
- Clear visual differentiation

---

## 🔄 Registration Workflow

### **Student Registration Flow**
```
1. Browse Events (see published events only)
   ↓
2. View Event Detail
   ↓
3. Check Registration Status
   ├─ Already Registered → "✓ Registered" badge + disabled button
   ├─ Event Full → "Event is full" message
   ├─ Deadline Passed → "Registration closed" message
   └─ Available → "Register Now" button enabled
   ↓
4. Click Register Now
   ├─ Duplicate check → Error message
   ├─ Capacity check → Error message
   ├─ Deadline check → Error message
   └─ Success → Registration created + badge appears
   ↓
5. View in My Registrations
   ├─ Active tab (default)
   ├─ With cancel button
   └─ Shows registration date
```

### **Cancellation Flow**
```
1. View My Registrations (Active tab)
   ↓
2. Click Cancel on registered event
   ↓
3. Modal opens for cancellation confirmation
   ├─ Optional reason field
   └─ Confirm button
   ↓
4. Cancellation processed
   ├─ Status changes to "cancelled"
   ├─ Cancel date recorded
   ├─ Reason stored (if provided)
   └─ Event registration count decremented
   ↓
5. Show in Cancelled tab
   ├─ Cannot re-register
   └─ Shows cancellation date & reason
```

---

## 📊 Database Indexes

### **Performance Optimizations**
```javascript
// Registration indexes
registrationSchema.index({ student: 1, event: 1 }, { unique: true });
registrationSchema.index({ event: 1, status: 1 });
registrationSchema.index({ student: 1, status: 1 });
```

---

## 🚀 Deployment Notes

### **Required Environment Variables**
```
MONGODB_URI=mongodb://localhost:27017/campus-event-management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

### **Frontend Configuration**
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 📱 Testing Checklist

### **Student Workflows**
- [ ] Browse published events only
- [ ] Register for event (success)
- [ ] Register duplicate (error message)
- [ ] See "Registered" badge on event card
- [ ] View registration in My Registrations tab
- [ ] Cancel registration (shows in Cancelled tab)
- [ ] Cannot re-register after cancellation (error message)
- [ ] Cannot register when event full (error message)
- [ ] Cannot register after deadline (error message)

### **Organizer Workflows**
- [ ] Create event (event status = published)
- [ ] View own events in management panel
- [ ] See registration statistics for own events
- [ ] View registrations for own events
- [ ] Edit own events
- [ ] Cannot edit other organizers' events

### **Admin Workflows**
- [ ] View all events (including unpublished)
- [ ] Create events
- [ ] Manage all events
- [ ] View all users
- [ ] Assign organizer role to users
- [ ] Manage all registrations

---

## 🔗 Related Files Modified

### Backend
- `/backend/models/User.js` - Added role fields and permissions
- `/backend/models/Event.js` - Added event managers and status
- `/backend/models/Registration.js` - Enhanced registration model
- `/backend/middleware/auth.js` - Added checkEventManager middleware
- `/backend/controllers/registrationController.js` - Enhanced registration logic
- `/backend/controllers/eventController.js` - Added role-based filtering
- `/backend/controllers/userController.js` - Added user management
- `/backend/routes/eventRoutes.js` - Updated authorization
- `/backend/routes/registrationRoutes.js` - Updated authorization
- `/backend/routes/userRoutes.js` - Added new routes

### Frontend
- `/frontend/src/components/EventCard.js` - Added registration status display
- `/frontend/src/pages/EventDetail.js` - Enhanced registration handling
- `/frontend/src/pages/MyRegistrations.js` - Added status tabs and filtering

---

## 🎓 Summary of Capabilities

The system now provides a complete role-based event management platform with:

1. **Flexible Role Management**: Three distinct roles with different permissions
2. **Registration Validation**: Prevents duplicates, validates capacity and deadlines
3. **Clear Status Tracking**: Students can see registration status at a glance
4. **Error Prevention**: Comprehensive error handling with user-friendly messages
5. **Improved UX**: Visual indicators, status filters, and better navigation
6. **Organizer Support**: Allows subject matter experts to create and manage events
7. **Admin Control**: Centralized management of all system resources

This implementation satisfies the requirements for role-based event management with proper registration status labeling and duplicate prevention.
