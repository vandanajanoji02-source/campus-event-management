import { verifyToken } from '../config/jwt.js';
import User from '../models/User.js';
import Event from '../models/Event.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message
    });
  }
};

export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource',
        requiredRole: allowedRoles,
        userRole: req.userRole
      });
    }
    next();
  };
};

// Check if user is event manager or admin
export const checkEventManager = async (req, res, next) => {
  try {
    const eventId = req.params.id || req.params.eventId;

    if (req.userRole === 'admin') {
      if (eventId) {
        req.event = await Event.findById(eventId);
      }
      return next();
    }

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required'
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Allow if user is organizer, manager, or admin
    const isOrganizer = event.organizer.toString() === req.userId;
    const isManager = event.managers.some(m => m.toString() === req.userId);
    if (!isOrganizer && !isManager) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to manage this event'
      });
    }

    req.event = event;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
