// models/Vote.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IVote extends Document {
  poll: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  optionIndex: number;
  isCorrect: boolean;
}

const VoteSchema = new Schema<IVote>({
  poll: { type: Schema.Types.ObjectId, ref: "Poll", required: true },
  student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  optionIndex: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true },
}, { timestamps: true });

VoteSchema.index({ poll: 1, student: 1 }, { unique: true }); // enforce one vote per student per poll

const Vote: Model<IVote> = mongoose.models.Vote || mongoose.model<IVote>("Vote", VoteSchema);
export default Vote;
