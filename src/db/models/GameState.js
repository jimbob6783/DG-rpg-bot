// -------------------------------------------------------------
// GameState.js
// Represents the player's ACTIVE game session.
// Stores hole progress, strokes, weather, hazards, etc.
// -------------------------------------------------------------

import mongoose from "mongoose";

const GameStateSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },

  // Course & hole progression
  courseName: { type: String },
  holeIndex: { type: Number },
  strokes: { type: Number, default: 0 },
  distanceRemaining: { type: Number },

  // Environmental conditions for THIS hole
  environments: {
    windSpeed: Number,
    windDir: String,
    rainIntensity: Number,
    tempF: Number,
    groundSoftness: String
  },

  // Hazards encountered on the current hole
  hazardsTriggered: {
    type: [String],
    default: []
  },

  // Last interaction timestamp
  lastAction: { type: Date, default: Date.now }
});

export default mongoose.model("GameState", GameStateSchema);
