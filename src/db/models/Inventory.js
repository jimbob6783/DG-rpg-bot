// -------------------------------------------------------------
// Inventory.js
// Stores all owned discs, coins, and future consumable items.
// Each user has one inventory document.
// -------------------------------------------------------------

import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  // Link to Discord user
  userId: { type: String, required: true, unique: true },

  // Money earned from achievements, quests, wins
  coins: { type: Number, default: 50 },

  // Collection of discs the user owns
  discs: {
    type: [String],
    default: ["WindSpire Putter", "OakRunner Midrange"]
  },

  // For future features (XP potions, hazard shields, boosters, etc.)
  consumables: {
    type: [String],
    default: []
  }
});

export default mongoose.model("Inventory", InventorySchema);
