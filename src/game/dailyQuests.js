// -------------------------------------------------------------
// dailyQuests.js
// Daily challenges to incentivize returning players.
// Stored in Player.dailyQuest + dailyQuestProgress.
// -------------------------------------------------------------

const QUEST_TYPES = [
  "Throw 10 times",
  "Hit 3 trees",
  "Achieve a 300+ ft throw",
  "Play 1 full course",
  "Earn 200 XP"
];

export function generateDailyQuest() {
  const quest = QUEST_TYPES[Math.floor(Math.random() * QUEST_TYPES.length)];

  return {
    quest,
    reward: 50 + Math.floor(Math.random() * 50) // 50–100 coins
  };
}

export function updateQuestProgress(player, result) {
  let progressIncrement = 0;

  switch (player.dailyQuest?.quest) {
    case "Throw 10 times":
      progressIncrement = 1;
      break;

    case "Hit 3 trees":
      if (result.hazards.some(h => h.type === "tree")) {
        progressIncrement = 1;
      }
      break;

    case "Achieve a 300+ ft throw":
      if (result.distance >= 300) {
        progressIncrement = 1;
      }
      break;

    case "Play 1 full course":
      // Only track completion in the course completion handler
      break;

    case "Earn 200 XP":
      // XP added separately
      break;
  }

  return progressIncrement;
}
