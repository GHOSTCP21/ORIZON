const { EmbedBuilder } = require('discord.js');
const { primary } = require('../utils/colors');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    // Auto-role membre
    const memberRole = member.guild.roles.cache.get(client.config.roles.member);
    if (memberRole) member.roles.add(memberRole).catch(console.error);

    // Création du compte dans la base
    await client.db.createUser(member.user.id, member.guild.id);

    // Message de bienvenue
    const channel = member.guild.systemChannel;
    if (channel) {
      const embed = new EmbedBuilder()
        .setColor(primary)
        .setTitle('🌍 Bienvenue sur ORIZON !')
        .setDescription(`${member.user}, bienvenue dans la communauté haïtienne mondiale !\nPense à lire les règles et à te vérifier.`)
        .setThumbnail(member.user.displayAvatarURL());
      channel.send({ embeds: [embed] });
    }
  }
};