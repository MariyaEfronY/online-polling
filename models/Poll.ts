import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPoll extends Document {
  question: string;
  options: { text: string; votes: number }[];
  createdBy: mongoose.Types.ObjectId;
}

const PollSchema = new Schema<IPoll>(
  {
    question: { type: String, required: true },
    options: [
      {
        text: { type: String, required: true },
        votes: { type: Number, default: 0 },
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Poll: Model<IPoll> =
  mongoose.models.Poll || mongoose.model<IPoll>("Poll", PollSchema);

export default Poll;
