// -------------------------------------------------------------
// /class select
// Allows user to choose a realistic disc golf archetype.
// -------------------------------------------------------------

import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import Character from "../db/models/Character.js";
import { CLASS_LIST } from "../advanced/characterClasses.js";

export default {
  data: new SlashCommandBuilder()
    .setName("class")
    .setDescription("Select or view your character class.")
    .addStringOption(opt =>
      opt
        .setName("choose")
        .setDescription("Choose your class")
        .addChoices(
          ...Object.keys(CLASS_LIST).map(c => ({
            name: CLASS_LIST[c].name,
            value: c
          }))
        )
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const choice = interaction.options.getString("choose");
    const character = await Character.findOne({ userId });

    if (!character) {
      return interaction.reply("❌ Create a character first with `/create`.");
    }

    // If no choice → show current class
    if (!choice) {
      return interaction.reply(`Your current class is: **${character.class}**`);
    }

    if (character.class !== "None") {
      return interaction.reply("❌ You have already selected a class!");
    }

    character.class = choice;
    await character.save();

    const cls = CLASS_LIST[choice];

    const embed = new EmbedBuilder()
      .setTitle(`Class Selected: ${cls.name}`)
      .setDescription(cls.description)
      .setColor("#00A8FF");

    return interaction.reply({ embeds: [embed] });
  }
};
