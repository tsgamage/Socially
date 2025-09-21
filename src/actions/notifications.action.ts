"use server";

import Notification from "@/lib/db/models/notification.modal";
import { getUserByClerkId } from "./util.action";
import { connectDB } from "@/lib/db/db.config";
import { IFetchedNotification, INotification, IUser } from "@/lib/types/modals.type";

await connectDB();

export async function getNotificationsCount(): Promise<number> {
  try {
    const user = await getUserByClerkId();
    if (!user) {
      throw Error("Unauthorized");
    }
    const notificationsCount: number = await Notification.countDocuments({ user: user._id, read: false });

    return notificationsCount;
  } catch (err) {
    console.error("Error checkAnyNotificationsExists post:", err);
    const message = err instanceof Error ? err.message : "An unknown error occurred.";
    throw new Error(message);
  }
}

export async function fetchUserNotifications(): Promise<IFetchedNotification[]> {
  try {
    const user = await getUserByClerkId();
    if (!user) {
      throw Error("Unauthorized");
    }
    const notifications = await Notification.find({ user: user._id })
      .populate("user sender post comment")
      .sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(notifications));
  } catch (err) {
    console.error("Error fetchUserNotifications post:", err);
    const message = err instanceof Error ? err.message : "An unknown error occurred.";
    throw new Error(message);
  }
}

export async function markAsReadNotificationById(notificationId: string) {
  try {
    const user = await getUserByClerkId();
    if (!user) {
      throw Error("Unauthorized");
    }
    const notification = (await Notification.findById(notificationId)) as INotification;

    notification.read = true;
    notification.save();
  } catch (err) {
    console.error("Error markAsReadNotificationById post:", err);
    const message = err instanceof Error ? err.message : "An unknown error occurred.";
    throw new Error(message);
  }
}

export async function deleteNotificationById(notificationId: string) {
  try {
    const user: IUser = await getUserByClerkId();
    if (!user) {
      throw Error("Unauthorized");
    }
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw Error("Notification not found");
    }

    await Notification.findByIdAndDelete(notificationId);
  } catch (err) {
    console.log("Error in deleteNotificatoinById", err);
    const message = err instanceof Error ? err.message : "An unknown error occured";
    throw new Error(message);
  }
}
