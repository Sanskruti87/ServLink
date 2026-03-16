const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    serviceType: {
      type: String,
      enum: ['electrician', 'plumber', 'cleaner', 'carpenter'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    scheduledTime: {
      type: Date,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['upi', 'cash', 'card'],
      required: true,
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

module.exports = mongoose.model('Booking', bookingSchema);

