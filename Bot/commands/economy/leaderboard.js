const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { primary } = require('../../utils/colors');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Classement des plus riches du serveur'),
  async execute(interaction, client) {
    const top = await client.db.getTopUsers(interaction.guild.id, 10);
    if (top.length === 0) return interaction.reply({ content: '❌ Aucun joueur trouvé.', ephemeral: true });

    const description = top.map((u, i) => {
      const total = u.balance + u.bank;
      const member = interaction.guild.members.cache.get(u.userId);
      const name = member ? member.user.username : 'Utilisateur inconnu';
      return `**${i + 1}.** ${name} - ${total} ${client.config.economy.currencySymbol}`;
    }).join('\n');

    const embed = new EmbedBuilder()
      .setColor(primary)
      .setTitle('🏆 Classement ORIZON Bank')
      .setDescription(description);
    interaction.reply({ embeds: [embed] });
  }
};