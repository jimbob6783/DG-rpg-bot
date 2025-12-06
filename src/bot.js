// -------------------------------------------------------------
// bot.js
// Main entry point for Disc Golf RPG Bot.
// Loads config, connects to MongoDB, loads commands, and starts
// the Discord client.
// -------------------------------------------------------------

import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import connectDB from "./db/connect.js";
import { logger } from "./config/logging.js";

dotenv.config();

// -------------------------------------------------------------
// DISCORD CLIENT
// -------------------------------------------------------------
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ],
  partials: [Partials.Channel]
});

// Store slash commands
client.commands = new Collection();

// -------------------------------------------------------------
// LOAD COMMAND FILES
// -------------------------------------------------------------
const commandsPath = path.join(process.cwd(), "src", "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = (await import(filePath)).default;

  if (!command.data || !command.execute) {
    logger.warn(`⚠ Command ${file} is missing data or execute()`);
    continue;
  }

  client.commands.set(command.data.name, command);
  logger.info(`Loaded command: ${command.data.name}`);
}

// -------------------------------------------------------------
// COMMAND HANDLER
// -------------------------------------------------------------
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    logger.error(error);
    interaction.reply({ content: "❌ An error occurred executing this command.", ephemeral: true });
  }
});

// -------------------------------------------------------------
// STARTUP
// -------------------------------------------------------------
async function startBot() {
  logger.info("Starting Disc Golf RPG Bot...");

  // Connect to MongoDB
  await connectDB(process.env.MONGO_URI);

  // Login to Discord
  client.login(process.env.DISCORD_TOKEN)
    .then(() => logger.info("🤖 Bot is online!"))
    .catch(err => logger.error("Login failed:", err));
}

startBot();
