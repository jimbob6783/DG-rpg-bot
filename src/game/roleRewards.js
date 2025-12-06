// -------------------------------------------------------------
// roleRewards.js
// Optional module for granting Discord roles based on
// progression milestones (level, prestige, achievements).
// Requires managing role IDs in your server.
// -------------------------------------------------------------

export const ROLE_THRESHOLDS = {
  LEVEL_10: "ROLE_ID_FOR_LEVEL_10",
  LEVEL_25: "ROLE_ID_FOR_LEVEL_25",
  LEVEL_50: "ROLE_ID_FOR_LEVEL_50",
  PRESTIGE_1: "ROLE_ID_FOR_PRESTIGE_1",
  PRESTIGE_5: "ROLE_ID_FOR_PRESTIGE_5"
};

export async function assignRoles(member, character) {
  const rolesToAssign = [];

  if (character.level >= 10) rolesToAssign.push(ROLE_THRESHOLDS.LEVEL_10);
  if (character.level >= 25) rolesToAssign.push(ROLE_THRESHOLDS.LEVEL_25);
  if (character.level >= 50) rolesToAssign.push(ROLE_THRESHOLDS.LEVEL_50);

  if (character.prestige >= 1) rolesToAssign.push(ROLE_THRESHOLDS.PRESTIGE_1);
  if (character.prestige >= 5) rolesToAssign.push(ROLE_THRESHOLDS.PRESTIGE_5);

  for (const roleId of rolesToAssign) {
    if (roleId) {
      await member.roles.add(roleId).catch(() => {});
    }
  }
}
