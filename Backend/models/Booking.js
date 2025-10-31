const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  experience: { type: mongoose.Schema.Types.ObjectId, ref: 'Experience', required: true },
  slotId: { type: mongoose.Schema.Types.ObjectId, required: true },
  slotDate: { type: String, required: true },
  slotTime: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  quantity: { type: Number, default: 1 },
  pricePaid: { type: Number, required: true },
  promoApplied: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
