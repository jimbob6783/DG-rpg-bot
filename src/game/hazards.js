// -------------------------------------------------------------
// hazards.js
// Determines whether hazards occur during a throw.
// Includes trees, OB, cliffs, water, boulders, wildlife, cars.
// -------------------------------------------------------------

import { wildlifeEncounter } from "./wildlife.js";
import gameConfig from "../config/gameConfig.js";

// Main hazard check
export function checkHazards(distanceRemaining, accuracy, env, courseName) {
  const events = [];

  // Higher accuracy → fewer hazards
  // Poor accuracy (<30) → HIGH hazard risk
  const hazardChance = Math.max(5, 40 - accuracy); // brutal mode scaling

  if (Math.random() * 100 >= hazardChance) {
    return events; // No hazards
  }

  // Roll determines hazard type
  const roll = Math.random();

  if (roll < 0.25) {
    events.push(treeHit());
  } else if (roll < 0.45) {
    events.push(waterDrop());
  } else if (roll < 0.60) {
    events.push(OB());
  } else if (roll < 0.75) {
    events.push(rockBounce());
  } else if (roll < 0.90) {
    events.push(cliffFall());
  } else {
    // Wildlife or vehicle mishap
    events.push(wildlifeEncounter());
  }

  // Scale severity based on course difficulty
  return scaleHazards(courseName, events);
}

// -------------------------------------------------------------
// Specific hazard event creators
// -------------------------------------------------------------

function treeHit() {
  const effect = randomRange(gameConfig.hazards.treeBounceMin, gameConfig.hazards.treeBounceMax);

  return {
    type: "tree",
    effect,
    message: `🌲 The disc SLAMS into a massive pine tree and bounces backward **${Math.abs(effect)} ft**!`
  };
}

function waterDrop() {
  return {
    type: "water",
    penalty: gameConfig.hazards.waterPenalty,
    message: "💦 A tragic splash! Your disc dives into the river and sinks to the depths."
  };
}

function OB() {
  return {
    type: "ob",
    penalty: gameConfig.hazards.obPenalty,
    message: "📏 Out of Bounds! The disc veers wildly and lands far beyond the fairway."
  };
}

function rockBounce() {
  const penalty = -Math.floor(Math.random() * 20);

  return {
    type: "rock",
    effect: penalty,
    message: `🪨 A boulder knocks your disc **${Math.abs(penalty)} ft backward**!`
  };
}

function cliffFall() {
  return {
    type: "cliff",
    effect: gameConfig.hazards.cliffPenalty,
    message: "⛰️ The disc edges too far left and FALLS off a cliff!"
  };
}

// -------------------------------------------------------------
// Hazard scaling based on course difficulty
// -------------------------------------------------------------

export function scaleHazards(courseName, hazards) {
  const multipliers = {
    "Elderwood Meadows": 1.0,
    "Ironpine Ridge": 1.2,
    "Sunforge Dunes": 1.1,
    "Stormbreach Cove": 1.4,
    "MetroPark Circuit": 1.3,
    "Frostpeak Valley": 1.25
  };

  const scale = multipliers[courseName] || 1;

  return hazards.map(h => ({
    ...h,
    effect: h.effect ? Math.floor(h.effect * scale) : h.effect,
    penalty: h.penalty ? Math.floor(h.penalty * scale) : h.penalty
  }));
}

// Utility random number
function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
