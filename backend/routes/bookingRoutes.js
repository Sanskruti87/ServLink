const express = require('express');
const Booking = require('../models/Booking');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/bookings/create - Customer creates a booking
router.post('/create', authMiddleware('customer'), async (req, res) => {
  try {
    const { providerId, serviceType, price, scheduledTime, paymentMethod } = req.body;

    if (!providerId || !serviceType || !price || !scheduledTime || !paymentMethod) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const provider = await User.findById(providerId);
    if (!provider || provider.role !== 'provider') {
      return res.status(400).json({ message: 'Invalid provider' });
    }

    const booking = await Booking.create({
      customerId: req.user.id,
      providerId,
      serviceType,
      price,
      scheduledTime,
      paymentMethod,
      status: 'pending',
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error('Create booking error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/bookings/customer - Get bookings for logged-in customer
router.get('/customer', authMiddleware('customer'), async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.id })
      .populate('providerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error('Get customer bookings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/bookings/provider - Get bookings for logged-in provider
router.get('/provider', authMiddleware('provider'), async (req, res) => {
  try {
    const bookings = await Booking.find({ providerId: req.user.id })
      .populate('customerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error('Get provider bookings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/bookings/updateStatus - Provider updates booking status
router.put('/updateStatus', authMiddleware('provider'), async (req, res) => {
  try {
    const { bookingId, status } = req.body;

    if (!bookingId || !status) {
      return res.status(400).json({ message: 'Booking ID and status are required' });
    }

    if (!['accepted', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findOne({ _id: bookingId, providerId: req.user.id });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (err) {
    console.error('Update booking status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

