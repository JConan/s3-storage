import { FastifyInstance } from "fastify";
import { FileService } from "../storage/file.service";
import { FileSchema } from "../models/file";

export async function fileRoutes(fastify: FastifyInstance) {
  const fileService = new FileService();

  // Upload file
  fastify.put<{ Params: { bucketName: string; fileName: string } }>(
    "/:bucketName/files/:fileName",
    async (request, reply) => {
      const { bucketName, fileName } = request.params;

      try {
        const data = await request.file();
        if (!data) {
          throw new Error("No file uploaded");
        }

        const fileData = await data.toBuffer();
        const file = await fileService.uploadFile(
          bucketName,
          fileName,
          fileData
        );

        return reply.code(200).send(file);
      } catch (err) {
        console.log({ err, bucketName, fileName });
        return reply.code(400).send({
          error: err instanceof Error ? err.message : "Invalid request",
        });
      }
    }
  );

  // Download file
  fastify.get<{ Params: { bucketName: string; fileName: string } }>(
    "/:bucketName/files/:fileName",
    async (request, reply) => {
      const { bucketName, fileName } = request.params;

      try {
        const { data, contentType } = await fileService.downloadFile(
          bucketName,
          fileName
        );
        return reply.code(200).header("Content-Type", contentType).send(data);
      } catch (err) {
        return reply.code(404).send({
          error: err instanceof Error ? err.message : "File not found",
        });
      }
    }
  );

  // Delete file
  fastify.delete<{ Params: { bucketName: string; fileName: string } }>(
    "/:bucketName/files/:fileName",
    async (request, reply) => {
      const { bucketName, fileName } = request.params;

      try {
        await fileService.deleteFile(bucketName, fileName);
        return reply.code(204).send();
      } catch (err) {
        return reply.code(404).send({
          error: err instanceof Error ? err.message : "File not found",
        });
      }
    }
  );

  // Get file info
  fastify.get<{ Params: { bucketName: string; fileName: string } }>(
    "/:bucketName/files/:fileName/info",
    async (request, reply) => {
      const { bucketName, fileName } = request.params;

      try {
        const fileInfo = await fileService.getFileInfo(bucketName, fileName);
        return reply.code(200).send(fileInfo);
      } catch (err) {
        return reply.code(404).send({
          error: err instanceof Error ? err.message : "File not found",
        });
      }
    }
  );

  // List files in bucket
  fastify.get<{ Params: { bucketName: string } }>(
    "/:bucketName/files",
    async (request, reply) => {
      const { bucketName } = request.params;

      try {
        const files = await fileService.listFiles(bucketName);
        return reply.code(200).send(files);
      } catch (err) {
        return reply.code(404).send({
          error: err instanceof Error ? err.message : "Failed to list files",
        });
      }
    }
  );
}
