// -------------------------------------------------------------
// /play
// Starts a round on a selected course.
// Initializes GameState with hole 1.
// -------------------------------------------------------------

import { SlashCommandBuilder } from "discord.js";
import Character from "../db/models/Character.js";
import GameState from "../db/models/GameState.js";
import courses from "../data/courses.json" assert { type: "json" };
import { generateEnvironment } from "../game/environment.js";

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Start playing a disc golf course.")
    .addStringOption(opt =>
      opt.setName("course")
         .setDescription("Choose a course")
         .setRequired(true)
         .addChoices(
           ...Object.keys(courses).map(c => ({ name: c, value: c }))
         )
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const courseName = interaction.options.getString("course");

    const character = await Character.findOne({ userId });
    if (!character) {
      return interaction.reply({
        content: "❌ You need to create a character first (**/create**).",
        ephemeral: true
      });
    }

    const course = courses[courseName];
    const firstHole = course.holes[0];

    // Initialize environment
    const env = generateEnvironment();
    env.courseName = courseName;

    // Reset GameState
    await GameState.findOneAndUpdate(
      { userId },
      {
        courseName,
        holeIndex: 0,
        strokes: 0,
        distanceRemaining: firstHole.distance,
        environments: env,
        hazardsTriggered: []
      },
      { upsert: true }
    );

    return interaction.reply(`
🏁 **Starting Course: ${courseName}!**
Hole 1 — **${firstHole.distance} ft**, Par ${firstHole.par}

Weather:  
💨 Wind: ${env.windSpeed} mph ${env.windDir}  
🌧 Rain Intensity: ${env.rainIntensity}  
🌡 Temp: ${env.tempF}°F  
🌱 Ground: ${env.groundSoftness}

Use **/throw** to take your first shot!
`);
  }
};
