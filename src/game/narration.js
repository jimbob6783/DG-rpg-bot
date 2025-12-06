// -------------------------------------------------------------
// narration.js
// Generates thematic narrative text for throw results,
// hazards, environment, and special events.
// -------------------------------------------------------------

import botConfig from "../config/botConfig.js";

export function narrateThrow(result, env, disc, style) {
  const lines = [];

  // Opening line depends on narration style
  if (botConfig.narrationStyle === "cinematic") {
    lines.push(`🎯 **You grip your ${disc.name} and unleash a ${style.name} throw...**`);
  } else if (botConfig.narrationStyle === "minimal") {
    lines.push(`Throw executed.`);
  } else if (botConfig.narrationStyle === "chaotic") {
    lines.push(`🌀 You YEET the disc into the cosmos with questionable intentions...`);
  }

  // Environmental commentary
  if (env.windSpeed > 18) {
    lines.push(`💨 A fierce ${env.windSpeed} mph wind howls across the fairway!`);
  } else if (env.windSpeed < 5) {
    lines.push(`🌤 Calm winds create perfect throwing conditions.`);
  }

  if (env.rainIntensity > 0.6) {
    lines.push(`🌧 Heavy rain drenches the course, affecting grip.`);
  }

  // Distance + accuracy summary
  lines.push(
    `📏 The disc sails **${result.distance} ft** with an accuracy rating of **${result.accuracy}%**.`
  );

  // Hazard narrations
  for (const hazard of result.hazards) {
    lines.push(hazard.message);
  }

  return lines.join("\n");
}

export function narrateHoleCompletion(strokes, par) {
  if (strokes < par) return `🔥 **Birdie!** You outperform expectations!`;
  if (strokes === par) return `👍 Solid par — consistent play.`;
  if (strokes === par + 1) return `😅 Bogey. Could've been worse.`;
  if (strokes >= par + 2) return `💀 A double bogey disaster. The disc gods weep.`;

  return `Hole complete.`;
}

export function narrateCourseCompletion(courseName, totalStrokes) {
  return `🏁 **You finish the course: ${courseName}!**  
Total strokes: **${totalStrokes}**  
Your legend grows...`;
}
