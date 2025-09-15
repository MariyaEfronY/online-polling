import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOption {
  text: string;
  votes: number;
}

export interface IPoll extends Document {
  question: string;
  options: IOption[];
  createdBy: mongoose.Types.ObjectId;
  expiryDate?: Date;
}

const OptionSchema: Schema<IOption> = new Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 },
});

const PollSchema: Schema<IPoll> = new Schema(
  {
    question: { type: String, required: true },
    options: [OptionSchema],
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    expiryDate: { type: Date },
  },
  { timestamps: true }
);

const Poll: Model<IPoll> =
  mongoose.models.Poll || mongoose.model<IPoll>("Poll", PollSchema);

export default Poll;
