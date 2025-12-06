// -------------------------------------------------------------
// achievements.js
// Checks for and unlocks achievements.
// Achievements are stored in Player.achievements.
// -------------------------------------------------------------

export const ACHIEVEMENTS = {
  FIRST_THROW: "First Throw",
  TREE_PUNCHER: "Tree Puncher",
  WATERLOGGED: "Frequent Swimmer",
  ANIMAL_MAGNET: "Wildlife Whisperer",
  PERFECT_HOLE: "Perfect Hole",
  LONG_DRIVE_400: "Crushed 400+ ft Drive",
  LEVEL_10: "Level 10",
  LEVEL_25: "Level 25",
  LEVEL_50: "Level 50"
};

// Evaluates if new achievements should unlock
export function evaluateAchievements(player, character, result) {
  const unlocked = [];

  // First throw milestone
  if (!player.achievements.includes(ACHIEVEMENTS.FIRST_THROW)) {
    unlocked.push(ACHIEVEMENTS.FIRST_THROW);
  }

  // Tree hit
  if (result.hazards.some(h => h.type === "tree")) {
    unlocked.push(ACHIEVEMENTS.TREE_PUNCHER);
  }

  // Water mishaps
  if (result.hazards.some(h => h.type === "water")) {
    unlocked.push(ACHIEVEMENTS.WATERLOGGED);
  }

  // Wildlife
  if (result.hazards.some(h => h.type === "wildlife" || h.type === "vehicle")) {
    unlocked.push(ACHIEVEMENTS.ANIMAL_MAGNET);
  }

  // Perfect hole bonus
  if (result.accuracy > 95) {
    unlocked.push(ACHIEVEMENTS.PERFECT_HOLE);
  }

  // Long drive
  if (result.distance >= 400) {
    unlocked.push(ACHIEVEMENTS.LONG_DRIVE_400);
  }

  // Level achievements
  if (character.level >= 10) unlocked.push(ACHIEVEMENTS.LEVEL_10);
  if (character.level >= 25) unlocked.push(ACHIEVEMENTS.LEVEL_25);
  if (character.level >= 50) unlocked.push(ACHIEVEMENTS.LEVEL_50);

  // Return only achievements not yet earned
  return unlocked.filter(a => !player.achievements.includes(a));
}
