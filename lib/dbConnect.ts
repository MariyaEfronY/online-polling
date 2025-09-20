// lib/dbConnect.ts
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;
if (!MONGO_URI) throw new Error("Please set MONGO_URI in .env.local");

let cached: any = (global as any).__mongo;
if (!cached) cached = (global as any).__mongo = { conn: null, promise: null };

export default async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
