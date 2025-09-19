import dbConnect from "@/lib/dbConnect";
import Poll from "@/models/Poll";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const { optionIndex } = await req.json();
    const poll = await Poll.findById(params.id);
    if (!poll) return NextResponse.json({ message: "Poll not found" }, { status: 404 });

    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return NextResponse.json({ message: "Invalid option index" }, { status: 400 });
    }

    poll.options[optionIndex].votes += 1;
    await poll.save();

    return NextResponse.json(poll, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: "Error voting" }, { status: 500 });
  }
}
