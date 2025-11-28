require('dotenv').config();
const mongoose = require('mongoose');
const Experience = require('./models/Experience');
const Promo = require('./models/Promo');
const experiences = require('./data/experiences.json');

// const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bookit';
const MONGO_URI = process.env.MONGO_URI;

async function seed() {
  await mongoose.connect(MONGO_URI, {});

  await Experience.deleteMany({});
  await Promo.deleteMany({});

  await Experience.insertMany(experiences);

  const promos = [
    { code: 'SAVE10', type: 'percentage', value: 10, active: true },
    { code: 'FLAT100', type: 'flat', value: 100, active: true }
  ];
  await Promo.insertMany(promos);

  console.log('✅ Seed complete with new structure');
  mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  mongoose.disconnect();
});
