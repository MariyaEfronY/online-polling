// pages/api/polls/index.ts
import type { NextApiResponse } from "next";
import mongoose from "mongoose";
import dbConnect from "../../../lib/dbConnect";
import Poll, { IPoll } from "../../../models/Poll";
import withAuth, { AuthRequest } from "../../../middleware/auth";

async function handler(req: any, res: NextApiResponse) {
  await dbConnect();

  if (req.method === "GET") {
    // 🔓 Public route
    try {
      const polls = await Poll.find().populate("createdBy", "username email");
      return res.status(200).json(polls);
    } catch (error: any) {
      console.error("Error fetching polls:", error);
      return res.status(500).json({ message: "Error fetching polls" });
    }
  }

  if (req.method === "POST") {
    // 🔒 Protected route
    return withAuth(async (req: AuthRequest, res: NextApiResponse) => {
      try {
        const { question, options } = req.body;

        const formattedOptions = options.map((opt: any) =>
          typeof opt === "string" ? { text: opt } : opt
        );

        const poll: IPoll = await Poll.create({
          question,
          options: formattedOptions,
          createdBy: req.user!._id,
        });

        req.user!.createdPolls.push(
          poll._id as unknown as mongoose.Types.ObjectId
        );
        await req.user!.save();

        return res.status(201).json(poll);
      } catch (error: any) {
        console.error("Error creating poll:", error);
        return res.status(400).json({ message: error.message || "Error creating poll" });
      }
    })(req, res); // 👈 invoke withAuth wrapper
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default handler;
