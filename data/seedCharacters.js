const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Character = require('../models/character');
const Talent = require('../models/talent');
require('dotenv').config();

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

// Read characters from the JSON file
async function loadCharacters() {
  try {
    const dataPath = path.join(__dirname, 'characters.json');
    const data = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading characters.json:', err);
    process.exit(1);
  }
}

// Get talent IDs by name
async function getTalentIdsByName(talentNames) {
  try {
    const talents = await Talent.find({ name: { $in: talentNames } }).select('_id name');
    return talents.map(t => t._id);
  } catch (err) {
    console.error('Error fetching talents by name:', err);
    throw err;
  }
}

// Add characters to the database
async function addCharacters() {
  const characters = await loadCharacters();

  try {
    for (const char of characters) {
      const existingCharacter = await Character.findOne({ name: char.name });

      if (!existingCharacter) {
        const talentIds = await getTalentIdsByName(char.talents);
        const newCharacter = await Character.create({
          ...char,
          talents: talentIds
        });
        console.log(`Character added: ${newCharacter.name}`);
      } else {
        console.log(`Character already exists: ${existingCharacter.name}`);
      }
    }
  } catch (err) {
    console.error('Error adding characters:', err);
  } finally {
    mongoose.connection.close();
  }
}

// Run the function to add characters
addCharacters();