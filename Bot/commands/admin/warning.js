const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { primary } = require('../../utils/colors');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Voir les avertissements d’un membre')
    .addUserOption(option => option.setName('membre').setDescription('Membre cible').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction, client) {
    const target = interaction.options.getUser('membre');
    const userData = await client.db.getUser(target.id, interaction.guild.id);

    const count = userData?.warnings || 0;
    const embed = new EmbedBuilder()
      .setColor(primary)
      .setTitle(`📋 Avertissements de ${target.username}`)
      .setDescription(`Cet utilisateur a **${count}** avertissement(s).`);
    interaction.reply({ embeds: [embed] });
  }
};