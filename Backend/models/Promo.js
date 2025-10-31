const mongoose = require('mongoose');

const PromoSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ['percentage','flat'], required: true },
  value: { type: Number, required: true },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Promo', PromoSchema);
