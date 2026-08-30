import express from 'express';
import {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
  getEventRegistrations,
  checkRegistration
} from '../controllers/registrationController.js';
import { authenticate, authorize, checkEventManager } from '../middleware/auth.js';

const router = express.Router();

// Protected routes - Student registration
router.post('/', authenticate, registerForEvent);
router.get('/my-registrations', authenticate, getMyRegistrations);
router.delete('/:registrationId', authenticate, cancelRegistration);
router.get('/check/:eventId', authenticate, checkRegistration);

// Admin/Organizer routes - Manage registrations for their events
router.get('/event/:eventId', authenticate, checkEventManager, getEventRegistrations);

export default router;
