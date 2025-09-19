// pages/api/test-db.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    return res.status(200).json({ message: "MongoDB connected successfully!" });
  } catch (err) {
    console.error("DB connection error:", err);
    return res.status(500).json({ message: "DB connection failed", error: (err as Error).message });
  }
}
