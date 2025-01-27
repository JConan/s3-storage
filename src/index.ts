import Fastify from "fastify";
import multipart from "@fastify/multipart";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();
import { bucketRoutes } from "./api/bucket.routes";
import { fileRoutes } from "./api/file.routes";
import { promises as fs } from "fs";
import path from "path";
import logger from "./config/logger";

// Create Fastify server instance
const fastify = Fastify({
  logger: false, // Disable Fastify's built-in logger
  bodyLimit: 1024 * 1024 * 200, // 200MB
});

// Ensure log directory exists
const logDir = process.env.LOG_DIR || "logs";

// Add request logging middleware
fastify.addHook("onRequest", async (request) => {
  logger.info({
    method: request.method,
    url: request.url,
    ip: request.ip,
  });
});

// Register multipart plugin with 200MB limit
fastify.register(multipart, {
  limits: {
    fileSize: 1024 * 1024 * 200, // 200MB
  },
});

// Register routes
fastify.register(bucketRoutes, { prefix: "/buckets" });
fastify.register(fileRoutes, { prefix: "/buckets" });

// Health check endpoint
fastify.get("/health", async () => {
  return { status: "ok" };
});

// Start server
const start = async () => {
  try {
    // Ensure log directory exists
    await fs.mkdir(logDir, { recursive: true });

    // Log environment configuration
    logger.info({
      message: "Server configuration",
      STORAGE_DIR: process.env.STORAGE_DIR || "default",
      LOG_DIR: process.env.LOG_DIR || "default",
      NODE_ENV: process.env.NODE_ENV || "development",
      PORT: 3000,
    });

    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    console.log(`Server listening on http://localhost:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
