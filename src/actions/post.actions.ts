"use server";

import { connectDB } from "@/lib/db/db.config";
import Post from "@/lib/db/models/post.model";
import { revalidatePath } from "next/cache";
import { getUserByClerkId } from "./util.action";
import { IPost } from "@/lib/types/modals.type";

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
    const user = await getUserByClerkId();

    if (!user) {
      return { success: false, message: "Unauthorized", content };
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
    await connectDB();
    const user = await getUserByClerkId();

    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    const posts = await Post.find({ visibility: "public" })
      .sort({ createdAt: -1 })
      .populate("user", "name username avatar")
      .lean();

    return JSON.parse(JSON.stringify(posts));
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "An unknown error occurred.";
    throw new Error(message);
  }
}
