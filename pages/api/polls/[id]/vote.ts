// pages/api/polls/[id]/vote.ts
import type { NextApiResponse } from "next";
import type { AuthRequest } from "../../../../middleware/auth";
import dbConnect from "../../../../lib/dbConnect";
import Poll from "../../../../models/Poll";
import withAuth from "../../../../middleware/auth";

async function handler(req: AuthRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const { id } = req.query;
      const { optionIndex } = req.body;

      console.log("Vote API hit 👉", { id, optionIndex, user: req.user?._id });

      if (typeof optionIndex !== "number") {
        return res.status(400).json({ message: "optionIndex must be a number" });
      }

      const poll = await Poll.findById(id);
      if (!poll) {
        return res.status(404).json({ message: "Poll not found" });
      }

      if (optionIndex < 0 || optionIndex >= poll.options.length) {
        return res.status(400).json({ message: "Invalid option index" });
      }

      poll.options[optionIndex].votes += 1;
      await poll.save();

      return res.status(200).json(poll);
    } catch (error: any) {
      console.error("🔥 Vote error details:", error.message, error.stack);
      return res.status(500).json({ message: "Error voting on poll", error: error.message });
    }
  }

  res.setHeader("Allow", ["POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

// 👇 This is required
export default withAuth(handler);
