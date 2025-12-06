// -------------------------------------------------------------
// environment.js (v1.2.0)
// Generates environmental conditions for each hole.
// Conditions vary by course preset.
// -------------------------------------------------------------

export function generateEnvironment(course) {
  // Default ranges
  let windSpeed = Math.floor(Math.random() * 16); // 0–15 mph
  const windDirs = ["headwind", "tailwind", "left", "right"];
  const windDir = windDirs[Math.floor(Math.random() * windDirs.length)];

  // Optional weather
  const rainChance = 0.15;
  const isRaining = Math.random() < rainChance;

  return {
    windSpeed,
    windDir,
    isRaining,
    temperature: 65 + Math.floor(Math.random() * 20)
  };
}
