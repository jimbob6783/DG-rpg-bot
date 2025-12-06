// -------------------------------------------------------------
// deploy-commands.js
// Registers slash commands with Discord using REST API.
// Run this anytime you add or change commands:
//   npm run deploy
// -------------------------------------------------------------

import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const commands = [];

// Load command definitions
const commandsPath = path.join(process.cwd(), "src", "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = (await import(path.join(commandsPath, file))).default;
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("🔄 Refreshing Discord slash commands...");

    // If GUILD_ID is set → register in dev server
    if (process.env.GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
      );
      console.log("⚡ Slash commands updated *in development guild*.");
    } else {
      // Register globally
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
      );
      console.log("🌎 Slash commands updated *globally*.");
    }
  } catch (error) {
    console.error(error);
  }
})();
