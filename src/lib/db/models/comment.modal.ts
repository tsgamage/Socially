import { IComment } from "@/lib/types/modals.type";
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema<IComment>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    content: { type: String, required: true },
    type: { type: String, enum: ["comment", "reply"], default: "comment" },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
    // replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ createdAt: -1 });

const Comment = mongoose.models.Comment || mongoose.model<IComment>("Comment", commentSchema);
export default Comment;
