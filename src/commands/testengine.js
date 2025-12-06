// -------------------------------------------------------------
// /testengine
// Developer tool for testing physics output.
// -------------------------------------------------------------

import { SlashCommandBuilder } from "discord.js";
import Character from "../db/models/Character.js";
import discs from "../data/discs.json" assert { type: "json" };
import styles from "../data/styles.json" assert { type: "json" };
import { simulateThrow } from "../game/physics.js";
import { generateEnvironment } from "../game/environment.js";

export default {
  data: new SlashCommandBuilder()
    .setName("testengine")
    .setDescription("Developer-only: Test physics engine.")
    .addStringOption(opt =>
      opt.setName("disc").setDescription("Disc name").setRequired(true)
    )
    .addIntegerOption(opt =>
      opt.setName("power").setDescription("Power (1-100)").setRequired(true)
    ),

  async execute(interaction) {
    if (interaction.user.id !== process.env.DEV_ID) {
      return interaction.reply({
        content: "❌ Developer-only command.",
        ephemeral: true
      });
    }

    const discName = interaction.options.getString("disc");
    const power = interaction.options.getInteger("power");
    const character = await Character.findOne({ userId: interaction.user.id });

    const disc = discs.find(d => d.name === discName);
    const style = styles[0]; // Flat throw for testing
    const env = generateEnvironment();

    const result = simulateThrow(character, disc, style, env, power, 500);

    return interaction.reply("```\n" + JSON.stringify(result, null, 2) + "\n```");
  }
};
