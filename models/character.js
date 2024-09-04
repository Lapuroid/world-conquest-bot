const { Schema, model } = require('mongoose');

const characterSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Character name is required'],
    unique: true,
    trim: true,
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
  talents: [{
    type: Schema.Types.ObjectId,
    ref: 'Talent',
  }],
}, {
  timestamps: true,
});

const Character = model('Character', characterSchema);

module.exports = Character;