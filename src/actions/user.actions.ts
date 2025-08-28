"use server";

import { connectDB } from "@/lib/db/db.config";
import User from "@/lib/db/models/user.model";
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
