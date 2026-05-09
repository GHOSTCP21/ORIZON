const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { primary, accent } = require('../../utils/colors');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannir un membre')
    .addUserOption(option => option.setName('utilisateur').setDescription('Membre à bannir').setRequired(true))
    .addStringOption(option => option.setName('raison').setDescription('Raison du bannissement'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const target = interaction.options.getUser('utilisateur');
    const reason = interaction.options.getString('raison') || 'Aucune raison fournie';
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);
    if (!member) return interaction.reply({ content: '❌ Utilisateur introuvable.', ephemeral: true });
    if (!member.bannable) return interaction.reply({ content: '❌ Je ne peux pas bannir cet utilisateur.', ephemeral: true });

    await member.ban({ reason });
    const embed = new EmbedBuilder()
      .setColor(accent)
      .setTitle('🚫 Bannissement')
      .setDescription(`${target.tag} a été banni.`)
      .addFields({ name: 'Raison', value: reason })
      .setTimestamp();
    interaction.reply({ embeds: [embed] });

    // Log
    const logChannel = interaction.guild.channels.cache.get(interaction.client.config.channels.logs);
    if (logChannel) logChannel.send({ embeds: [embed] });
  }
};