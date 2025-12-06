// physics.js — AFTER PATCH 1 (v1.1.0)

import { applySkillsToThrow } from "../advanced/skillSystem.js";
import { applyClassModifiers } from "../advanced/characterClasses.js";

export function simulateThrow(character, disc, style, env, power, distanceRemaining) {

  // -----------------------------------------
  // BASE CALCULATIONS (ORIGINAL LOGIC)
  // -----------------------------------------

  // Base driving distance formula
  let baseDistance = (disc.speed * power) * 0.35;

  // Glide increases flight time (realistic)
  baseDistance += disc.glide * 3;

  // Natural throw deviation (left/right)
  let deviation = (Math.random() * 10) - 5;

  // Wind adjustment
  let effectiveWind = env.windSpeed;
  if (env.windDir === "headwind") baseDistance -= env.windSpeed * 1.5;
  if (env.windDir === "tailwind") baseDistance += env.windSpeed * 1.2;
  if (env.windDir === "left") deviation += env.windSpeed * 0.4;
  if (env.windDir === "right") deviation -= env.windSpeed * 0.4;

  // Throwing style modifier
  baseDistance *= style.powerMultiplier;
  deviation += style.accuracyPenalty;

  // Baseline hazard probability
  let hazardChance = 0.10;


  // -----------------------------------------
  // PATCH 1 — SKILLS + CLASS MODIFIERS
  // -----------------------------------------
  let physicsParams = {};

  // Apply skill system modifications
  physicsParams = applySkillsToThrow(character, physicsParams);

  // Apply class system modifications
  physicsParams = applyClassModifiers(character, physicsParams);

  // Distance scaling (+distanceBonus)
  if (physicsParams.distanceBonus)
    baseDistance *= physicsParams.distanceBonus;

  // Accuracy reduction (− deviation)
  if (physicsParams.accuracyBonus)
    deviation -= physicsParams.accuracyBonus;

  // Better angle control (reduces release error)
  if (physicsParams.angleVarianceReduction)
    deviation -= physicsParams.angleVarianceReduction;

  // Reduce wind effects
  if (physicsParams.windReduction)
    effectiveWind -= physicsParams.windReduction;

  // Hazard suppression (realistic awareness training)
  if (physicsParams.hazardReduction)
    hazardChance *= physicsParams.hazardReduction;


  // -----------------------------------------
  // FINAL THROW OUTPUT
  // -----------------------------------------

  return {
    distance: Math.floor(baseDistance),
    deviation,
    wind: effectiveWind,
    hazardChance,
    hazards: [] // filled by hazard engine later
  };
}
