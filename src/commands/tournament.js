import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("tournament")
    .setDescription("(Coming soon) Multiplayer tournaments!"),

  async execute(interaction) {
    return interaction.reply(`
🏆 **Tournaments Coming Soon!**  
Multiplayer competitions with score tracking, brackets, and prizes!
`);
  }
};
