// -------------------------------------------------------------
// /scorecard
// Shows the player's current hole, strokes, weather, and progress.
// -------------------------------------------------------------

import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import GameState from "../db/models/GameState.js";
import courses from "../data/courses.json" assert { type: "json" };

export default {
  data: new SlashCommandBuilder()
    .setName("scorecard")
    .setDescription("View your current hole progress."),

  async execute(interaction) {
    const userId = interaction.user.id;
    const state = await GameState.findOne({ userId });

    if (!state) {
      return interaction.reply({
        content: "❌ You're not currently playing a course. Use **/play**.",
        ephemeral: true
      });
    }

    const course = courses[state.courseName];
    const hole = course.holes[state.holeIndex];

    const embed = new EmbedBuilder()
      .setTitle(`Scorecard — ${state.courseName}`)
      .setColor("#00A8FF")
      .addFields(
        { name: "Hole", value: `${state.holeIndex + 1}`, inline: true },
        { name: "Distance Remaining", value: `${state.distanceRemaining} ft`, inline: true },
        { name: "Strokes", value: `${state.strokes}`, inline: true },
        {
          name: "Weather",
          value: `
💨 ${state.environments.windSpeed} mph ${state.environments.windDir}  
🌧 Rain: ${state.environments.rainIntensity}  
🌡 Temp: ${state.environments.tempF}°F  
🌱 Ground: ${state.environments.groundSoftness}
`
        },
        {
          name: "Hazards Hit",
          value: state.hazardsTriggered.length
            ? state.hazardsTriggered.join(", ")
            : "None yet!"
        }
      )
      .setFooter({ text: "Disc Golf RPG Bot" });

    return interaction.reply({ embeds: [embed] });
  }
};
