import { INotification } from "@/lib/types/modals.type";
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema<INotification>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { type: String, enum: ["like", "comment", "follow", "follow_accept"], required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// Fetch notifications for a user, newest first
NotificationSchema.index({ user: 1, createdAt: -1 });

const Notification =
  mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);
export default Notification;
