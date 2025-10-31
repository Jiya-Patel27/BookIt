const express = require('express');
const router = express.Router();
const Promo = require('../models/Promo');

// POST /api/promo/validate
router.post('/validate', async (req, res) => {
  const { code, price } = req.body;
  if (!code) return res.status(400).json({ error: 'code required' });

  try {
    const promo = await Promo.findOne({ code: code.toUpperCase(), active: true });
    if (!promo) return res.json({ valid: false });

    let discounted = price;
    if (promo.type === 'flat') {
      discounted = Math.max(0, price - promo.value);
    } else if (promo.type === 'percentage') {
      discounted = Math.round(price * (1 - promo.value / 100));
    }

    res.json({ valid: true, code: promo.code, discounted, promo });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
