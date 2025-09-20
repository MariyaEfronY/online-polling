// models/Student.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IStudent extends Document {
  dno: string;
  email: string;
}

const StudentSchema = new Schema<IStudent>({
  dno: { type: String, required: true },
  email: { type: String, required: true },
}, { timestamps: true });

StudentSchema.index({ dno: 1, email: 1 }, { unique: true });

const Student: Model<IStudent> = mongoose.models.Student || mongoose.model<IStudent>("Student", StudentSchema);
export default Student;
