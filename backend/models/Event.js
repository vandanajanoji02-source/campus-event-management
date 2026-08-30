import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a description']
    },
    category: {
      type: String,
      enum: ['technical', 'cultural', 'sports', 'academic', 'other'],
      required: true
    },
    date: {
      type: Date,
      required: [true, 'Please provide an event date']
    },
    time: {
      type: String,
      required: [true, 'Please provide an event time']
    },
    location: {
      type: String,
      required: [true, 'Please provide event location']
    },
    capacity: {
      type: Number,
      required: [true, 'Please provide event capacity'],
      min: 1
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Please provide registration deadline']
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    managers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    eventStatus: {
      type: String,
      enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled'],
      default: 'published'
    },
    image: {
      type: String,
      default: null
    },
    tags: [String],
    registrationCount: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for better search performance
eventSchema.index({ title: 'text', description: 'text', category: 1 });
eventSchema.index({ date: 1 });

export default mongoose.model('Event', eventSchema);
