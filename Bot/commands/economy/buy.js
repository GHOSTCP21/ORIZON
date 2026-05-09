const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { primary, accent } = require('../../utils/colors');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buy')
    .setDescription('Acheter un article de la boutique')
    .addStringOption(option => option.setName('article').setDescription('ID de l\'article').setRequired(true)),
  async execute(interaction, client) {
    const itemId = interaction.options.getString('article');
    const item = await client.db.getItem(itemId);
    if (!item) return interaction.reply({ content: '❌ Article introuvable.', ephemeral: true });

    let userData = await client.db.getUser(interaction.user.id, interaction.guild.id);
    if (!userData) {
      await client.db.createUser(interaction.user.id, interaction.guild.id);
      userData = await client.db.getUser(interaction.user.id, interaction.guild.id);
    }

    if (userData.balance < item.price) return interaction.reply({ content: '❌ Solde insuffisant.', ephemeral: true });

    await client.db.updateUser(interaction.user.id, interaction.guild.id, { balance: userData.balance - item.price });
    await client.db.addInventoryItem(interaction.user.id, interaction.guild.id, itemId);

    // Si l'article donne un rôle
    if (item.roleToGive) {
      const role = interaction.guild.roles.cache.get(item.roleToGive);
      if (role) {
        await interaction.member.roles.add(role).catch(console.error);
      }
    }

    const embed = new EmbedBuilder()
      .setColor(primary)
      .setTitle('✅ Achat réussi')
      .setDescription(`Tu as acheté **${item.name}** pour ${item.price} ${client.config.economy.currencySymbol}.`);
    interaction.reply({ embeds: [embed] });
  }
};