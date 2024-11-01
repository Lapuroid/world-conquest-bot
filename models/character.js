const { Schema, model } = require('mongoose');

const characterSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Character name is required'],
    unique: true,
    trim: true,
  },
  alias: {
    type: Array,
    required: [true, 'Alias, lowercase required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  empire: {
    type: String,
    required: [true, 'Empire name is required'],
    trim: true,
  },
  talent: {
    type: String,
    required: [true, 'Talent is required'],
    trim: true,
  },
  stats: {
    type: Object,
    required: [true, 'Stats are required']
  }
}, {
  timestamps: true,
});

const Character = model('Character', characterSchema);

module.exports = Character;