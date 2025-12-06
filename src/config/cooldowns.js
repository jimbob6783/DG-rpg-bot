// -------------------------------------------------------------
// cooldowns.js
// Defines cooldown durations (in seconds) for each command.
// The cooldown handler uses these values to enforce pacing.
// -------------------------------------------------------------

export default {
  create: 30,        // Character creation
  assign: 5,         // Stat assignment
  play: 10,          // Starting a course
  throw: 3,          // Prevent throw spam
  scorecard: 2,      // Viewing scorecard
  equip: 3,          // Changing disc
  inventory: 2,      // Checking bag
  shop: 2,           // Browsing shop
  buy: 5,            // Purchasing items
  export: 5,         // Exporting scorecard
  tournament: 30,    // Tournament start cooldown
  testengine: 0      // Dev-only, no cooldown
};
