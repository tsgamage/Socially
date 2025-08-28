import { ISavedPost } from "@/lib/types/modals.type";
import mongoose from "mongoose";

const SavedPostSchema = new mongoose.Schema<ISavedPost>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  },
  { timestamps: true }
);

SavedPostSchema.index({ user: 1, post: 1 }, { unique: true });

const SavedPost = mongoose.model("SavedPost", SavedPostSchema);
export default SavedPost;
