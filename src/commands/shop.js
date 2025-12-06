// -------------------------------------------------------------
// /shop
// Shows all discs that can be bought.
// -------------------------------------------------------------

import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import discs from "../data/discs.json" assert { type: "json" };

export default {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Browse discs available for purchase."),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("🛒 Disc Shop")
      .setColor("#00A8FF");

    discs.forEach(disc => {
      embed.addFields({
        name: disc.name,
        value: `Speed ${disc.speed} | Glide ${disc.glide} | Price: **${disc.price} coins**`
      });
    });

    return interaction.reply({ embeds: [embed] });
  }
};
