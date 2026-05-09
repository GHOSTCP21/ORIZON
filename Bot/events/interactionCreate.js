module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: '❌ Une erreur est survenue.', ephemeral: true });
      }
    }
    // Gestion des menus déroulants (rôle selector)
    else if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'role-selector') {
        const roleId = interaction.values[0];
        const role = interaction.guild.roles.cache.get(roleId);
        if (!role) return interaction.reply({ content: '❌ Rôle introuvable.', ephemeral: true });
        try {
          await interaction.member.roles.add(role);
          interaction.reply({ content: `✅ Rôle **${role.name}** ajouté.`, ephemeral: true });
        } catch {
          interaction.reply({ content: '❌ Impossible d\'ajouter ce rôle.', ephemeral: true });
        }
      }
    }
  }
};