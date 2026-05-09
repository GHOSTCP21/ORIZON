const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { primary } = require('../../utils/colors');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pay')
    .setDescription('Envoyer des ORZ Coins à un membre')
    .addUserOption(option => option.setName('membre').setDescription('Destinataire').setRequired(true))
    .addIntegerOption(option => option.setName('montant').setDescription('Montant').setRequired(true).setMinValue(1)),
  async execute(interaction, client) {
    const target = interaction.options.getUser('membre');
    const amount = interaction.options.getInteger('montant');
    if (target.id === interaction.user.id) return interaction.reply({ content: '❌ Tu ne peux pas te payer toi-même.', ephemeral: true });

    let payerData = await client.db.getUser(interaction.user.id, interaction.guild.id);
    let receiverData = await client.db.getUser(target.id, interaction.guild.id);
    if (!payerData) await client.db.createUser(interaction.user.id, interaction.guild.id);
    if (!receiverData) await client.db.createUser(target.id, interaction.guild.id);
    payerData = await client.db.getUser(interaction.user.id, interaction.guild.id);
    receiverData = await client.db.getUser(target.id, interaction.guild.id);

    if (payerData.balance < amount) return interaction.reply({ content: '❌ Solde insuffisant.', ephemeral: true });

    await client.db.updateUser(interaction.user.id, interaction.guild.id, { balance: payerData.balance - amount });
    await client.db.updateUser(target.id, interaction.guild.id, { balance: receiverData.balance + amount });

    const embed = new EmbedBuilder()
      .setColor(primary)
      .setTitle('💸 Paiement')
      .setDescription(`**${amount}** ${client.config.economy.currencySymbol} envoyé(e)(s) à ${target.username}.`);
    interaction.reply({ embeds: [embed] });
  }
};