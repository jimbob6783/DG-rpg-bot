// -------------------------------------------------------------
// /inventory
// Shows all discs and consumables the player owns.
// -------------------------------------------------------------

import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import Inventory from "../db/models/Inventory.js";

export default {
  data: new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("View your bag and items."),

  async execute(interaction) {
    const userId = interaction.user.id;
    const inventory = await Inventory.findOne({ userId });

    if (!inventory) {
      return interaction.reply({
        content: "❌ No inventory found. Did you create a character?",
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle("🎒 Your Inventory")
      .setColor("#00A8FF")
      .addFields(
        {
          name: "Discs",
          value: inventory.discs.length
            ? inventory.discs.map(d => `• ${d}`).join("\n")
            : "You have no discs!"
        },
        {
          name: "Coins",
          value: `${inventory.coins} 🪙`,
          inline: true
        }
      );

    return interaction.reply({ embeds: [embed] });
  }
};
