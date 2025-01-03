const express = require('express');
const mongoose = require('mongoose');
const Booking = require('./models/booking');
const router = express.Router();

router.get('/', async (req, res) => {
    const { date } = req.query; // Date should be in 'YYYY-MM-DD' format
  
    if (!date) {
      return res.status(400).json({ success: false, message: "Date is required" });
    }
  
    try {
      const bookingsOnDate = await Booking.find({ date });
      const bookedSlots = bookingsOnDate.map(booking => booking.time);
      const availableSlots = ["12:00 PM", "1:00 PM", "3:00 PM", "4:00 PM"];
      const available = availableSlots.filter(slot => !bookedSlots.includes(slot));
  
      res.json({
        success: true,
        bookedDates: bookedSlots,
        available,
      });
    } catch (error) {
      console.error("Error fetching available slots:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch available slots",
        error: error.message,
      });
    }
  });
  

// Book slot
router.post('/', async (req, res) => {
  const { date, timeSlot, name, email } = req.body;

  if (!date || !timeSlot || !name || !email) {
    return res.status(400).json({ message: "All fields (date, timeSlot, name, email) are required" });
  }

  try {
    // Check if the time slot is already booked
    const isTimeSlotBooked = await Booking.findOne({ date, time: timeSlot });

    if (isTimeSlotBooked) {
      return res.json({ success: false, message: "Slot already booked or unavailable." });
    }

    // If the slot is available, save the booking
    const newBooking = new Booking({
      date,
      time: timeSlot,
      name,
      email
    });

    await newBooking.save();
    res.json({ success: true, message: "Booking successful." });
  } catch (error) {
    console.error("Error saving booking:", error);
    res.status(500).json({ message: "Failed to save booking", error: error.message });
  }
});

module.exports = router;
