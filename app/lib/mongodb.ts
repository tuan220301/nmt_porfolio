import mongoose from "mongoose";
import { Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI; // Lấy từ biến môi trường
if (!MONGODB_URI) {
  throw new Error("MISSING: MongoDB connection string!");
}
export const connectDB = async (): Promise<Db> => {
  if (mongoose.connection.readyState >= 1) {
    console.log("Using existing MongoDB connection.");
    if (!mongoose.connection.db) {
      throw new Error("MongoDB connection is missing database object");
    }
    return mongoose.connection.db; // Đảm bảo trả về `Db`
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      dbName: "Porfolio",
    });

    if (!conn.connection.db) {
      throw new Error("MongoDB connection established but no database found");
    }

    console.log("MongoDB connected!");
    return conn.connection.db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("MongoDB connection failed");
  }
};
