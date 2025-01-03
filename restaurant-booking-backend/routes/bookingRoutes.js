const express = require('express');
const mongoose = require('mongoose');
const Booking = require('./models/booking');
const router = express.Router();

// POST /api/bookings - Create a new booking with time slot validation
router.post('/', async (req, res) => {
  try {
    const { date, time } = req.body;

    // Check if the time slot is available for the given date
    const isTimeSlotAvailable = await Booking.findOne({ date, time });

    if (isTimeSlotAvailable) {
      return res.status(400).json({ message: 'Time slot not available' });
    }

    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// API to fetch booked dates for a given month or range
router.get('/booked-dates', async (req, res) => { // Fixed route
  try {
    // Get all booked dates from the database
    const bookings = await Booking.find({ status: 'booked' }).select('date');

    // Extract just the dates and format them
    const bookedDates = bookings.map(booking => booking.date);

    // Send the response back to the client
    res.json({
      success: true,
      bookedDates,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch booked dates' });
  }
});

// DELETE /api/bookings/:id - Delete a booking by id
router.delete('/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
