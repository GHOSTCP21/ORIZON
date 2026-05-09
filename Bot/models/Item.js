const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true },
  name: String,
  description: String,
  price: Number,
  emoji: String,
  roleToGive: String // ID rôle si applicable
});

module.exports = mongoose.model('Item', itemSchema);