// middleware/auth.ts
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import jwt from "jsonwebtoken";
import dbConnect from "../lib/dbConnect";
import User, { IUser } from "../models/User";
import { Document } from "mongoose";

export interface AuthRequest extends NextApiRequest {
  user?: IUser & Document;
}

export default function withAuth(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

      const user = await User.findById(decoded.id) as IUser & Document;
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Attach user safely
      (req as AuthRequest).user = user;

      return (handler as any)(req as AuthRequest, res);
    } catch (error) {
      console.error("Auth error:", error);
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
}
