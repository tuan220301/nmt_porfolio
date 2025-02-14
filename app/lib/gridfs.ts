import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import { connectDB } from "./mongodb";

let gridFSBucket: GridFSBucket | null = null;

export const getGridFSBucket = async (): Promise<GridFSBucket> => {
  const db = await connectDB(); // Chắc chắn rằng `db` luôn tồn tại
  if (!db) {
    throw new Error("Failed to get database instance.");
  }
  return new GridFSBucket(db, { bucketName: "uploads" });
};

