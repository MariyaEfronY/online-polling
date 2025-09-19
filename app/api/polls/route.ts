import dbConnect from "@/lib/dbConnect";
import Poll from "@/models/Poll";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    console.log("📥 Incoming body:", body); // 🔍 log request

    const { question, options } = body;

    if (!question || !options || options.length < 2) {
      return NextResponse.json(
        { message: "Poll must have question + at least 2 options" },
        { status: 400 }
      );
    }

    // 🔑 Verify JWT
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      console.error("❌ JWT verification failed:", err);
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    console.log("✅ Authenticated user:", decoded);

    const formattedOptions = options.map((opt: any) =>
      typeof opt === "string" ? { text: opt, votes: 0 } : opt
    );

    const poll = await Poll.create({
      question,
      options: formattedOptions,
      createdBy: decoded.id, // ✅ now tied to user
    });

    return NextResponse.json(poll, { status: 201 });
  } catch (error: any) {
    console.error("❌ Error creating poll:", error.message, error.stack);
    return NextResponse.json(
      { message: error.message || "Error creating poll" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();
  try {
    const polls = await Poll.find().populate("createdBy", "username email");
    return NextResponse.json(polls, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error fetching polls:", error);
    return NextResponse.json({ message: "Error fetching polls" }, { status: 500 });
  }
}
