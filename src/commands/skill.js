// -------------------------------------------------------------
// /skill upgrade
// Spend skill points to increase driving, accuracy, etc.
// -------------------------------------------------------------

import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import Character from "../db/models/Character.js";
import { SKILL_LIST } from "../advanced/skillSystem.js";

export default {
  data: new SlashCommandBuilder()
    .setName("skill")
    .setDescription("Upgrade one of your disc golf skills.")
    .addStringOption(opt =>
      opt
        .setName("upgrade")
        .setDescription("Skill to upgrade")
        .setRequired(true)
        .addChoices(
          ...Object.keys(SKILL_LIST).map(s => ({
            name: SKILL_LIST[s].name,
            value: s
          }))
        )
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const skill = interaction.options.getString("upgrade");

    const character = await Character.findOne({ userId });
    if (!character) {
      return interaction.reply("❌ Create a character first with `/create`.");
    }

    if (character.skillPoints <= 0) {
      return interaction.reply("❌ You don't have any skill points.");
    }

    character.skills[skill]++;
    character.skillPoints--;

    await character.save();

    const embed = new EmbedBuilder()
      .setTitle("Skill Upgraded!")
      .setDescription(
        `**${SKILL_LIST[skill].name}** is now **${character.skills[skill]}**`
      )
      .setColor("#00FF47");

    return interaction.reply({ embeds: [embed] });
  }
};
