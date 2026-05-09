const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { primary } = require('../../utils/colors');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('withdraw')
    .setDescription('Retirer de l’argent de la banque')
    .addIntegerOption(option => option.setName('montant').setDescription('Montant').setRequired(true).setMinValue(1)),
  async execute(interaction, client) {
    const amount = interaction.options.getInteger('montant');
    let userData = await client.db.getUser(interaction.user.id, interaction.guild.id);
    if (!userData) {
      await client.db.createUser(interaction.user.id, interaction.guild.id);
      userData = await client.db.getUser(interaction.user.id, interaction.guild.id);
    }
    if (userData.bank < amount) return interaction.reply({ content: '❌ Fonds insuffisants en banque.', ephemeral: true });

    await client.db.updateUser(interaction.user.id, interaction.guild.id, {
      bank: userData.bank - amount,
      balance: userData.balance + amount
    });

    const embed = new EmbedBuilder()
      .setColor(primary)
      .setTitle('🏧 Retrait')
      .setDescription(`**${amount}** ${client.config.economy.currencySymbol} retiré(e)(s) de la banque.`);
    interaction.reply({ embeds: [embed] });
  }
};