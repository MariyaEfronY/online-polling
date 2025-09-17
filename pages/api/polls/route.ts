import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Poll from "../../../models/Poll";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { question, options } = body;

    if (!question || !options || options.length < 2) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const poll = await Poll.create({ question, options });
    return NextResponse.json(poll, { status: 201 });
  } catch (err: any) {
    console.error("Error creating poll:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
