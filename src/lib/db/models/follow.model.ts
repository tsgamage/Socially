import { IFollow } from "@/lib/types/modals.type";
import mongoose from "mongoose";

const FollowSchema = new mongoose.Schema<IFollow>(
  {
    follower: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    following: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

FollowSchema.index({ follower: 1, following: 1 }, { unique: true });

const Follow = mongoose.model("Follow", FollowSchema);
export default Follow;
