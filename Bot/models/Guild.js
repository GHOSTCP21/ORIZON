const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  prefix: { type: String, default: '/' },
  logChannel: String,
  suggestionChannel: String,
  reportChannel: String,
  antiSpam: { type: Boolean, default: true },
  antiLinks: { type: Boolean, default: true }
});

module.exports = mongoose.model('Guild', guildSchema);