import { FastifyInstance } from "fastify";
import { BucketService } from "../storage/bucket.service";
import { BucketSchema } from "../models/bucket";

export async function bucketRoutes(fastify: FastifyInstance) {
  const bucketService = new BucketService();

  // Create bucket
  fastify.put<{ Params: { bucketName: string } }>(
    "/:bucketName",
    async (request, reply) => {
      const { bucketName } = request.params;

      try {
        const validated = BucketSchema.pick({ name: true }).parse({
          name: bucketName,
        });
        const bucket = await bucketService.createBucket(validated.name);
        return reply.code(200).send(bucket);
      } catch (err) {
        return reply.code(400).send({
          error: err instanceof Error ? err.message : "Invalid request",
        });
      }
    }
  );

  // List buckets
  fastify.get("/", async (request, reply) => {
    try {
      const buckets = await bucketService.listBuckets();
      return reply.code(200).send({ Buckets: buckets });
    } catch (err) {
      return reply.code(500).send({
        error: err instanceof Error ? err.message : "Internal server error",
      });
    }
  });

  // Delete bucket
  fastify.delete<{ Params: { bucketName: string } }>(
    "/:bucketName",
    async (request, reply) => {
      const { bucketName } = request.params;

      try {
        await bucketService.deleteBucket(bucketName);
        return reply.code(204).send();
      } catch (err) {
        return reply.code(404).send({
          error: err instanceof Error ? err.message : "Bucket not found",
        });
      }
    }
  );

  // Get bucket info
  fastify.get<{ Params: { bucketName: string } }>(
    "/:bucketName",
    async (request, reply) => {
      const { bucketName } = request.params;

      try {
        const bucket = await bucketService.getBucketInfo(bucketName);
        return reply.code(200).send(bucket);
      } catch (err) {
        return reply
          .code(404)
          .send({
            error: err instanceof Error ? err.message : "Bucket not found",
          });
      }
    }
  );
}
