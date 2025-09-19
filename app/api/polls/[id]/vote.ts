import type { NextApiResponse } from "next";
import dbConnect from "../../../../lib/dbConnect";
import Poll from "../../../../models/Poll";
import withAuth, { AuthRequest } from "../../../../middleware/auth";

// /api/polls/:id/vote
export default withAuth(async function handler(req: AuthRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { id } = req.query;
    const { optionIndex } = req.body;

    const poll = await Poll.findById(id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    if (optionIndex === undefined || optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ message: "Invalid option index" });
    }

    poll.options[optionIndex].votes += 1;
    await poll.save();

    return res.status(200).json(poll);
  } catch (error: any) {
    console.error("Error voting:", error);
    return res.status(500).json({ message: "Error voting" });
  }
});
