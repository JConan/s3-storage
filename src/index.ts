import Fastify from "fastify";
import multipart from "@fastify/multipart";
import { bucketRoutes } from "./api/bucket.routes";
import { fileRoutes } from "./api/file.routes";

// Create Fastify server instance
const fastify = Fastify({
  logger: true,
  bodyLimit: 1024 * 1024 * 200, // 200MB
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
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    console.log(`Server listening on http://localhost:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
