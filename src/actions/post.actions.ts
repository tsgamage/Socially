"use server";

import { connectDB } from "@/lib/db/db.config";
import Post from "@/lib/db/models/post.model";
import User from "@/lib/db/models/user.model";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export type PostFormState = {
  success: boolean;
  message: string;
  content?: string;
};

export async function createPost(
  preState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const content = formData.get("content") as string;
  if (!content) {
    return { success: false, message: "Post content cannot be empty.", content };
  }

  try {
    await connectDB();
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "Unauthorized", content };
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return { success: false, message: "User not found", content };
    }

    const post = new Post({ content, user: user._id });

    await post.save();

    revalidatePath("/");
    return { success: true, message: "Post created successfully!" };
  } catch (err) {
    console.error("Error creating post:", err);
    const message = err instanceof Error ? err.message : "An unknown error occurred.";
    return { success: false, message };
  }
}

export async function getAllPosts() {
  try {
    const { userId } = await auth();
    console.log(`userId: ${userId}`);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    const posts = await Post.find({ user: user._id });

    return { success: true, posts };
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "An unknown error occurred.";
    return { success: false, message };
  }
}
