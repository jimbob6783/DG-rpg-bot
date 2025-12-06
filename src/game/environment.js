// -------------------------------------------------------------
// environment.js
// Creates randomized weather for each hole.
// Includes wind, rain, temperature, and seasonal changes.
// -------------------------------------------------------------

import { logger } from "../config/logging.js";

// Generate base environmental factors
export function generateEnvironment() {
  const windSpeed = Math.floor(Math.random() * 26); // 0–25 mph
  const windDirections = ["N","NE","E","SE","S","SW","W","NW"];
  const windDir = windDirections[Math.floor(Math.random() * windDirections.length)];

  const rainIntensity = Number(Math.random().toFixed(2)); // 0.00 – 1.00
  const tempF = Math.floor(50 + Math.random() * 45);      // 50°F – 95°F

  const groundSoftness =
    rainIntensity > 0.6 ? "muddy" :
    rainIntensity > 0.3 ? "soft"  :
    "firm";

  let env = {
    windSpeed,
    windDir,
    rainIntensity,
    tempF,
    groundSoftness
  };

  // Apply seasonal effects
  env = seasonalModifier(env);

  return env;
}

// Apply seasonal climate patterns
export function seasonalModifier(env) {
  const month = new Date().getMonth();

  // Winter (Dec–Feb) → stronger winds & icy ground
  if ([11,0,1].includes(month)) {
    env.windSpeed += 5;
    env.groundSoftness = "icy";
  }

  // Spring (Mar–May) → more rain
  if ([2,3,4].includes(month)) {
    env.rainIntensity = Math.min(1, env.rainIntensity + 0.2);
  }

  // Summer (Jun–Aug) → hotter temps & slight glide reduction
  if ([5,6,7].includes(month)) {
    env.tempF += 10;
  }

  // Autumn is balanced (no modifiers)

  return env;
}
