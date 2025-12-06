// -------------------------------------------------------------
// /export
// Exports the player's scorecard in plain-text format.
// -------------------------------------------------------------

import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import GameState from "../db/models/GameState.js";

export default {
  data: new SlashCommandBuilder()
    .setName("export")
    .setDescription("Export your current scorecard as a .txt file."),

  async execute(interaction) {
    const userId = interaction.user.id;
    const state = await GameState.findOne({ userId });

    if (!state) {
      return interaction.reply({
        content: "❌ You're not currently playing a course.",
        ephemeral: true
      });
    }

    const content = `
Disc Golf RPG Scorecard
-----------------------
Course: ${state.courseName}
Hole: ${state.holeIndex + 1}
Strokes: ${state.strokes}
Distance Remaining: ${state.distanceRemaining} ft
Hazards: ${state.hazardsTriggered.join(", ") || "None"}
Weather:
  Wind: ${state.environments.windSpeed} mph
  Rain: ${state.environments.rainIntensity}
  Temp: ${state.environments.tempF}°F
`;

    const file = new AttachmentBuilder(Buffer.from(content), {
      name: "scorecard.txt"
    });

    return interaction.reply({
      content: "📄 Exported your scorecard!",
      files: [file]
    });
  }
};
