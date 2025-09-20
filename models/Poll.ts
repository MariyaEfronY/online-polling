// models/Poll.ts
import mongoose, { Document, Model, Schema } from "mongoose";

interface OptionSub {
  text: string;
  votes: number;
}

export interface IPoll extends Document {
  question: string;
  options: OptionSub[];
  correctOption?: number; // index of correct choice (for grading)
  createdBy: mongoose.Types.ObjectId; // staff id
  expiryDate?: Date;
}

const OptionSchema = new Schema<OptionSub>({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 },
});

const PollSchema = new Schema<IPoll>({
  question: { type: String, required: true },
  options: { type: [OptionSchema], required: true },
  correctOption: { type: Number }, // optional
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  expiryDate: { type: Date },
}, { timestamps: true });

const Poll: Model<IPoll> = mongoose.models.Poll || mongoose.model<IPoll>("Poll", PollSchema);
export default Poll;
