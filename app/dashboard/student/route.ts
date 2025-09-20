import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Vote from "@/models/Vote";
import Poll from "@/models/Poll";
import { verifyTokenGetActor } from "@/lib/auth";

export async function GET(req: Request) {
  await dbConnect();
  const actor = await verifyTokenGetActor(req);
  if (!actor || actor.type !== "student") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const votes = await Vote.find({ student: (actor.actor as any)._id }).populate("poll");
    const data = votes.map(v => ({
      pollId: v.poll._id,
      question: (v.poll as any).question,
      optionIndex: v.optionIndex,
      isCorrect: v.isCorrect,
      submittedAt: (v as any).createdAt

    }));
    return NextResponse.json({ results: data }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
