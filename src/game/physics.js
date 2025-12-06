// -------------------------------------------------------------
// physics.js (v1.2.0)
// Fully patched physics engine for the Disc Golf RPG Bot.
// Includes:
// - Skill System (Patch 1)
// - Class System (Patch 1)
// - Enhanced Flight Model
// - Wind Controls
// - Roller Detection
// - Hazard Logic
// - Output for Cinematic Engine (Patch 2)
// -------------------------------------------------------------

import { applySkillsToThrow } from "../advanced/skillSystem.js";
import { applyClassModifiers } from "../advanced/characterClasses.js";

export function simulateThrow(character, disc, style, env, power, distanceRemaining) {

  // -----------------------------------------
  // BASE THROW PHYSICS
  // -----------------------------------------

  const normalizedPower = Math.min(Math.max(power, 1), 100);

  let baseDistance = (disc.speed * normalizedPower) * 0.35;

  baseDistance += disc.glide * 3; // glide adds carry

  let deviation = (Math.random() * 10) - 5;

  let effectiveWind = env.windSpeed;

  switch (env.windDir) {
    case "headwind":
      baseDistance -= env.windSpeed * 1.5;
      deviation += env.windSpeed * 0.3;
      break;

    case "tailwind":
      baseDistance += env.windSpeed * 1.2;
      deviation -= env.windSpeed * 0.1;
      break;

    case "left":
      deviation += env.windSpeed * 0.4;
      break;

    case "right":
      deviation -= env.windSpeed * 0.4;
      break;

    default:
      break;
  }

  // -----------------------------------------
  // THROWING STYLE MODIFIERS
  // -----------------------------------------
  baseDistance *= style.powerMultiplier;
  deviation += style.accuracyPenalty;

  // -----------------------------------------
  // PATCH 1: APPLY SKILLS + CLASS MODIFIERS
  // -----------------------------------------
  let physicsParams = {};

  physicsParams = applySkillsToThrow(character, physicsParams);
  physicsParams = applyClassModifiers(character, physicsParams);

  if (physicsParams.distanceBonus)
    baseDistance *= physicsParams.distanceBonus;

  if (physicsParams.accuracyBonus)
    deviation -= physicsParams.accuracyBonus;

  if (physicsParams.angleVarianceReduction)
    deviation -= physicsParams.angleVarianceReduction;

  if (physicsParams.windReduction)
    effectiveWind -= physicsParams.windReduction;

  // -----------------------------------------
  // ROLLER LOGIC
  // -----------------------------------------
  let isRoller = false;
  const lowStability = disc.stability <= -2;

  if (lowStability && normalizedPower > 75 && style.id === "roller") {
    isRoller = true;
    baseDistance *= 1.3;
    deviation += (Math.random() * 20) - 10;
  }

  // -----------------------------------------
  // HAZARD SYSTEM
  // -----------------------------------------
  let hazardChance = 0.10;

  if (physicsParams.hazardReduction)
    hazardChance *= physicsParams.hazardReduction;

  let hazards = [];

  if (Math.random() < hazardChance) {
    const roll = Math.random();

    if (roll < 0.45) hazards.push({ type: "tree", penalty: 1 });
    else if (roll < 0.70) hazards.push({ type: "water", penalty: 1 });
    else hazards.push({ type: "ob", penalty: 1 });

    baseDistance *= 0.4;
  }

  // -----------------------------------------
  // FINAL OUTPUT
  // -----------------------------------------
  const finalDist = Math.max(1, Math.floor(baseDistance));

  return {
    distance: finalDist,
    deviation,
    wind: effectiveWind,
    hazards,
    isRoller,
    power: normalizedPower
  };
}
