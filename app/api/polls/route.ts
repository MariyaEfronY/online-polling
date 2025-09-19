import dbConnect from "@/lib/dbConnect";
import Poll from "@/models/Poll";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    const polls = await Poll.find().populate("createdBy", "username email");
    return NextResponse.json(polls, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching polls:", err);
    return NextResponse.json({ message: "Error fetching polls" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { question, options } = await req.json();
    if (!question || !options || options.length < 2) {
      return NextResponse.json({ message: "Invalid poll data" }, { status: 400 });
    }

    const formattedOptions = options.map((opt: any) =>
      typeof opt === "string" ? { text: opt, votes: 0 } : opt
    );

    const poll = await Poll.create({
      question,
      options: formattedOptions,
      createdBy: null, // TODO: attach from JWT once auth is integrated
    });

    return NextResponse.json(poll, { status: 201 });
  } catch (err: any) {
    console.error("Error creating poll:", err);
    return NextResponse.json({ message: "Error creating poll" }, { status: 500 });
  }
}
