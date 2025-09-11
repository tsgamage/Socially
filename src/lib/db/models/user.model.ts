import { IUser } from "@/lib/types/modals.type";
import mongoose from "mongoose";

const userSchema: mongoose.Schema = new mongoose.Schema<IUser>(
  {
    clerkId: { type: String, unique: true, required: true, index: true },
    username: { type: String, unique: true, required: true, index: true }, // fast username lookups
    email: { type: String, unique: true, required: true, index: true }, // login
    name: { type: String },
    gender: { type: String, enum: ["male", "female", "other"], default: "other" },
    bio: { type: String, maxLength: 160, default: "Earth is a donut 🤓!" },
    note: { type: String, default: "Hey there!" },
    status: { type: String, enum: ["online", "offline"], default: "online" },
    profilePic: { type: String },
    bannerPic: { type: String },
    lastOnline: { type: Date, default: Date.now },

    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    postsCount: { type: Number, default: 0 },
    savedPostsCount: { type: Number, default: 0 },
    notificationsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;
