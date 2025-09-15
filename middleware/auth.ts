// middleware/auth.ts
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import dbConnect from "../lib/dbConnect";
import User, { IUser } from "../models/User";

export interface AuthRequest extends NextApiRequest {
  user?: IUser;
}

export default function withAuth<
  T extends (req: AuthRequest, res: NextApiResponse) => any
>(handler: T) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      (req as AuthRequest).user = user; // 👈 safely attach user
      return handler(req as AuthRequest, res); // 👈 cast to AuthRequest
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
}
