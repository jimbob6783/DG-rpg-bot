// -------------------------------------------------------------
// Character.js
// Represents the player's RPG character.
// Tracks XP, level, stats, equipped disc, and prestige progress.
// -------------------------------------------------------------

import mongoose from "mongoose";

const CharacterSchema = new mongoose.Schema({
  // Link to Discord user
  userId: { type: String, required: true, unique: true },

  // Character name
  name: { type: String, required: true },

  // Level progression
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },

  // RPG stats
  stats: {
    STR: { type: Number, default: 1 }, // Strength → power
    SPD: { type: Number, default: 1 }, // Speed → disc velocity
    TEC: { type: Number, default: 1 }, // Technique → accuracy
    STA: { type: Number, default: 1 }, // Stamina → future long matches
    FOC: { type: Number, default: 1 }  // Focus → reduces randomness
  },

  // Currently equipped disc
  equippedDisc: {
    type: String,
    default: "WindSpire Putter"
  },

  // Throwing styles unlocked over gameplay
  unlockedStyles: {
    type: [String],
    default: ["Flat", "Hyzer"]
  },

  // Prestige system (advanced progression)
  prestige: { type: Number, default: 0 },
  prestigePoints: { type: Number, default: 0 },

  // Timestamp
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Character", CharacterSchema);
