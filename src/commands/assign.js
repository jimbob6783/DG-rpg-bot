// -------------------------------------------------------------
// /assign
// Allows players to assign stat points to their character.
// Only allowed at creation or after level ups.
// -------------------------------------------------------------

import { SlashCommandBuilder } from "discord.js";
import Character from "../db/models/Character.js";

export default {
  data: new SlashCommandBuilder()
    .setName("assign")
    .setDescription("Assign stat points to your character.")
    .addIntegerOption(o =>
      o.setName("str").setDescription("Strength").setRequired(true)
    )
    .addIntegerOption(o =>
      o.setName("spd").setDescription("Speed").setRequired(true)
    )
    .addIntegerOption(o =>
      o.setName("tec").setDescription("Technique").setRequired(true)
    )
    .addIntegerOption(o =>
      o.setName("sta").setDescription("Stamina").setRequired(true)
    )
    .addIntegerOption(o =>
      o.setName("foc").setDescription("Focus").setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const character = await Character.findOne({ userId });

    if (!character) {
      return interaction.reply({
        content: "❌ You don't have a character yet! Use **/create**.",
        ephemeral: true
      });
    }

    // Only allow one-time assignment at start (can adjust if you want level-up points)
    if (character.stats.STR > 1) {
      return interaction.reply({
        content: "❌ You have already assigned your starting stats!",
        ephemeral: true
      });
    }

    const STR = interaction.options.getInteger("str");
    const SPD = interaction.options.getInteger("spd");
    const TEC = interaction.options.getInteger("tec");
    const STA = interaction.options.getInteger("sta");
    const FOC = interaction.options.getInteger("foc");

    const total = STR + SPD + TEC + STA + FOC;

    if (total !== 10) {
      return interaction.reply({
        content: "❌ Your starting stat total must equal **10 points**.",
        ephemeral: true
      });
    }

    character.stats = { STR, SPD, TEC, STA, FOC };
    await character.save();

    return interaction.reply(`
📊 **Stats Assigned!**

**STR:** ${STR}  
**SPD:** ${SPD}  
**TEC:** ${TEC}  
**STA:** ${STA}  
**FOC:** ${FOC}

You're ready to play — use **/play**!
`);
  }
};
