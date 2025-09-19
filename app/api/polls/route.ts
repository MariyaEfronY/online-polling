import dbConnect from "@/lib/dbConnect";
import Poll from "@/models/Poll";
import { NextResponse } from "next/server";

// GET /api/polls
export async function GET() {
  await dbConnect();
  try {
    const polls = await Poll.find().populate("createdBy", "username email");
    return NextResponse.json(polls, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching polls:", error);
    return NextResponse.json({ message: "Error fetching polls" }, { status: 500 });
  }
}

// POST /api/polls
export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const { question, options } = body;

    if (!question || !options || options.length < 2) {
      return NextResponse.json(
        { message: "Poll must have question + at least 2 options" },
        { status: 400 }
      );
    }

    const formattedOptions = options.map((opt: any) =>
      typeof opt === "string" ? { text: opt, votes: 0 } : opt
    );

    const poll = await Poll.create({
      question,
      options: formattedOptions,
      // ⚠️ Authentication handling in app router differs,
      // you'll need to attach user id from middleware/session
      createdBy: null,
    });

    return NextResponse.json(poll, { status: 201 });
  } catch (error: any) {
    console.error("Error creating poll:", error);
    return NextResponse.json(
      { message: error.message || "Error creating poll" },
      { status: 500 }
    );
  }
}
