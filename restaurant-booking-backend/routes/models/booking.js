const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
});

module.exports = mongoose.model('Booking', bookingSchema);
