import { Bucket } from "../models/bucket";
import { promises as fs } from "fs";
import path from "path";

const STORAGE_ROOT =
  process.env.STORAGE_DIR || path.join(process.cwd(), "storage");

export class BucketService {
  private async ensureStorageRoot() {
    try {
      await fs.mkdir(STORAGE_ROOT, { recursive: true });
    } catch (err) {
      throw new Error("Failed to initialize storage root");
    }
  }

  async createBucket(name: string): Promise<Bucket> {
    await this.ensureStorageRoot();
    const bucketPath = path.join(STORAGE_ROOT, name);

    try {
      await fs.mkdir(bucketPath);
      return {
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (err) {
      throw new Error(`Failed to create bucket: ${name}`);
    }
  }

  async listBuckets(): Promise<Bucket[]> {
    await this.ensureStorageRoot();

    try {
      const items = await fs.readdir(STORAGE_ROOT, { withFileTypes: true });
      const buckets = await Promise.all(
        items
          .filter((item) => item.isDirectory())
          .map(async (dir) => {
            const stats = await fs.stat(path.join(STORAGE_ROOT, dir.name));
            return {
              name: dir.name,
              createdAt: stats.birthtime,
              updatedAt: stats.mtime,
            };
          })
      );
      return buckets;
    } catch (err) {
      throw new Error("Failed to list buckets");
    }
  }

  async deleteBucket(name: string): Promise<void> {
    const bucketPath = path.join(STORAGE_ROOT, name);

    try {
      await fs.rmdir(bucketPath, { recursive: true });
    } catch (err) {
      throw new Error(`Failed to delete bucket: ${name}`);
    }
  }

  async getBucketInfo(name: string): Promise<Bucket> {
    const bucketPath = path.join(STORAGE_ROOT, name);

    try {
      const stats = await fs.stat(bucketPath);
      return {
        name,
        createdAt: stats.birthtime,
        updatedAt: stats.mtime,
      };
    } catch (err) {
      throw new Error(`Bucket not found: ${name}`);
    }
  }
}
