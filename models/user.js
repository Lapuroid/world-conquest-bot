const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  discordId: {
    type: String,
    required: [true, 'Discord ID is required'],
    unique: true,
    trim: true,
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
  },
  selectedCharacter: {
    type: Schema.Types.ObjectId,
    ref: 'Character',
    default: null,
  },
}, {
  timestamps: true,
});

const User = model('User', UserSchema);

module.exports = User;
