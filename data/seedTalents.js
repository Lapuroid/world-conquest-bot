const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Talent = require('../models/talent');
require('dotenv').config();

// Define MongoDB connection string
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Error: MongoDB URI is not defined in .env file.');
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Read talents from the JSON file
async function loadTalents() {
  try {
    const dataPath = path.join(__dirname, 'talents.json');
    const data = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading talents.json:', err);
    process.exit(1);
  }
}

// Add talents to the database
async function addTalents() {
  const talents = await loadTalents();

  try {
    for (const talent of talents) {
      const existingTalent = await Talent.findOne({ name: talent.name });

      if (!existingTalent) {
        const newTalent = await Talent.create(talent);
        console.log(`Talent added: ${newTalent.name}`);
      } else {
        console.log(`Talent already exists: ${existingTalent.name}`);
      }
    }
  } catch (err) {
    console.error('Error adding talents:', err);
  } finally {
    mongoose.connection.close();
  }
}

// Run the function to add talents
addTalents();