// -------------------------------------------------------------
// characterClasses.js (v1.1.0)
// Defines realistic archetypes with passive modifiers.
// -------------------------------------------------------------

export const CLASS_LIST = {
  PowerThrower: {
    name: "Power Thrower",
    description: "Specializes in max distance drives.",
    modifiers: {
      distanceBonus: 0.10,
      windSensitivity: 0.06,
      accuracyPenalty: -0.05
    }
  },

  PrecisionGolfer: {
    name: "Precision Golfer",
    description: "Focuses on accuracy and line control.",
    modifiers: {
      distanceBonus: -0.05,
      accuracyBonus: 0.10,
      angleControlBonus: 0.10
    }
  },

  WindTechnician: {
    name: "Wind Technician",
    description: "Expert at controlling discs in harsh wind.",
    modifiers: {
      windReduction: 0.20,
      glidePenalty: -0.05
    }
  },

  ControlSpecialist: {
    name: "Control Specialist",
    description: "Extremely consistent and predictable flight patterns.",
    modifiers: {
      deviationReduction: 0.15,
      distanceBonus: -0.03
    }
  }
};


// Merge class bonuses into physics parameters
export const applyClassModifiers = (character, physicsParams) => {
  const selectedClass = CLASS_LIST[character.class];

  if (!selectedClass) return physicsParams;

  const mods = selectedClass.modifiers;

  for (const key of Object.keys(mods)) {
    if (!physicsParams[key]) physicsParams[key] = 0;
    physicsParams[key] += mods[key];
  }

  return physicsParams;
};
