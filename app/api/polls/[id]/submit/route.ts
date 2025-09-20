import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Poll from "@/models/Poll";
import Vote from "@/models/Vote";
import { verifyTokenGetActor } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const actor = await verifyTokenGetActor(req);
  if (!actor || actor.type !== "student") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { optionIndex } = await req.json();
    const poll = await Poll.findById(params.id);
    if (!poll) return NextResponse.json({ message: "Poll not found" }, { status: 404 });

    // ensure option index valid
    if (typeof optionIndex !== "number" || optionIndex < 0 || optionIndex >= poll.options.length) {
      return NextResponse.json({ message: "Invalid option index" }, { status: 400 });
    }

    // enforce one vote per student per poll via unique index in Vote model
    const isCorrect = (typeof poll.correctOption === "number") && (optionIndex === poll.correctOption);
    // create vote (may throw duplicate key if already voted)
    try {
      const newVote = await Vote.create({
        poll: poll._id,
        student: (actor.actor as any)._id,
        optionIndex,
        isCorrect,
      });
      // increment poll option votes for quick aggregate
      poll.options[optionIndex].votes += 1;
      await poll.save();
      return NextResponse.json({ message: "Submitted", vote: newVote, isCorrect }, { status: 201 });
    } catch (voteErr: any) {
      // already voted
      if (voteErr.code === 11000) return NextResponse.json({ message: "You already submitted this poll" }, { status: 400 });
      throw voteErr;
    }
  } catch (err: any) {
    console.error("Submit err:", err);
    return NextResponse.json({ message: "Error submitting" }, { status: 500 });
  }
}
