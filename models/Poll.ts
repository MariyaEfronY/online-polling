// models/Poll.ts
import mongoose, { Schema, Document } from "mongoose";

interface Option {
  text: string;
  votes: number;
}

export interface IPoll extends Document {
  question: string;
  options: Option[];
  createdBy: mongoose.Schema.Types.ObjectId;
  voters: mongoose.Schema.Types.ObjectId[]; // ✅ added
}

const optionSchema = new Schema<Option>({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 },
});

const pollSchema = new Schema<IPoll>(
  {
    question: { type: String, required: true },
    options: [optionSchema],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    voters: [{ type: Schema.Types.ObjectId, ref: "User" }], // ✅ new
  },
  { timestamps: true }
);

export default mongoose.models.Poll || mongoose.model<IPoll>("Poll", pollSchema);
