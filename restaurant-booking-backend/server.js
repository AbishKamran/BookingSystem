require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bookingRoutes = require('./routes/bookingRoutes');
const slotRoutes = require('./routes/slotRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use('/api/bookings', bookingRoutes);
app.use('/api/slots', slotRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.log(error));
