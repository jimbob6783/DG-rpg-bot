// -------------------------------------------------------------
// Player.js
// Stores global player data that is NOT tied to their character
// stats (ex: achievements, quest progress, settings).
// -------------------------------------------------------------

import mongoose from "mongoose";

const PlayerSchema = new mongoose.Schema({
  // Discord user ID
  userId: { type: String, required: true, unique: true },

  // When player first joined the RPG
  joinedAt: { type: Date, default: Date.now },

  // Personalization options
  settings: {
    narrationStyle: { type: String, default: "cinematic" },
    darkHumor: { type: Boolean, default: true },
    showDetailedStats: { type: Boolean, default: true }
  },

  // Player performance stats (meta, not per character)
  stats: {
    totalThrows: { type: Number, default: 0 },
    holesCompleted: { type: Number, default: 0 },
    coursesCompleted: { type: Number, default: 0 },
    bestDrive: { type: Number, default: 0 }
  },

  // Achievements the user has unlocked
  achievements: {
    type: [String],
    default: []
  },

  // Daily quest system
  dailyQuest: {
    type: Object,
    default: null
  },
  dailyQuestProgress: {
    type: Number,
    default: 0
  }
});

export default mongoose.model("Player", PlayerSchema);
