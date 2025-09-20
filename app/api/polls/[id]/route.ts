import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Poll from "@/models/Poll";
import { verifyTokenGetActor } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const poll = await Poll.findById(params.id).populate("createdBy", "username email");
    if (!poll) return NextResponse.json({ message: "Not found" }, { status: 404 });
    const actor = await verifyTokenGetActor(req);
    const obj = poll.toObject();
    // Only staff creator sees correct answer
    if (!actor || actor.type !== "staff" || String((actor.actor as any)._id) !== String(poll.createdBy)) {
      delete (obj as any).correctOption;
    }
    return NextResponse.json(obj, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: "Error fetching poll" }, { status: 500 });
  }
}
