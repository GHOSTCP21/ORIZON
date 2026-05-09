module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;
    // Anti-lien (basique)
    if (message.content.includes('http://') || message.content.includes('https://')) {
      if (!message.member.permissions.has('ManageMessages')) {
        await message.delete();
        message.channel.send(`${message.author}, les liens ne sont pas autorisés.`).then(m => setTimeout(() => m.delete(), 5000));
      }
    }
    // Ici on pourrait ajouter un vrai anti-spam (cooldown, compteur, etc.)
  }
};