// -------------------------------------------------------------
// gameConfig.js
// Core RPG and physics balancing values.
// Changing these adjusts your game's difficulty and feel.
// -------------------------------------------------------------

export default {
  // ---------------------------------------------------------
  // XP SYSTEM
  // ---------------------------------------------------------
  baseXP: 50,                // XP earned for completing a hole at par
  xpPerStrokeUnderPar: 20,   // Bonus XP per stroke under par
  xpPerStrokeOverPar: -5,    // Penalty XP per stroke over par

  // Level curve → how much XP required per level
  levelCurve(level) {
    // Example: Level 1 → 150 XP, Level 10 → 600 XP
    return 100 + (level * 50);
  },

  // ---------------------------------------------------------
  // THROW PHYSICS
  // These multipliers influence how far discs fly.
  // ---------------------------------------------------------
  throw: {
    strengthMultiplier: 8,  // STR scaling
    speedMultiplier: 6,     // SPD scaling
    glideMultiplier: 4,     // Disc glide scaling

    // Controls randomness in flight:
    // Higher means more chaos when TEC or FOC is low
    chaosFactor: 20
  },

  // ---------------------------------------------------------
  // HAZARD CONFIGURATION
  // Used in physics and hazard calculations.
  // ---------------------------------------------------------
  hazards: {
    obPenalty: 2,            // +2 strokes
    waterPenalty: 1,         // +1 stroke
    treeBounceMin: -40,      // Bounce backward (min)
    treeBounceMax: -10,      // Bounce backward (max)
    cliffPenalty: -50,       // Massive drop-off
    wildlifePenalty: 2,      // Stroke penalty for wildlife mishaps
    vehiclePenalty: 2        // Stroke penalty for hitting cars
  }
};
