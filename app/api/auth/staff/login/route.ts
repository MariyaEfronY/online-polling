import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { signStaffToken } from "@/lib/auth"; 

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) return NextResponse.json({ message: "Invalid cred" }, { status: 401 });
    const token = signStaffToken(user._id?.toString() || "");
    return NextResponse.json({ token, user: { id: user._id, username: user.username, email } }, { status: 200 });
  } catch (err: any) {
    console.error("Login err:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
