import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import Poll from "../../../models/Poll";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const poll = await Poll.findById(id);
      if (!poll) return res.status(404).json({ message: "Poll not found" });
      return res.status(200).json(poll);
    } catch {
      return res.status(400).json({ message: "Invalid poll ID" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
