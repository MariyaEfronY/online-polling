// lib/auth.ts
import jwt from "jsonwebtoken";
import dbConnect from "./dbConnect";
import User from "../models/User";
import Student from "../models/Student";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("JWT_SECRET missing in env");

// ------------------- Token Helpers -------------------
export function signStaffToken(userId: string) {
  return jwt.sign({ id: userId, type: "staff" }, JWT_SECRET, { expiresIn: "7d" });
}

export function signStudentToken(studentId: string) {
  return jwt.sign({ id: studentId, type: "student" }, JWT_SECRET, { expiresIn: "7d" });
}

// ✅ Add these for frontend use
export function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
}

export function clearToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

// ------------------- Verify Middleware -------------------
export async function verifyTokenGetActor(req: Request) {
  await dbConnect();
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;

  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; type: string };

    if (decoded.type === "staff") {
      const user = await User.findById(decoded.id);
      return user ? { actor: user, type: "staff" as const } : null;
    } else {
      const student = await Student.findById(decoded.id);
      return student ? { actor: student, type: "student" as const } : null;
    }
  } catch {
    return null;
  }
}
