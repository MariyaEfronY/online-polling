// pages/api/polls/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import dbConnect from "../../../lib/dbConnect";
import Poll from "../../../models/Poll";
import withAuth, { AuthRequest } from "../../../middleware/auth";

async function handler(req: NextApiRequest | AuthRequest, res: NextApiResponse) {
  await dbConnect();

  const { id } = req.query;

  // GET /api/polls/:id → fetch single poll
  if (req.method === "GET") {
    try {
      const poll = await Poll.findById(id).populate("createdBy", "username email");
      if (!poll) {
        return res.status(404).json({ message: "Poll not found" });
      }
      return res.status(200).json(poll);
    } catch (error: any) {
      console.error("Error fetching poll:", error);
      return res.status(500).json({ message: "Error fetching poll" });
    }
  }

  // POST /api/polls/:id/vote → vote on a poll (🔒 requires token)
  if (req.method === "POST") {
    return withAuth(async (req: AuthRequest, res: NextApiResponse) => {
      try {
        const { optionIndex } = req.body;

        const poll = await Poll.findById(id);
        if (!poll) {
          return res.status(404).json({ message: "Poll not found" });
        }

        if (
          optionIndex === undefined ||
          optionIndex < 0 ||
          optionIndex >= poll.options.length
        ) {
          return res.status(400).json({ message: "Invalid option index" });
        }

        poll.options[optionIndex].votes += 1;
        await poll.save();

        return res.status(200).json(poll);
      } catch (error: any) {
        console.error("Error voting:", error);
        return res.status(400).json({ message: error.message || "Error voting" });
      }
    })(req as AuthRequest, res);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default handler;
