// -------------------------------------------------------------
// connect.js
// Handles connection to MongoDB using Mongoose.
// This file is imported once in bot.js during startup.
// -------------------------------------------------------------

import mongoose from "mongoose";
import { logger } from "../config/logging.js";

export default async function connectDB(uri) {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    logger.info("🗄 Connected to MongoDB");
  } catch (error) {
    logger.error("❌ MongoDB connection failed:");
    logger.error(error);
    process.exit(1); // Stop bot if DB cannot connect
  }
}
