// -------------------------------------------------------------
// /throw
// Executes a throw using:
// - Physics engine
// - Weather modifiers
// - Hazards
// - Narration system
// - XP & leveling
// - Achievements
// - Daily quest updates
// - Course progression
// -------------------------------------------------------------

import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import Character from "../db/models/Character.js";
import Player from "../db/models/Player.js";
import Inventory from "../db/models/Inventory.js";
import GameState from "../db/models/GameState.js";

import courses from "../data/courses.json" assert { type: "json" };
import discs from "../data/discs.json" assert { type: "json" };
import styles from "../data/styles.json" assert { type: "json" };

import { simulateThrow } from "../game/physics.js";
import { narrateThrow, narrateHoleCompletion } from "../game/narration.js";
import { calculateXP, applyXP } from "../game/scoring.js";
import { evaluateAchievements } from "../game/achievements.js";
import { updateQuestProgress } from "../game/dailyQuests.js";
import { logger } from "../config/logging.js";

export default {
  data: new SlashCommandBuilder()
    .setName("throw")
    .setDescription("Throw your disc toward the basket.")
    .addStringOption(opt =>
      opt.setName("style")
         .setDescription("Choose your throwing style")
         .setRequired(true)
         .addChoices(...styles.map(s => ({ name: s.name, value: s.id })))
    )
    .addIntegerOption(opt =>
      opt.setName("power")
         .setDescription("Throw power (1–100)")
         .setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const power = interaction.options.getInteger("power");
    const styleId = interaction.options.getString("style");

    if (power < 1 || power > 100) {
      return interaction.reply({
        content: "❌ Power must be between **1 and 100**.",
        ephemeral: true
      });
    }

    // ---------------------------------------------------------
    // LOAD PLAYER STATE
    // ---------------------------------------------------------
    const character = await Character.findOne({ userId });
    const player = await Player.findOne({ userId });
    const inventory = await Inventory.findOne({ userId });
    const state = await GameState.findOne({ userId });

    if (!character || !state) {
      return interaction.reply({
        content: "❌ You must start a course first using **/play**.",
        ephemeral: true
      });
    }

    const course = courses[state.courseName];
    const hole = course.holes[state.holeIndex];

    const discName = character.equippedDisc;
    const disc = discs.find(d => d.name === discName);

    const style = styles.find(s => s.id === styleId);

    // ---------------------------------------------------------
    // PERFORM THROW
    // ---------------------------------------------------------
    const result = simulateThrow(
      character,
      disc,
      style,
      state.environments,
      power,
      state.distanceRemaining
    );

    // Remaining distance
    let newDistance = state.distanceRemaining - result.distance;
    const hazards = result.hazards;

    // Penalties for OB, wildlife, etc.
    let addedStrokes = hazards.filter(h => h.penalty).reduce((a, b) => a + b.penalty, 0);

    // Check if hole is completed
    let holeCompleted = false;

    if (newDistance <= 0) {
      holeCompleted = true;
      newDistance = 0;
    }

    // ---------------------------------------------------------
    // UPDATE SCORE & STATE
    // ---------------------------------------------------------
    state.distanceRemaining = newDistance;
    state.strokes += 1 + addedStrokes; // stroke + hazard penalties

    // Track hazards on this hole
    if (hazards.length > 0) {
      hazards.forEach(h => state.hazardsTriggered.push(h.type));
    }

    await state.save();

    // ---------------------------------------------------------
    // NARRATION EMBED
    // ---------------------------------------------------------
    const narration = narrateThrow(result, state.environments, disc, style);

    const embed = new EmbedBuilder()
      .setTitle(`Throw Result — Hole ${state.holeIndex + 1}`)
      .setDescription(narration)
      .setColor("#00A8FF")
      .addFields(
        { name: "Distance Remaining", value: `${newDistance} ft`, inline: true },
        { name: "Total Strokes", value: `${state.strokes}`, inline: true }
      );

    await interaction.reply({ embeds: [embed] });

    // ---------------------------------------------------------
    // IF HOLE NOT COMPLETED → END HERE
    // ---------------------------------------------------------
    if (!holeCompleted) return;

    // ---------------------------------------------------------
    // HOLE COMPLETION
    // ---------------------------------------------------------
    const par = hole.par;
    const strokes = state.strokes;
    const rating = narrateHoleCompletion(strokes, par);

    // XP earned
    const xp = calculateXP(strokes, par);
    const leveledUp = applyXP(character, xp);

    await character.save();

    // Achievements
    const newAchievements = evaluateAchievements(player, character, result);
    player.achievements.push(...newAchievements);
    await player.save();

    // Daily quest progress
    const questProgress = updateQuestProgress(player, result);
    player.dailyQuestProgress += questProgress;
    await player.save();

    // Send hole completion summary
    const holeEmbed = new EmbedBuilder()
      .setTitle(`🏁 Hole ${state.holeIndex + 1} Completed!`)
      .setDescription(`
${rating}

**Strokes:** ${strokes}  
**Par:** ${par}  
**XP Earned:** ${xp}  
${leveledUp ? "🎉 **LEVEL UP!**" : ""}
${newAchievements.length ? `🏅 New Achievements: ${newAchievements.join(", ")}` : ""}
`)
      .setColor("#FFD700");

    await interaction.followUp({ embeds: [holeEmbed] });

    // ---------------------------------------------------------
    // MOVE TO NEXT HOLE
    // ---------------------------------------------------------
    state.holeIndex++;

    // End of course?
    if (state.holeIndex >= course.holes.length) {
      await state.delete();

      return interaction.followUp(`
🎉 **Course Complete!**
Total Strokes: **${strokes}**
Use **/play** to start another round!
`);
    }

    // Reset for next hole
    const nextHole = course.holes[state.holeIndex];

    state.strokes = 0;
    state.distanceRemaining = nextHole.distance;
    state.hazardsTriggered = [];
    state.environments = {
      ...state.environments,
      // Update weather for new hole
      ...(Math.random() > 0.5 ? {} : { windSpeed: Math.floor(Math.random() * 26) })
    };

    await state.save();

    return interaction.followUp(`
➡ **Next Hole:** Hole ${state.holeIndex + 1}  
Distance: **${nextHole.distance} ft**, Par ${nextHole.par}
Use **/throw** to continue the round!
`);
  }
};
