"use server";

import { connectDB } from "@/lib/db/db.config";
import Post from "@/lib/db/models/post.model";
import { revalidatePath } from "next/cache";
import { getUserByClerkId } from "./util.action";
import { IFetchedPost, IPost, ISavedPost, IUser, IVote } from "@/lib/types/modals.type";
import Comment from "@/lib/db/models/comment.modal";
import SavedPost from "@/lib/db/models/savedPost.modal";
import Notification from "@/lib/db/models/notification.modal";
import Vote from "@/lib/db/models/vote.model";

export type PostFormState = {
  success: boolean;
  message: string;
  content?: string;
};

// * Post handling functions
export async function createPost(formData: FormData): Promise<PostFormState> {
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

export async function getAllPosts(): Promise<IFetchedPost[]> {
  try {
    await connectDB();
    const user = await getUserByClerkId();

    const posts = await Post.find({ visibility: "public" })
      .sort({ createdAt: -1 })
      .populate("user", "name username clerkId profilePic")
      .lean();

    if (user) {
      for (const post of posts) {
        // Check if user has voted
        const vote: IVote | null = await Vote.findOne({ post: post._id, user: user._id });
        // 0 for no vote, 1 for upvote, -1 for downvote
        if (vote) {
          post.vote = vote.value;
        } else {
          post.vote = 0;
        }

        // Check if user has saved
        const saved = await SavedPost.findOne({ post: post._id, user: user._id });
        post.isSaved = !!saved;
      }
    } else {
      for (const post of posts) {
        post.vote = "unauthenticated";
        post.isSaved = "unauthenticated";
      }
    }

    return JSON.parse(JSON.stringify(posts));
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "An unknown error occurred.";
    throw new Error(message);
  }
}

export async function getPostById(postId: string) {
  console.log("getting post by postId", postId);
  try {
    await connectDB();
    const post = await Post.findById(postId).populate("user", "name username clerkId profilePic").lean();

    return JSON.parse(JSON.stringify(post));
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "An unknown error occurred.";
    throw new Error(message);
  }
}

export async function deletePost(postId: string) {
  try {
    await connectDB();
    const user = await getUserByClerkId();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const post: IPost | null = await Post.findById(postId);

    console.log(post?.user.toString());

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.user.toString() !== user._id.toString()) {
      throw new Error("Unauthorized");
    }

    await Comment.deleteMany({ post: postId });
    await SavedPost.deleteMany({ post: postId });
    await Notification.deleteMany({ post: postId });
    await Vote.deleteMany({ post: postId });
    await Post.findByIdAndDelete(postId);
    revalidatePath("/");

    return { success: true, message: "Post deleted successfully!" };
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "An unknown error occurred.";
    throw new Error(message);
  }
}

// TODO: check below function
export async function updatePost(postId: string, post: IPost) {
  try {
    await connectDB();
    await Post.findByIdAndUpdate(postId, post);
    revalidatePath("/");
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "An unknown error occurred.";
    throw new Error(message);
  }
}

// * Vote handling functions
export async function giveUpvote(postId: string) {
  try {
    await connectDB();
    const user = await getUserByClerkId();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const post: IPost | null = await Post.findById(postId);

    console.log(post);

    if (!post) {
      throw new Error("Post not found");
    }

    const isAlreadyVoted: IVote | null = await Vote.findOne({ post: post._id, user: user._id });

    if (!isAlreadyVoted) {
      await new Vote({ post: post._id, user: user._id, value: 1 }).save();
      post.votesCount += 1;
    } else {
      await Vote.findOneAndDelete({ post: post._id, user: user._id });
      if (isAlreadyVoted.value === 1) {
        post.votesCount -= 1;
      } else if (isAlreadyVoted.value === -1) {
        await new Vote({ post: post._id, user: user._id, value: 1 }).save();
        // one for deleting previos downvote and one for adding new upvote
        post.votesCount += 2;
      }
    }

    await post.save();
    revalidatePath("/");

    return { success: true, message: "Post Upvoted successfully!" };
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "An unknown error occurred.";
    throw new Error(message);
  }
}

export async function giveDownvote(postId: string) {
  try {
    await connectDB();
    const user: IUser = await getUserByClerkId();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const post: IPost | null = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    const isAlreadyVoted: IVote | null = await Vote.findOne({ post: post._id, user: user._id });

    if (!isAlreadyVoted) {
      await new Vote({ post: post._id, user: user._id, value: -1 }).save();
      post.votesCount -= 1;
    } else {
      await Vote.findOneAndDelete({ post: post._id, user: user._id });
      if (isAlreadyVoted.value === -1) {
        post.votesCount += 1;
      } else if (isAlreadyVoted.value === 1) {
        await new Vote({ post: post._id, user: user._id, value: -1 }).save();
        // one for deleting previos upvote and one for adding new downvote
        post.votesCount -= 2;
      }
    }

    await post.save();
    revalidatePath("/");

    return { success: true, message: "Post Downvoted successfully!" };
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "An unknown error occurred.";
    throw new Error(message);
  }
}

export async function isAlreadyVoted(postId: string): Promise<IVote | null> {
  try {
    await connectDB();
    const user: IUser = await getUserByClerkId();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const post: IPost | null = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    const vote: IVote | null = await Vote.findOne({ post: post._id, user: user._id });

    return JSON.parse(JSON.stringify(vote));
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "An unknown error occurred.";
    throw new Error(message);
  }
}

export async function toggleSavePost(postId: string) {
  try {
    await connectDB();
    const user: IUser = await getUserByClerkId();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const post: IPost | null = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    const isAlreadySaved: ISavedPost | null = await SavedPost.findOne({ post: post._id, user: user._id });

    if (!isAlreadySaved) {
      await new SavedPost({ post: post._id, user: user._id }).save();
    } else {
      await SavedPost.findOneAndDelete({ post: post._id, user: user._id });
    }

    revalidatePath("/");

    return { success: true };
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "An unknown error occurred.";
    throw new Error(message);
  }
}

export async function isPostSaved(postId: string): Promise<ISavedPost | null> {
  try {
    await connectDB();
    const user: IUser = await getUserByClerkId();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const post: IPost | null = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    const savedPost: ISavedPost | null = await SavedPost.findOne({ post: post._id, user: user._id });

    return JSON.parse(JSON.stringify(savedPost));
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "An unknown error occurred.";
    throw new Error(message);
  }
}
