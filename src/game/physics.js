// -------------------------------------------------------------
// physics.js
// Main disc flight simulation engine.
// Uses character stats, disc stats, weather, hazards, and chaos.
// -------------------------------------------------------------

import gameConfig from "../config/gameConfig.js";
import { checkHazards } from "./hazards.js";

export function simulateThrow(character, disc, style, env, power, distanceRemaining) {
  // ---------------------------------------------------------
  // BASE DISTANCE CALCULATION
  // ---------------------------------------------------------
  let distance =
    character.stats.STR * gameConfig.throw.strengthMultiplier +
    character.stats.SPD * gameConfig.throw.speedMultiplier +
    disc.speed * (power / 100) * 14 + // disc power scaling
    disc.glide * gameConfig.throw.glideMultiplier;

  // Apply throwing style multiplier
  if (style.powerMultiplier)
    distance *= style.powerMultiplier;

  // ---------------------------------------------------------
  // ENVIRONMENT MODIFIERS
  // ---------------------------------------------------------
  if (env.windSpeed > 15) distance -= 15; // strong headwind
  if (env.windSpeed < 5)  distance += 5; // calm conditions help

  if (env.rainIntensity > 0.6)
    distance *= 0.9; // wet conditions reduce flight

  // ---------------------------------------------------------
  // ACCURACY CALCULATION
  // ---------------------------------------------------------
  let accuracy = character.stats.TEC * 10;

  // Style-based accuracy tradeoffs
  if (style.accuracyPenalty)
    accuracy -= style.accuracyPenalty;

  // Chaos factor influenced by Focus
  accuracy += (Math.random() * gameConfig.throw.chaosFactor - (gameConfig.throw.chaosFactor / 2))
             * (1 - character.stats.FOC / 10);

  // Clamp accuracy to valid range
  accuracy = Math.max(-30, Math.min(100, accuracy));

  // ---------------------------------------------------------
  // HAZARDS
  // ---------------------------------------------------------
  const hazards = checkHazards(distanceRemaining, accuracy, env, env.courseName);

  // Apply hazard effects to distance
  for (const h of hazards) {
    if (h.effect) distance += h.effect;
  }

  // Minimum distance floor
  distance = Math.max(5, distance);

  return {
    distance: Math.floor(distance),
    accuracy: Math.floor(accuracy),
    hazards
  };
}
