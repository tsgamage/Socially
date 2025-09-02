import { IVote } from "@/lib/types/modals.type";
import mongoose from "mongoose";

const VoteSchema = new mongoose.Schema<IVote>(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    value: { type: Number, enum: [1, -1], required: true },
  },
  { timestamps: true }
);

// Compound index for efficient search and to prevent duplicate votes
VoteSchema.index({ post: 1, user: 1 }, { unique: true });

const Vote = mongoose.models.Vote || mongoose.model<IVote>("Vote", VoteSchema);
export default Vote;
