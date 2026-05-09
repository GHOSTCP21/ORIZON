const { EmbedBuilder } = require('discord.js');
const { primary } = require('./colors');
const config = require('../config.json');

module.exports = {
  log(client, guild, content) {
    const channel = guild.channels.cache.get(config.channels.logs);
    if (!channel) return;
    const embed = new EmbedBuilder()
      .setColor(primary)
      .setTitle('📝 Log')
      .setDescription(content)
      .setTimestamp();
    channel.send({ embeds: [embed] });
  }
};