import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Poll from "@/models/Poll";
import Vote from "@/models/Vote";
import { verifyTokenGetActor } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const actor = await verifyTokenGetActor(req);
  if (!actor || actor.type !== "staff") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const poll = await Poll.findById(params.id);
    if (!poll) return NextResponse.json({ message: "Poll not found" }, { status: 404 });
    if (String((actor.actor as any)._id) !== String(poll.createdBy)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const votes = await Vote.find({ poll: poll._id }).populate("student", "dno email");
    const summary = poll.options.map((opt) => ({ text: opt.text, votes: opt.votes }));
    return NextResponse.json({ poll, summary, votes }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
