"use server";

import { connectDB } from "@/lib/db/db.config";
import Follow from "@/lib/db/models/follow.model";
import Notification from "@/lib/db/models/notification.modal";
import Post from "@/lib/db/models/post.model";
import User from "@/lib/db/models/user.model";
import { IUser } from "@/lib/types/modals.type";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
  try {
    await connectDB();
    const { userId } = await auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
      console.warn("syncUser: No user ID or clerk user found.");
      return;
    }

    const userAlreadyExists = await User.findOne({ clerkId: userId });

    if (userAlreadyExists) {
      // * Add logic here to update the user if their Clerk data has changed.
      return;
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;

    const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ");

    const newUser = new User({
      clerkId: userId,
      username: clerkUser.username,
      email: email,
      name: name,
      profilePic: clerkUser.imageUrl || "",
    });

    await newUser.save();
  } catch (err) {
    console.error("Error in syncUser:", err);
  }
}

export async function getUserByUsername(username: string) {
  try {
    const user = (await User.findOne({ username })) as IUser;
    if (!user) {
      throw new Error("Not Found");
    }
    const postsCount = await Post.countDocuments({ user: user._id });
    const notificationsCount = await Notification.countDocuments({ user: user._id });
    const followersCount = await Follow.countDocuments({ following: user._id });
    const followingCount = await Follow.countDocuments({ follower: user._id });

    user.followersCount = followersCount;
    user.followingCount = followingCount;
    user.postsCount = postsCount;
    user.notificationsCount = notificationsCount;

    user.save();
    return { data: JSON.parse(JSON.stringify(user)) as IUser };
  } catch (err) {
    console.error("Error in getUserByClerkId:", err);
    throw new Error("Error in getUserByClerkId");
  }
}
