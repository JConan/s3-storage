import { promises as fs } from "fs";
import path from "path";
import { File } from "../models/file";
import { BucketService } from "./bucket.service";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const STORAGE_ROOT =
  process.env.STORAGE_DIR || path.join(process.cwd(), "storage");

console.log(`File service storage directory: ${STORAGE_ROOT}`);

// MIME type mapping
const MIME_TYPES = {
  // Text files
  ".md": "text/markdown",
  ".txt": "text/plain",
  ".json": "application/json",

  // Image files
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",

  // Audio files
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",

  // Video files
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",

  // Document files
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
} as Record<string, string>;

function getMimeType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  return MIME_TYPES[ext] || "application/octet-stream";
}

export class FileService {
  private bucketService = new BucketService();

  async uploadFile(
    bucketName: string,
    fileName: string,
    fileData: Buffer
  ): Promise<File> {
    const bucketPath = path.join(STORAGE_ROOT, bucketName);
    const filePath = path.join(bucketPath, fileName);

    try {
      await fs.writeFile(filePath, fileData);
      const stats = await fs.stat(filePath);

      return {
        name: fileName,
        bucket: bucketName,
        size: stats.size,
        contentType: getMimeType(fileName),
        createdAt: stats.birthtime,
        updatedAt: stats.mtime,
      };
    } catch (err) {
      throw new Error(`Failed to upload file: ${fileName}`);
    }
  }

  async downloadFile(
    bucketName: string,
    fileName: string
  ): Promise<{ data: Buffer; contentType: string }> {
    const filePath = path.join(STORAGE_ROOT, bucketName, fileName);

    try {
      const data = await fs.readFile(filePath);
      return {
        data,
        contentType: getMimeType(fileName),
      };
    } catch (err) {
      throw new Error(`Failed to download file: ${fileName}`);
    }
  }

  async deleteFile(bucketName: string, fileName: string): Promise<void> {
    const filePath = path.join(STORAGE_ROOT, bucketName, fileName);

    try {
      await fs.unlink(filePath);
    } catch (err) {
      throw new Error(`Failed to delete file: ${fileName}`);
    }
  }

  async getFileInfo(bucketName: string, fileName: string): Promise<File> {
    const filePath = path.join(STORAGE_ROOT, bucketName, fileName);

    console.log({ filePath });

    try {
      const stats = await fs.stat(filePath);
      return {
        name: fileName,
        bucket: bucketName,
        size: stats.size,
        contentType: getMimeType(fileName),
        createdAt: stats.birthtime,
        updatedAt: stats.mtime,
      };
    } catch (err) {
      throw new Error(`File not found: ${fileName}`);
    }
  }

  async listFiles(bucketName: string): Promise<File[]> {
    const bucketPath = path.join(STORAGE_ROOT, bucketName);

    try {
      const items = await fs.readdir(bucketPath, { withFileTypes: true });
      const files = await Promise.all(
        items
          .filter((item) => item.isFile())
          .map(async (file) => {
            const stats = await fs.stat(path.join(bucketPath, file.name));
            return {
              name: file.name,
              bucket: bucketName,
              size: stats.size,
              contentType: getMimeType(file.name),
              createdAt: stats.birthtime,
              updatedAt: stats.mtime,
            };
          })
      );
      return files;
    } catch (err) {
      throw new Error(`Failed to list files in bucket: ${bucketName}`);
    }
  }
}
