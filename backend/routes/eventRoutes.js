import express from 'express';
import { body } from 'express-validator';
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventStatistics
} from '../controllers/eventController.js';
import { authenticate, authorize, checkEventManager } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Protected routes - Create event (organizer, admin)
router.post(
  '/',
  authenticate,
  authorize(['organizer', 'admin']),
  [
    body('title', 'Title is required').trim().notEmpty(),
    body('description', 'Description is required').trim().notEmpty(),
    body('category', 'Category is required').isIn(['technical', 'cultural', 'sports', 'academic', 'other']),
    body('date', 'Date is required').isISO8601(),
    body('time', 'Time is required').notEmpty(),
    body('location', 'Location is required').trim().notEmpty(),
    body('capacity', 'Capacity must be a positive number').isInt({ min: 1 }),
    body('registrationDeadline', 'Registration deadline is required').isISO8601()
  ],
  createEvent
);

// Update and Delete - Check if user is manager
router.put('/:id', authenticate, checkEventManager, updateEvent);
router.delete('/:id', authenticate, checkEventManager, deleteEvent);
router.get('/:id/statistics', authenticate, checkEventManager, getEventStatistics);

export default router;
