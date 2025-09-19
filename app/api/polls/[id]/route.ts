import dbConnect from "@/lib/dbConnect";
import Poll from "@/models/Poll";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const poll = await Poll.findById(params.id).populate("createdBy", "username email");
    if (!poll) return NextResponse.json({ message: "Poll not found" }, { status: 404 });
    return NextResponse.json(poll, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: "Error fetching poll" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const poll = await Poll.findByIdAndDelete(params.id);
    if (!poll) return NextResponse.json({ message: "Poll not found" }, { status: 404 });
    return NextResponse.json({ message: "Poll deleted" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: "Error deleting poll" }, { status: 500 });
  }
}
