import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVote extends Document {
  pollId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  ip?: string;
  option: string;
}

const VoteSchema: Schema<IVote> = new Schema(
  {
    pollId: { type: Schema.Types.ObjectId, ref: "Poll", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    ip: { type: String },
    option: { type: String, required: true },
  },
  { timestamps: true }
);

const Vote: Model<IVote> =
  mongoose.models.Vote || mongoose.model<IVote>("Vote", VoteSchema);

export default Vote;
