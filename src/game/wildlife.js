// -------------------------------------------------------------
// wildlife.js
// Generates chaotic wildlife and vehicle encounters.
// Includes geese, deer, squirrels, bears, and cars.
// -------------------------------------------------------------

import gameConfig from "../config/botConfig.js"; // uses wildlifeMode

export function wildlifeEncounter() {
  const roll = Math.random();

  // 20% → goose attack
  if (roll < 0.20) {
    return {
      type: "wildlife",
      penalty: 1,
      message: "🦢 A furious goose intercepts the disc mid-air and honks in victory."
    };
  }

  // 20% → squirrel steals disc
  if (roll < 0.40) {
    return {
      type: "wildlife",
      effect: -20,
      message: "🐿️ A squirrel grabs your disc and drags it **20 ft backward** before dropping it."
    };
  }

  // 20% → deer kick
  if (roll < 0.60) {
    return {
      type: "wildlife",
      penalty: 2,
      message: "🦌 A deer sprints across the fairway and KICKS your disc like a soccer ball!"
    };
  }

  // 15% → car hit
  if (roll < 0.75) {
    return {
      type: "vehicle",
      penalty: 2,
      message: "🚗 A passing car HONKS as your disc clatters off its roof!"
    };
  }

  // 15% → bear inspection
  if (roll < 0.90) {
    return {
      type: "wildlife",
      effect: -30,
      message: "🐻 A bear picks up your disc, sniffs it, and SLAPS it deeper into the woods."
    };
  }

  // 10% → pure chaos
  return {
    type: "chaos",
    penalty: 3,
    message: "🌀 A mysterious cosmic force swallows your disc temporarily. +3 strokes."
  };
}
