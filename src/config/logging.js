// -------------------------------------------------------------
// logging.js
// Winston logging configuration for detailed bot diagnostics.
// Logs to console + file (logs/bot.log and logs/errors.log).
// -------------------------------------------------------------

import winston from "winston";

export const logger = winston.createLogger({
  // Logging detail level (info, warn, error, debug)
  level: process.env.LOG_LEVEL || "info",

  // Format each log entry with timestamp + message
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) =>
      `[${timestamp}] [${level.toUpperCase()}] ${message}`
    )
  ),

  transports: [
    // Error log file
    new winston.transports.File({
      filename: "logs/errors.log",
      level: "error"
    }),

    // General activity log
    new winston.transports.File({
      filename: "logs/bot.log"
    }),

    // Console output for live debugging
    new winston.transports.Console()
  ]
});
