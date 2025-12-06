// -------------------------------------------------------------
// prestige.js
// Allows players to reset to level 1 in exchange for prestige
// points, which permanently boost character stats.
// -------------------------------------------------------------

export function canPrestige(character) {
  return character.level >= 50; // requirement
}

export function applyPrestige(character) {
  if (!canPrestige(character)) return false;

  character.prestige++;
  character.prestigePoints += 5;

  character.level = 1;
  character.xp = 0;

  return true;
}
