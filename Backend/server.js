require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const experiencesRoute = require('./routes/experiences');
const bookingsRoute = require('./routes/booking');
const promoRoute = require('./routes/promo');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/experiences', experiencesRoute);
app.use('/api/bookings', bookingsRoute);
app.use('/api/promo', promoRoute);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bookit';

mongoose.connect(MONGO_URI, { })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
