import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Poll from "@/models/Poll";
import { verifyTokenGetActor } from "@/lib/auth";

export async function GET(req: Request) {
  await dbConnect();
  try {
    // list active polls. For students, return all active polls; staff can also view.
    const polls = await Poll.find().populate("createdBy", "username email").sort({ createdAt: -1 });
    // Do not send correctOption in list (for tests)
    const safe = polls.map(p => {
      const obj = p.toObject();
      delete obj.correctOption;
      return obj;
    });
    return NextResponse.json(safe, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: "Error fetching polls" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  const actor = await verifyTokenGetActor(req);
  if (!actor || actor.type !== "staff") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { question, options, correctOption, expiryDate } = await req.json();
    if (!question || !options || options.length < 2) return NextResponse.json({ message: "Invalid payload" }, { status: 400 });

    const formatted = options.map((o: any) => typeof o === "string" ? { text: o, votes: 0 } : o);
    const poll = await Poll.create({
      question,
      options: formatted,
      correctOption,
      createdBy: actor.actor._id,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
    });
    // link to staff
    const user = actor.actor;
    (user as any).createdPolls.push(poll._id);
    await (user as any).save();
    return NextResponse.json(poll, { status: 201 });
  } catch (err: any) {
    console.error("Create poll err:", err);
    return NextResponse.json({ message: "Error creating poll" }, { status: 500 });
  }
}
