import Registration from '../models/Registration.js';
import Event from '../models/Event.js';

// Register for an event
export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if event is still open for registration
    if (event.eventStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Event has been cancelled, registration not possible'
      });
    }

    // Check registration deadline
    const now = new Date();
    if (now > event.registrationDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline has passed',
        deadlineDate: event.registrationDeadline
      });
    }

    // Check if already registered (and not cancelled)
    let registration = await Registration.findOne({
      student: req.userId,
      event: eventId
    });

    if (registration && registration.status === 'registered') {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event',
        alreadyRegistered: true
      });
    }

    // Count only active registrations so cancellations free a seat.
    const activeRegistrationCount = await Registration.countDocuments({
      event: eventId,
      status: 'registered'
    });

    // Check event capacity using the current database total.
    if (activeRegistrationCount >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Event is full, no more registrations available',
        capacityFull: true,
        currentRegistrations: activeRegistrationCount,
        capacity: event.capacity
      });
    }

    // Create registration
    if (!registration) {
      registration = new Registration({
        student: req.userId,
        event: eventId
      });
    } else {
      // Reuse a cancelled record so the unique student/event index remains valid.
      registration.status = 'registered';
      registration.cancelledAt = null;
      registration.cancellationReason = null;
      registration.registeredAt = new Date();
    }

    await registration.save();

    // Keep the denormalized counter synchronized with active registrations.
    event.registrationCount = await Registration.countDocuments({
      event: eventId,
      status: 'registered'
    });
    await event.save();

    res.status(201).json({
      success: true,
      message: 'Successfully registered for the event',
      registration,
      registrationNumber: event.registrationCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user's registrations with status filtering
export const getMyRegistrations = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = { student: req.userId };
    
    if (status) {
      filter.status = status;
    }

    const registrations = await Registration.find(filter)
      .populate({
        path: 'event',
        select: 'title description category date time location capacity registrationCount eventStatus'
      })
      .sort({ registeredAt: -1 });

    // Separate by status
    const registered = registrations.filter(r => r.status === 'registered');
    const cancelled = registrations.filter(r => r.status === 'cancelled');
    const attended = registrations.filter(r => r.status === 'attended');

    res.json({
      success: true,
      count: registrations.length,
      registrations,
      summary: {
        totalRegistrations: registrations.length,
        registeredCount: registered.length,
        cancelledCount: cancelled.length,
        attendedCount: attended.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Cancel registration
export const cancelRegistration = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const { reason } = req.body;

    let registration = await Registration.findById(registrationId);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Check if user owns this registration
    if (registration.student.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own registrations'
      });
    }

    if (registration.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Registration is already cancelled'
      });
    }

    // Update registration
    registration.status = 'cancelled';
    registration.cancellationReason = reason || '';
    registration.cancelledAt = new Date();
    await registration.save();

    // Recalculate the counter from active registrations after cancellation.
    const event = await Event.findById(registration.event);
    if (event) {
      event.registrationCount = await Registration.countDocuments({
        event: event._id,
        status: 'registered'
      });
      await event.save();
    }

    res.json({
      success: true,
      message: 'Registration cancelled successfully',
      registration
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get event registrations (admin only)
export const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    const registrations = await Registration.find({
      event: eventId,
      status: 'registered'
    }).populate('student', 'name email enrollmentNumber department');

    res.json({
      success: true,
      count: registrations.length,
      registrations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Check if user is registered for an event
export const checkRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;

    const registration = await Registration.findOne({
      student: req.userId,
      event: eventId
    }).populate('event', 'title registrationDeadline');

    res.json({
      success: true,
      isRegistered: !!(registration && registration.status === 'registered'),
      registrationStatus: registration?.status || null,
      registration,
      canReregister: registration?.status === 'cancelled' ? false : true,
      registrationDetails: registration ? {
        status: registration.status,
        registeredAt: registration.registeredAt,
        cancelledAt: registration.cancelledAt,
        cancellationReason: registration.cancellationReason
      } : null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
