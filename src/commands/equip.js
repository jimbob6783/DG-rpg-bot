// -------------------------------------------------------------
// /equip
// Lets the player equip one of their owned discs.
// -------------------------------------------------------------

import { SlashCommandBuilder } from "discord.js";
import Inventory from "../db/models/Inventory.js";
import Character from "../db/models/Character.js";

export default {
  data: new SlashCommandBuilder()
    .setName("equip")
    .setDescription("Equip a disc from your inventory.")
    .addStringOption(opt =>
      opt.setName("disc")
         .setDescription("Disc to equip")
         .setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const discName = interaction.options.getString("disc");

    const inventory = await Inventory.findOne({ userId });
    const character = await Character.findOne({ userId });

    if (!inventory || !character) {
      return interaction.reply({
        content: "❌ You must have a character and inventory first!",
        ephemeral: true
      });
    }

    if (!inventory.discs.includes(discName)) {
      return interaction.reply({
        content: "❌ You do not own that disc.",
        ephemeral: true
      });
    }

    character.equippedDisc = discName;
    await character.save();

    return interaction.reply(`🥏 Equipped **${discName}**!`);
  }
};
