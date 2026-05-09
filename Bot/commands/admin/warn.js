const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { accent } = require('../../utils/colors');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Avertir un membre')
    .addUserOption(option => option.setName('membre').setDescription('Membre à avertir').setRequired(true))
    .addStringOption(option => option.setName('raison').setDescription('Raison').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction, client) {
    const target = interaction.options.getUser('membre');
    const reason = interaction.options.getString('raison');

    let userData = await client.db.getUser(target.id, interaction.guild.id);
    if (!userData) {
      await client.db.createUser(target.id, interaction.guild.id);
      userData = await client.db.getUser(target.id, interaction.guild.id);
    }

    const newWarnings = (userData.warnings || 0) + 1;
    await client.db.updateUser(target.id, interaction.guild.id, { warnings: newWarnings });

    const embed = new EmbedBuilder()
      .setColor(accent)
      .setTitle('⚠️ Avertissement')
      .setDescription(`${target.tag} a reçu un avertissement.`)
      .addFields({ name: 'Raison', value: reason }, { name: 'Total warns', value: `${newWarnings}` })
      .setTimestamp();
    interaction.reply({ embeds: [embed] });

    const logChannel = interaction.guild.channels.cache.get(client.config.channels.logs);
    if (logChannel) logChannel.send({ embeds: [embed] });
  }
};