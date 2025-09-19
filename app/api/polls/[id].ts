import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import Poll from "../../../models/Poll";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const poll = await Poll.findById(id).populate("createdBy", "username email");
      if (!poll) return res.status(404).json({ message: "Poll not found" });

      return res.status(200).json(poll);
    } catch (error: any) {
      console.error("Error fetching poll:", error);
      return res.status(500).json({ message: "Error fetching poll" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const poll = await Poll.findByIdAndDelete(id);
      if (!poll) return res.status(404).json({ message: "Poll not found" });

      return res.status(200).json({ message: "Poll deleted" });
    } catch (error: any) {
      console.error("Error deleting poll:", error);
      return res.status(500).json({ message: "Error deleting poll" });
    }
  }

  res.setHeader("Allow", ["GET", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
