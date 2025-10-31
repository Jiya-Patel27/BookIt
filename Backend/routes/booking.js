const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');


// POST /api/bookings
// body: { experienceId, slotId, name, email, phone, promoCode, quantity }
router.post('/', async (req, res) => {
  try {
    const { experienceId, slotId, name, email, phone, promoCode, quantity = 1 } = req.body;

    if (!experienceId || !slotId || !name || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const qty = parseInt(quantity, 10) || 1;
    if (qty <= 0) return res.status(400).json({ error: 'Invalid quantity' });

    // Step 1: find experience and locate date & slot (so we can read price/time/date & remaining)
    const exp = await Experience.findById(experienceId).lean();
    if (!exp) return res.status(404).json({ error: 'Experience not found' });

    // find date object and slot object
    let foundDate = null;
    let foundSlot = null;
    for (const d of exp.dates || []) {
      const s = (d.slots || []).find(slot => String(slot._id) === String(slotId));
      if (s) {
        foundDate = d;
        foundSlot = s;
        break;
      }
    }

    if (!foundSlot) {
      return res.status(404).json({ error: 'Slot not found' });
    }

    if ((foundSlot.remaining || 0) < qty) {
      return res.status(400).json({ error: `Only ${foundSlot.remaining || 0} seats available` });
    }

    // Step 2: atomically decrement remaining using arrayFilters
    // We need to update the specific nested slot: dates.$[d].slots.$[s].remaining
    const updateResult = await Experience.updateOne(
      { _id: experienceId },
      { $inc: { 'dates.$[d].slots.$[s].remaining': -qty } },
      {
        arrayFilters: [
          { 'd.date': foundDate.date },
          { 's._id': new mongoose.Types.ObjectId(slotId) }
        ]
      }
    );

    // If updateResult.nModified is 0 then something went wrong (race condition)
    // But updateOne with arrayFilters doesn't return nModified reliably in newer drivers; verify by re-query
    const refreshed = await Experience.findById(experienceId).lean();
    let refreshedSlot = null;
    for (const d of refreshed.dates || []) {
      const s = (d.slots || []).find(slot => String(slot._id) === String(slotId));
      if (s) {
        refreshedSlot = s;
        break;
      }
    }

    if (!refreshedSlot) {
      return res.status(500).json({ error: 'Slot disappeared after update, please try again' });
    }

    if (refreshedSlot.remaining < 0) {
      // rollback decrement (shouldn't normally happen) — try to re-increment back
      await Experience.updateOne(
        { _id: experienceId },
        { $inc: { 'dates.$[d].slots.$[s].remaining': qty } },
        { arrayFilters: [{ 'd.date': foundDate.date }, { 's._id': mongoose.Types.ObjectId(slotId) }] }
      );
      return res.status(409).json({ error: 'Not enough seats left' });
    }

    // Step 3: compute paid price (price * qty). Promo handling could be added here.
    const pricePerSeat = foundSlot.price ?? exp.price ?? 0;
    const pricePaid = pricePerSeat * qty;

    // Step 4: create booking document
    const booking = new Booking({
      experience: experienceId,
      slotId,
      slotDate: foundDate.date,
      slotTime: foundSlot.time,
      name,
      email,
      phone,
      quantity: qty,
      pricePaid,
      promoApplied: promoCode || null
    });

    await booking.save();

    return res.json({ success: true, bookingId: booking._id, pricePaid });
  } catch (err) {
    console.error('Booking error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
