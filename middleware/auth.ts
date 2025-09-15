// middleware/auth.ts
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import dbConnect from "../lib/dbConnect";
import User, { IUser } from "../models/User";
import { Document } from "mongoose";

export interface AuthRequest extends NextApiRequest {
  user?: IUser & Document;
}

// Higher-order function wrapper
export default function withAuth(
  handler: (req: AuthRequest, res: NextApiResponse) => Promise<void> | void
) {
  return async (req: AuthRequest, res: NextApiResponse) => {
    await dbConnect();

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };

      const user = (await User.findById(decoded.id)) as IUser & Document;

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user; // ✅ safely attach user
      return handler(req, res); // ✅ call your actual handler
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
}
