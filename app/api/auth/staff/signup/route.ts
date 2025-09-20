import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { signStaffToken } from "@/lib/auth";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await req.json();
    if (!username || !email || !password) return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    const existing = await User.findOne({ email });
    if (existing) return NextResponse.json({ message: "User exists" }, { status: 400 });
    const user = await User.create({ username, email, password });
    const token = signStaffToken(user._id?.toString() || "");
    return NextResponse.json({ token, user: { id: user._id, username, email } }, { status: 201 });
  } catch (err: any) {
    console.error("Signup err:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
