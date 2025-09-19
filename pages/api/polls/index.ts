import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import Poll from "../../../models/Poll";
import withAuth, { AuthRequest } from "../../../middleware/auth";

// /api/polls
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const polls = await Poll.find().populate("createdBy", "username email");
      return res.status(200).json(polls);
    } catch (error: any) {
      console.error("Error fetching polls:", error);
      return res.status(500).json({ message: "Error fetching polls" });
    }
  }

  if (req.method === "POST") {
    return withAuth(async (req: AuthRequest, res: NextApiResponse) => {
      try {
        const { question, options } = req.body;

        if (!question || !options || options.length < 2) {
          return res.status(400).json({ message: "Poll must have question + at least 2 options" });
        }

        const formattedOptions = options.map((opt: any) =>
          typeof opt === "string" ? { text: opt, votes: 0 } : opt
        );

        const poll = await Poll.create({
          question,
          options: formattedOptions,
          createdBy: req.user!._id,
        });

        req.user!.createdPolls.push(poll._id);
        await req.user!.save();

        return res.status(201).json(poll);
      } catch (error: any) {
        console.error("Error creating poll:", error);
        return res.status(500).json({ message: error.message || "Error creating poll" });
      }
    })(req, res);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
