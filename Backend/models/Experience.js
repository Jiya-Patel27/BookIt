const mongoose = require('mongoose');

const TimeSlotSchema = new mongoose.Schema({
  time: { type: String, required: true },
  remaining: { type: Number, required: true }
});

const DateSchema = new mongoose.Schema({
  date: { type: String, required: true },
  slots: [TimeSlotSchema]
});

const ExperienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String },
  description: { type: String },
  image: { type: String },
  duration: { type: String },
  rating: { type: Number, default: 4.8 },
  price: { type: Number, required: true },
  tax: { type: Number, required: true, default: 59 },
  about: { type: String },
  dates: [DateSchema]
});

module.exports = mongoose.model('Experience', ExperienceSchema);
