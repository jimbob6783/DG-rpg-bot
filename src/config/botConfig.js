// -------------------------------------------------------------
// botConfig.js
// Global configuration for Disc Golf RPG Bot.
// Includes visual theme, narration preferences, and defaults.
// -------------------------------------------------------------

export default {
  // Name displayed in embeds, logs, etc.
  botName: "Disc Golf RPG Bot",

  // Narration mode:
  //   cinematic → dramatic storytelling
  //   minimal   → shorter, gameplay-only messages
  //   chaotic   → more unpredictable, humorous narration
  narrationStyle: "cinematic",

  // Hazard difficulty:
  //   mild  → rare hazards
  //   normal → balanced gameplay
  //   brutal → frequent & punishing hazards
  hazardMode: "brutal",

  // Wildlife encounter tone:
  //   cute    → gentle, friendly events
  //   realistic → normal wildlife interactions
  //   dark    → chaotic, comedic violence (you chose this)
  wildlifeMode: "dark",

  // Default course when none specified
  defaultCourse: "Elderwood Meadows",

  // Embed accent color
  themeColor: "#00A8FF",

  // Developer user ID (enables /testengine)
  developerId: "YOUR_DISCORD_USER_ID"
};
