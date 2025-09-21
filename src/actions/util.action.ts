"use server";

import User from "@/lib/db/models/user.model";
import { IUser } from "@/lib/types/modals.type";
import { auth } from "@clerk/nextjs/server";

export async function getUserByClerkId(): Promise<IUser> {
  try {
    const { userId } = await auth();
    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch {
    throw Error("Error in getUserByClerkId");
  }
}
