const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { primary } = require('../../utils/colors');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Travailler pour gagner des ORZ Coins'),
  async execute(interaction, client) {
    let userData = await client.db.getUser(interaction.user.id, interaction.guild.id);
    if (!userData) {
      await client.db.createUser(interaction.user.id, interaction.guild.id);
      userData = await client.db.getUser(interaction.user.id, interaction.guild.id);
    }
    const cooldown = 3.6e6; // 1h
    const lastUsed = userData.workLastUsed ? new Date(userData.workLastUsed).getTime() : 0;
    if (Date.now() - lastUsed < cooldown) {
      const timeLeft = cooldown - (Date.now() - lastUsed);
      const minutes = Math.floor(timeLeft / 60000);
      return interaction.reply({ content: `⏳ Tu dois attendre ${minutes}min avant de retravailler.`, ephemeral: true });
    }
    const min = client.config.economy.workMin;
    const max = client.config.economy.workMax;
    const gain = Math.floor(Math.random() * (max - min + 1)) + min;
    await client.db.updateUser(interaction.user.id, interaction.guild.id, {
      balance: userData.balance + gain,
      workLastUsed: new Date().toISOString()
    });
    const embed = new EmbedBuilder()
      .setColor(primary)
      .setTitle('💼 Travail')
      .setDescription(`Tu as gagné **${gain}** ${client.config.economy.currencySymbol} !`);
    interaction.reply({ embeds: [embed] });
  }
};