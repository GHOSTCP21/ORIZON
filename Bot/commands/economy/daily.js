const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { primary } = require('../../utils/colors');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Récupérer votre récompense quotidienne'),
  async execute(interaction, client) {
    let userData = await client.db.getUser(interaction.user.id, interaction.guild.id);
    if (!userData) {
      await client.db.createUser(interaction.user.id, interaction.guild.id);
      userData = await client.db.getUser(interaction.user.id, interaction.guild.id);
    }
    const cooldown = 8.64e7; // 24h
    const lastUsed = userData.dailyLastUsed ? new Date(userData.dailyLastUsed).getTime() : 0;
    if (Date.now() - lastUsed < cooldown) {
      const timeLeft = cooldown - (Date.now() - lastUsed);
      const hours = Math.floor(timeLeft / 3.6e6);
      return interaction.reply({ content: `⏳ Revenez dans ${hours}h pour votre récompense.`, ephemeral: true });
    }
    const amount = client.config.economy.dailyReward;
    await client.db.updateUser(interaction.user.id, interaction.guild.id, {
      balance: userData.balance + amount,
      dailyLastUsed: new Date().toISOString()
    });
    const embed = new EmbedBuilder()
      .setColor(primary)
      .setTitle('🎁 Récompense quotidienne')
      .setDescription(`Vous avez reçu **${amount}** ${client.config.economy.currencySymbol}`);
    interaction.reply({ embeds: [embed] });
  }
};