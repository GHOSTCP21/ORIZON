const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { primary } = require('../../utils/colors');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('Voir les articles disponibles à l’achat'),
  async execute(interaction, client) {
    const items = await client.db.getAllItems();
    if (items.length === 0) return interaction.reply({ content: '❌ La boutique est vide.', ephemeral: true });

    const embed = new EmbedBuilder()
      .setColor(primary)
      .setTitle('🛒 Boutique ORIZON')
      .setDescription(items.map(i => `${i.emoji || ''} **${i.name}** (${i.itemId}) - ${i.price} ${client.config.economy.currencySymbol}\n${i.description}`).join('\n'));
    interaction.reply({ embeds: [embed] });
  }
};