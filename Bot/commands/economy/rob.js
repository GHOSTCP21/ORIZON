const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { accent } = require('../../utils/colors');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rob')
    .setDescription('Tenter de voler un utilisateur')
    .addUserOption(option => option.setName('cible').setDescription('Qui veux-tu voler ?').setRequired(true)),
  async execute(interaction, client) {
    const target = interaction.options.getUser('cible');
    if (target.id === interaction.user.id) return interaction.reply({ content: '❌ Tu ne peux pas te voler toi-même.', ephemeral: true });

    let thiefData = await client.db.getUser(interaction.user.id, interaction.guild.id);
    let victimData = await client.db.getUser(target.id, interaction.guild.id);
    if (!thiefData) await client.db.createUser(interaction.user.id, interaction.guild.id);
    if (!victimData) await client.db.createUser(target.id, interaction.guild.id);
    thiefData = await client.db.getUser(interaction.user.id, interaction.guild.id);
    victimData = await client.db.getUser(target.id, interaction.guild.id);

    if (victimData.balance <= 0) return interaction.reply({ content: `❌ ${target.username} n'a rien à voler.`, ephemeral: true });

    const success = Math.random() < client.config.economy.robSuccessRate;
    if (!success) {
      const penalty = Math.floor(Math.random() * 100) + 50;
      const newBalance = Math.max(0, thiefData.balance - penalty);
      await client.db.updateUser(interaction.user.id, interaction.guild.id, { balance: newBalance });
      return interaction.reply({ embeds: [
        new EmbedBuilder()
          .setColor(accent)
          .setTitle('🚨 Vol échoué')
          .setDescription(`Tu t'es fait prendre ! Tu perds **${penalty}** ${client.config.economy.currencySymbol}.`)
      ]});
    }

    const stolen = Math.floor(Math.random() * Math.min(victimData.balance, 200)) + 1;
    await client.db.updateUser(target.id, interaction.guild.id, { balance: victimData.balance - stolen });
    await client.db.updateUser(interaction.user.id, interaction.guild.id, { balance: thiefData.balance + stolen });

    const embed = new EmbedBuilder()
      .setColor(accent)
      .setTitle('💰 Vol réussi')
      .setDescription(`Tu as volé **${stolen}** ${client.config.economy.currencySymbol} à ${target.username}.`);
    interaction.reply({ embeds: [embed] });
  }
};