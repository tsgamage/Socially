import { IPost } from "@/lib/types/modals.type";
import mongoose from "mongoose";

const votes = new mongoose.Schema({
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  voteCount: { type: Number, default: 0 },
});

const PostSchema = new mongoose.Schema<IPost>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    content: { type: String, required: true },
    location: { type: String, default: null },
    images: [{ type: String }],
    votes: votes,
    commentsCount: { type: Number, default: 0 },
    votesCount: { type: Number, default: 0 },
    visibility: { type: String, enum: ["public", "private"], default: "public" },
  },
  { timestamps: true }
);

// Index for feed (user’s posts sorted by time)
PostSchema.index({ user: 1, createdAt: -1 });
PostSchema.index({ createdAt: -1 });

const Post = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
export default Post;
