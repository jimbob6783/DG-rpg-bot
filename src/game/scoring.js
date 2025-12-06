// -------------------------------------------------------------
// scoring.js
// XP calculation, leveling, par scoring, and gameplay rewards.
// -------------------------------------------------------------

import gameConfig from "../config/gameConfig.js";

export function calculateXP(strokes, par) {
  let xp = gameConfig.baseXP;

  if (strokes < par) {
    const bonus = (par - strokes) * gameConfig.xpPerStrokeUnderPar;
    xp += bonus;
  } else if (strokes > par) {
    const penalty = (strokes - par) * gameConfig.xpPerStrokeOverPar;
    xp += penalty;
  }

  return Math.max(5, xp); // prevent 0 XP
}

export function applyXP(character, xp) {
  character.xp += xp;

  const needed = gameConfig.levelCurve(character.level);

  const leveledUp = character.xp >= needed;

  if (leveledUp) {
    character.level++;
    character.xp -= needed;
  }

  return leveledUp;
}

export function strokesToParRating(strokes, par) {
  if (strokes < par - 2) return "🔥 Eagle!";
  if (strokes < par) return "Birdie!";
  if (strokes === par) return "Par";
  if (strokes === par + 1) return "Bogey";
  if (strokes >= par + 2) return "💀 Disaster";

  return "Completed";
}
