// -------------------------------------------------------------
// throw.js (v1.2.0)
// Executes a throw during a game session.
// Integrates:
//  - Physics Engine (skills + classes)
//  - Cinematic Throw Engine
//  - Narration System
//  - Hazards + scoring updates
// -------------------------------------------------------------

import {
  SlashCommandBuilder,
  EmbedBuilder
} from "discord.js";

import Character from "../db/models/Character.js";
import GameState from "../db/models/GameState.js";
import { simulateThrow } from "../game/physics.js";
import { resolveHazards } from "../game/hazards.js";
import { generateEnvironment } from "../game/environment.js";
import { generateNarration } from "../game/narration.js";
import { renderCinematicThrow } from "../advanced/cinematicThrows.js";


// -------------------------------------------------------------
// THROW COMMAND DEFINITION
// -------------------------------------------------------------
export default {
  data: new SlashCommandBuilder()
    .setName("throw")
    .setDescription("Throw your disc in the current hole.")
    .addIntegerOption(option =>
      option
        .setName("power")
        .setDescription("Throw power (1–100)")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("style")
        .setDescription("Throwing style")
        .setRequired(false)
        .addChoices(
          { name: "Flat", value: "flat" },
          { name: "Hyzer", value: "hyzer" },
          { name: "Anhyzer", value: "anhyzer" },
          { name: "Roller", value: "roller" },
          { name: "Power Drive", value: "power" }
        )
    ),

  // -------------------------------------------------------------
  // EXECUTE THROW
  // -------------------------------------------------------------
  async execute(interaction) {

    // ----------------------------------------------------------------
    // FETCH PLAYER + GAME STATE
    // ----------------------------------------------------------------
    const userId = interaction.user.id;
    const character = await Character.findOne({ userId });
    const gameState = await GameState.findOne({ userId });

    if (!character)
      return interaction.reply("❌ You must create a character first using `/create`.");

    if (!gameState)
      return interaction.reply("❌ You are not in a game. Use `/play` to start a round.");

    // ----------------------------------------------------------------
    // THROW PARAMETERS
    // ----------------------------------------------------------------
    const power = interaction.options.getInteger("power");
    if (power < 1 || power > 100)
      return interaction.reply("❌ Power must be between **1–100**.");

    const styleId = interaction.options.getString("style") || "flat";

    const stylePresets = {
      flat: { id: "flat", powerMultiplier: 1.0, accuracyPenalty: 0 },
      hyzer: { id: "hyzer", powerMultiplier: 0.95, accuracyPenalty: -1 },
      anhyzer: { id: "anhyzer", powerMultiplier: 0.95, accuracyPenalty: 1 },
      roller: { id: "roller", powerMultiplier: 1.15, accuracyPenalty: 2 },
      power: { id: "power", powerMultiplier: 1.2, accuracyPenalty: 3 }
    };

    const style = stylePresets[styleId];

    // DISC SELECTION (for now use gameState.selectedDisc)
    const disc = gameState.selectedDisc;
    if (!disc)
      return interaction.reply("❌ You must equip a disc first using `/equip`.");

    // ENVIRONMENT for this hole
    const env = gameState.environment || generateEnvironment();
    gameState.environment = env;


    // ----------------------------------------------------------------
    // RUN THE PHYSICS ENGINE
    // ----------------------------------------------------------------
    const result = simulateThrow(
      character,
      disc,
      style,
      env,
      power,
      gameState.distanceRemaining
    );

    // Update position
    gameState.distanceRemaining -= result.distance;
    if (gameState.distanceRemaining < 0) gameState.distanceRemaining = 0;

    // Increase stroke count
    gameState.strokeCount += 1;


    // ----------------------------------------------------------------
    // HAZARD RESOLUTION
    // ----------------------------------------------------------------
    resolveHazards(result.hazards, gameState);


    // ----------------------------------------------------------------
    // CINEMATIC FLIGHT (Patch 2)
    // ----------------------------------------------------------------
    const cinematicArt = renderCinematicThrow(result, disc, env);


    // ----------------------------------------------------------------
    // NARRATION SYSTEM
    // ----------------------------------------------------------------
    const narrationText = generateNarration(
      result,
      env,
      disc,
      style
    );


    // ----------------------------------------------------------------
    // HOLE COMPLETION CHECK
    // ----------------------------------------------------------------
    let holeCompletionText = "";

    if (gameState.distanceRemaining <= 0) {
      const strokes = gameState.strokeCount;
      const par = gameState.par;

      if (strokes === par - 2) holeCompletionText = "🦅 **Eagle! Incredible!**";
      else if (strokes === par - 1) holeCompletionText = "🐦 **Birdie!**";
      else if (strokes === par) holeCompletionText = "⛳ **Par. Solid!**";
      else if (strokes === par + 1) holeCompletionText = "☝️ **Bogey. Keep at it!**";
      else holeCompletionText = "😬 **Double Bogey+**";

      // Prepare for next hole
      gameState.holeCompleted = true;
    }


    // ----------------------------------------------------------------
    // SAVE GAMESTATE UPDATE
    // ----------------------------------------------------------------
    await gameState.save();


    // ----------------------------------------------------------------
    // BUILD EMBED
    // ----------------------------------------------------------------
    const embed = new EmbedBuilder()
      .setTitle(`🎯 Throw Result — Hole ${gameState.holeNumber}`)
      .setColor("#00A8FF")
      .setDescription(cinematicArt)
      .addFields(
        {
          name: "🛫 Distance Thrown",
          value: `${result.distance} ft`,
          inline: true
        },
        {
          name: "↔️ Deviation",
          value: `${result.deviation.toFixed(2)}`,
          inline: true
        },
        {
          name: "🌬️ Wind",
          value: `${env.windSpeed} mph ${env.windDir}`,
          inline: true
        },
        {
          name: "📏 Distance Remaining",
          value: `${gameState.distanceRemaining} ft`,
          inline: false
        }
      );

    if (result.hazards.length > 0) {
      embed.addFields({
        name: "⚠️ Hazard",
        value: result.hazards[0].type.toUpperCase(),
        inline: false
      });
    }

    if (narrationText)
      embed.addFields({ name: "📣 Commentary", value: narrationText });

    if (holeCompletionText)
      embed.addFields({ name: "🏁 Hole Result", value: holeCompletionText });


    // ----------------------------------------------------------------
    // REPLY
    // ----------------------------------------------------------------
    return interaction.reply({ embeds: [embed] });
  }
};
