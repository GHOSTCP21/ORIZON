const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  guildId: { type: String, required: true },
  balance: { type: Number, default: 0 },
  bank: { type: Number, default: 0 },
  dailyLastUsed: { type: Date },
  workLastUsed: { type: Date },
  inventory: [
    {
      itemId: String,
      quantity: Number,
      _id: false
    }
  ],
  warnings: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', userSchema);