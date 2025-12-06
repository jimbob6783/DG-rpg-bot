// -------------------------------------------------------------
// cinematicThrows.js (v1.2.0)
// Smart Mode Cinematic Rendering Engine for Disc Golf RPG Bot.
// Automatically selects the best visual style based on:
// - Disc stability
// - Release angle (hyzer/flat/anhyzer)
// - Wind direction & speed
// - Power
// - Skills (angle control, driving)
// - Class modifiers
// - Flight curvature
// - Throw outcome (hazard or success)
// -------------------------------------------------------------

// Utility: Clamp a number to a range
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Determine release category based on angle/deviation
export function analyzeThrowShape(deviation, disc, wind, power) {
  // Strong left deviation → hyzer
  if (deviation < -6) return "hyzer";

  // Strong right deviation → anhyzer
  if (deviation > 6) return "anhyzer";

  // Mid deviation + high power + low stability → flex line
  if (Math.abs(deviation) > 3 && disc.stability <= 0 && power >= 70)
    return "flex";

  // Low deviation → flat shot
  return "flat";
}


// -------------------------------------------------------------
// CINEMATIC RENDERERS
// -------------------------------------------------------------

export const CinematicRenderers = {
  
  // 1. FLAT LINE (Laser Shot)
  flat(distance) {
    return `
O${"=".repeat(clamp(Math.floor(distance / 12), 5, 30))}🥏  ${distance} ft (Flat Drive)
`;
  },

  // 2. HYZER ARC
  hyzer(distance) {
    return `
          🥏
        ↗
     ↗
  ↗
O——————————————>  ${distance} ft (Hyzer Line)
`;
  },

  // 3. ANHYZER ARC
  anhyzer(distance) {
    return `
     ↘         🥏
        ↘    ↗
           ↘↗
O—————————————>  ${distance} ft (Anhyzer/Flex)
`;
  },

  // 4. FLEX SHOT (S-curve)
  flex(distance) {
    return `
        ↘         🥏
          ↘     ↗
            ↘ ↗
O——————————————>  ${distance} ft (Flex S-Curve)
`;
  },

  // 5. ROLLER SHOT
  roller(distance) {
    const segments = clamp(Math.floor(distance / 20), 5, 25);
    return `
O—${"🟤—".repeat(segments)}>  ${distance} ft (Roller)
`;
  },

  // 6. WIND DRIFT (emoji-enhanced)
  drift(distance, windDir, windSpeed) {
    const arrows = windDir === "left" ? "⬅️" : "➡️";
    return `
O ${arrows.repeat(clamp(Math.floor(windSpeed / 3), 1, 6))} 🥏 💨   ${distance} ft (Wind Drift)
`;
  },

  // 7. PUTT (<70 ft)
  putt(distance) {
    return `
O → 🥏 → 🗳️   ${distance} ft (Putt)
`;
  },

  // 8. HAZARD FAILURES
  hazard(type) {
    switch (type) {
      case "tree":
        return `
O—————🥏
        🌲 **THUNK!** (Tree Hit)
`;
      case "water":
        return `
O—————🥏
         💦 SPLASH! (Water Hazard)
`;
      case "ob":
        return `
O—————🥏
        ⛔ Out of Bounds!
`;
      default:
        return `
O—————🥏
        ⚠️ Hazard Encountered
`;
    }
  }
};


// -------------------------------------------------------------
// SMART RENDERER (AUTO SELECTION)
// -------------------------------------------------------------

export function renderCinematicThrow(result, disc, env) {
  const { distance, deviation, hazards } = result;

  // If hazard happened → show cinematic failure
  if (hazards.length > 0) {
    return CinematicRenderers.hazard(hazards[0].type);
  }

  // Putt mode (<70 ft)
  if (distance < 70) {
    return CinematicRenderers.putt(distance);
  }

  // Rollers have distinct shape
  if (result.isRoller) {
    return CinematicRenderers.roller(distance);
  }

  // Determine shot shape
  const shape = analyzeThrowShape(deviation, disc, env.windSpeed, result.power);

  // Hyzer / Anhyzer / Flex / Flat
  switch (shape) {
    case "hyzer": return CinematicRenderers.hyzer(distance);
    case "anhyzer": return CinematicRenderers.anhyzer(distance);
    case "flex": return CinematicRenderers.flex(distance);
    default: return CinematicRenderers.flat(distance);
  }
}
