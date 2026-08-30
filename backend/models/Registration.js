import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['registered', 'cancelled', 'attended', 'no-show'],
      default: 'registered'
    },
    cancellationReason: {
      type: String,
      sparse: true
    },
    cancelledAt: {
      type: Date,
      sparse: true
    },
    attendedAt: {
      type: Date,
      sparse: true
    },
    registrationNumber: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Compound index to prevent duplicate registrations
registrationSchema.index({ student: 1, event: 1 }, { unique: true });
registrationSchema.index({ event: 1, status: 1 });
registrationSchema.index({ student: 1, status: 1 });

export default mongoose.model('Registration', registrationSchema);
