const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { primary } = require('../../utils/colors');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deposit')
    .setDescription('Déposer de l’argent à la banque')
    .addIntegerOption(option => option.setName('montant').setDescription('Montant').setRequired(true).setMinValue(1)),
  async execute(interaction, client) {
    const amount = interaction.options.getInteger('montant');
    let userData = await client.db.getUser(interaction.user.id, interaction.guild.id);
    if (!userData) {
      await client.db.createUser(interaction.user.id, interaction.guild.id);
      userData = await client.db.getUser(interaction.user.id, interaction.guild.id);
    }
    if (userData.balance < amount) return interaction.reply({ content: '❌ Solde insuffisant.', ephemeral: true });

    await client.db.updateUser(interaction.user.id, interaction.guild.id, {
      balance: userData.balance - amount,
      bank: userData.bank + amount
    });

    const embed = new EmbedBuilder()
      .setColor(primary)
      .setTitle('🏦 Dépôt')
      .setDescription(`**${amount}** ${client.config.economy.currencySymbol} déposé(e)(s) à la banque.`);
    interaction.reply({ embeds: [embed] });
  }
};