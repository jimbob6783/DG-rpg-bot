// -------------------------------------------------------------
// /profile
// Shows character stats, level, XP, achievements, etc.
// -------------------------------------------------------------

import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import Character from "../db/models/Character.js";
import Player from "../db/models/Player.js";

export default {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("View your Disc Golf RPG character profile."),

  async execute(interaction) {
    const userId = interaction.user.id;

    const character = await Character.findOne({ userId });
    const player = await Player.findOne({ userId });

    if (!character) {
      return interaction.reply({
        content: "❌ You haven't created a character yet!",
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle(`${character.name}'s Profile`)
      .setColor("#00A8FF")
      .addFields(
        { name: "Level", value: `${character.level}`, inline: true },
        { name: "XP", value: `${character.xp}`, inline: true },
        { name: "Prestige", value: `${character.prestige}`, inline: true },
        {
          name: "Stats",
          value: `
**STR:** ${character.stats.STR}
**SPD:** ${character.stats.SPD}
**TEC:** ${character.stats.TEC}
**STA:** ${character.stats.STA}
**FOC:** ${character.stats.FOC}
          `
        },
        {
          name: "Achievements",
          value: player.achievements?.length
            ? player.achievements.join(", ")
            : "None yet."
        }
      )
      .setFooter({ text: "Disc Golf RPG Bot" });

    return interaction.reply({ embeds: [embed] });
  }
};
