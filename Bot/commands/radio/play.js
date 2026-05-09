const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { cyan } = require('../../utils/colors');

const stations = {
  haitienne: { name: 'Radio Haïtienne', url: 'URL_STREAM_HAITIENNE' },
  lofi: { name: 'Lo-Fi Radio', url: 'URL_STREAM_LOFI' },
  live: { name: 'ORIZON Live', url: 'URL_STREAM_LIVE' }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('radio')
    .setDescription('Jouer une station radio')
    .addStringOption(option =>
      option.setName('station')
        .setDescription('Choisir la station')
        .setRequired(true)
        .addChoices(
          { name: 'Haïtienne', value: 'haitienne' },
          { name: 'Lo-Fi', value: 'lofi' },
          { name: 'Live', value: 'live' }
        )),
  async execute(interaction) {
    const station = interaction.options.getString('station');
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) return interaction.reply({ content: '❌ Vous devez être dans un salon vocal.', ephemeral: true });

    const connection = await voiceChannel.join();
    const stream = stations[station]?.url;
    if (!stream) return interaction.reply({ content: '❌ Station introuvable.' });
    connection.play(stream);

    const embed = new EmbedBuilder()
      .setColor(cyan)
      .setTitle('📻 Radio ORIZON')
      .setDescription(`Lecture de **${stations[station].name}** dans ${voiceChannel.name}`);
    interaction.reply({ embeds: [embed] });
  }
};