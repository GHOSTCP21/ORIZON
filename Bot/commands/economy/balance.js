const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { primary } = require('../../utils/colors');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Voir ton solde ou celui d’un autre membre')
    .addUserOption(option => option.setName('membre').setDescription('Membre cible')),
  async execute(interaction, client) {
    const target = interaction.options.getUser('membre') || interaction.user;
    let userData = await client.db.getUser(target.id, interaction.guild.id);
    if (!userData) {
      await client.db.createUser(target.id, interaction.guild.id);
      userData = await client.db.getUser(target.id, interaction.guild.id);
    }
    const embed = new EmbedBuilder()
      .setColor(primary)
      .setTitle(`🏦 Solde de ${target.username}`)
      .addFields(
        { name: 'Portefeuille', value: `${userData.balance} ${client.config.economy.currencySymbol}`, inline: true },
        { name: 'Banque', value: `${userData.bank} ${client.config.economy.currencySymbol}`, inline: true }
      );
    interaction.reply({ embeds: [embed] });
  }
};