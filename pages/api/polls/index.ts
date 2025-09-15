// pages/api/polls/index.ts
import type { NextApiResponse } from "next";
import mongoose from "mongoose"; // 👈 import ObjectId type
import dbConnect from "../../../lib/dbConnect";
import Poll, { IPoll } from "../../../models/Poll";
import withAuth, { AuthRequest } from "../../../middleware/auth";

async function handler(req: AuthRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const { question, options } = req.body;

      const poll: IPoll = await Poll.create({
        question,
        options,
        createdBy: req.user!._id,
      });

      // 👇 fix: cast poll._id to ObjectId
      req.user!.createdPolls.push(poll._id as unknown as mongoose.Types.ObjectId);

      await req.user!.save();

      return res.status(201).json(poll);
    } catch (error) {
      console.error("Error creating poll:", error);
      return res.status(400).json({ message: "Error creating poll" });
    }
  }

  res.setHeader("Allow", ["POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default withAuth(handler);
