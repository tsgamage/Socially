"use server";

import User from "@/lib/db/models/user.model";
import { auth } from "@clerk/nextjs/server";

export async function getUserByClerkId() {
  try {
    const { userId } = await auth();
    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch {
    return false;
  }
}
