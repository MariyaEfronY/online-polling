import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../lib/dbConnect";
import Poll from "../../../../models/Poll";
import Vote from "../../../../models/Vote";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === "POST") {
    const { option, userId } = req.body;
    const ip =
      (req.headers["x-forwarded-for"] as string) ||
      req.socket.remoteAddress ||
      "unknown";

    const poll = await Poll.findById(id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    const alreadyVoted = await Vote.findOne({
      pollId: id,
      $or: [{ userId }, { ip }],
    });

    if (alreadyVoted) {
      return res.status(400).json({ message: "Already voted" });
    }

    const vote = await Vote.create({ pollId: id, userId, ip, option });

    const optIndex = poll.options.findIndex((o) => o.text === option);
    if (optIndex === -1) {
      return res.status(400).json({ message: "Invalid option" });
    }

    poll.options[optIndex].votes += 1;
    await poll.save();

    return res
      .status(201)
      .json({ message: "Vote cast successfully", poll, vote });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
