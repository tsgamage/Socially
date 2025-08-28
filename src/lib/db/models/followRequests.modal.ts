import { IFollowRequest } from "@/lib/types/modals.type";
import mongoose from "mongoose";

const FollowRequestSchema = new mongoose.Schema<IFollowRequest>(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

FollowRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

const FollowRequest = mongoose.model("FollowRequest", FollowRequestSchema);
export default FollowRequest;
