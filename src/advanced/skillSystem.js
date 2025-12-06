// -------------------------------------------------------------
// skillSystem.js (v1.1.0)
// Core logic for realistic disc golf skill-based progression.
// -------------------------------------------------------------

export const SKILL_LIST = {
  driving: {
    name: "Driving",
    description: "Increases max controllable distance and reduces power loss error per throw.",
    effect: (value) => ({
      distanceBonus: 1 + value * 0.02 // +2% distance per point
    })
  },

  accuracy: {
    name: "Accuracy",
    description: "Reduces lateral deviation and tree hit probability.",
    effect: (value) => ({
      accuracyBonus: value * 0.5 // reduces deviation by N%
    })
  },

  angleControl: {
    name: "Angle Control",
    description: "Improves release angle consistency, especially under wind.",
    effect: (value) => ({
      angleVarianceReduction: value * 0.4 // reduces angle error
    })
  },

  putting: {
    name: "Putting",
    description: "Improves accuracy and consistency for throws under 70 ft.",
    effect: (value) => ({
      puttingBonus: value * 1.5 // large benefit
    })
  },

  windManagement: {
    name: "Wind Management",
    description: "Reduces wind drift and boosts line-holding ability in windy conditions.",
    effect: (value) => ({
      windReduction: value * 0.3
    })
  },

  hazardAwareness: {
    name: "Hazard Awareness",
    description: "Reduces chance of hitting OB, water, or trees.",
    effect: (value) => ({
      hazardReduction: 1 - value * 0.03 // reduces hazard chance by % per point
    })
  }
};


// Apply all skill effects to physics calculations
export const applySkillsToThrow = (character, physicsParams) => {
  const skills = character.skills;

  for (const key of Object.keys(SKILL_LIST)) {
    const skillValue = skills[key];
    const effect = SKILL_LIST[key].effect(skillValue);

    for (const stat of Object.keys(effect)) {
      if (!physicsParams[stat]) physicsParams[stat] = 0;
      physicsParams[stat] += effect[stat];
    }
  }

  return physicsParams;
};
