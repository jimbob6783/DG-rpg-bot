// -------------------------------------------------------------
// /buy
// Purchase a disc from the shop.
// -------------------------------------------------------------

import { SlashCommandBuilder } from "discord.js";
import Inventory from "../db/models/Inventory.js";
import discs from "../data/discs.json" assert { type: "json" };

export default {
  data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription("Buy a disc from the shop.")
    .addStringOption(opt =>
      opt.setName("disc")
         .setDescription("Disc to purchase")
         .setRequired(true)
    ),

  async execute(interaction) {
    const discName = interaction.options.getString("disc");
    const userId = interaction.user.id;

    const disc = discs.find(d => d.name === discName);
    if (!disc) {
      return interaction.reply({
        content: "❌ That disc is not sold here.",
        ephemeral: true
      });
    }

    const inventory = await Inventory.findOne({ userId });

    if (inventory.coins < disc.price) {
      return interaction.reply({
        content: `❌ Not enough coins! You need **${disc.price}**, but have **${inventory.coins}**.`,
        ephemeral: true
      });
    }

    // Purchase
    inventory.coins -= disc.price;
    inventory.discs.push(disc.name);
    await inventory.save();

    return interaction.reply(`🎉 You bought **${disc.name}** for **${disc.price}** coins!`);
  }
};
