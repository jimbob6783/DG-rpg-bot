// -------------------------------------------------------------
// /create
// Creates a new RPG character for the player.
// Enforces unique characters per user.
// -------------------------------------------------------------

import { SlashCommandBuilder } from "discord.js";
import Character from "../db/models/Character.js";
import Player from "../db/models/Player.js";
import Inventory from "../db/models/Inventory.js";

export default {
  data: new SlashCommandBuilder()
    .setName("create")
    .setDescription("Create your Disc Golf RPG character.")
    .addStringOption(opt =>
      opt.setName("name")
         .setDescription("Your character's name")
         .setRequired(true)
    ),

  async execute(interaction) {
    const name = interaction.options.getString("name");
    const userId = interaction.user.id;

    // Prevent duplicate characters
    const existing = await Character.findOne({ userId });
    if (existing) {
      return interaction.reply({
        content: "❌ You already have a character!",
        ephemeral: true
      });
    }

    // Create new character
    const character = await Character.create({
      userId,
      name
    });

    // Create Player meta document
    await Player.create({
      userId
    });

    // Give starter inventory
    await Inventory.create({
      userId
    });

    return interaction.reply(`
🎉 **Character Created!**
Name: **${name}**
Level: 1  
Stats: All set to 1  

Use **/assign** to customize your attributes!
`);
  }
};
