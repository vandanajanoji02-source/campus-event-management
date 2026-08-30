import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import { validationResult } from 'express-validator';

// Create an event (admin only)
export const createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, category, date, time, location, capacity, registrationDeadline, tags } = req.body;

    const event = new Event({
      title,
      description,
      category,
      date,
      time,
      location,
      capacity,
      registrationDeadline,
      tags: tags || [],
      organizer: req.userId
    });

    await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all events with filtering and search
export const getAllEvents = async (req, res) => {
  try {
    const { category, search, sortBy = 'date', eventStatus = 'published' } = req.query;

    let query = {};

    // Only show published events to students, all events to admins/organizers
    if (req.userRole === 'student') {
      query.eventStatus = 'published';
    } else if (eventStatus && eventStatus !== 'all') {
      query.eventStatus = eventStatus;
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email')
      .populate('managers', 'name email')
      .sort(sortBy === 'popularity' ? { registrationCount: -1 } : { date: 1 });

    await Promise.all(events.map(async (event) => {
      event.registrationCount = await Registration.countDocuments({
        event: event._id,
        status: 'registered'
      });
    }));

    res.json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    event.registrationCount = await Registration.countDocuments({
      event: event._id,
      status: 'registered'
    });

    res.json({
      success: true,
      event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update event (admin only)
export const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this event'
      });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete event (admin only)
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this event'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get event statistics (admin only)
export const getEventStatistics = async (req, res) => {
  try {
    const eventId = req.params.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const registrations = await Registration.find({ event: eventId });

    const registeredCount = registrations.filter(r => r.status === 'registered').length;
    const stats = {
      totalRegistrations: registrations.length,
      registeredCount,
      cancelledCount: registrations.filter(r => r.status === 'cancelled').length,
      attendedCount: registrations.filter(r => r.status === 'attended').length,
      capacityFilled: Math.round((registeredCount / event.capacity) * 100)
    };

    res.json({
      success: true,
      eventId,
      eventTitle: event.title,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
