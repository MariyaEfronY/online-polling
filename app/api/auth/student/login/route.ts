import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Student from "@/models/Student";
import { signStudentToken } from "@/lib/auth";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { dno, email } = await req.json();
    if (!dno || !email) return NextResponse.json({ message: "Missing fields" }, { status: 400 });

    let student = await Student.findOne({ dno, email });
    if (!student) {
      student = await Student.create({ dno, email });
    }
    const token = signStudentToken(student._id.toString());
    return NextResponse.json({ token, student: { id: student._id, dno, email } }, { status: 200 });
  } catch (err: any) {
    console.error("Student login err:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
