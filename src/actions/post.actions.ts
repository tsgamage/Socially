"use server";

import { connectDB } from "@/lib/db/db.config";
import Post from "@/lib/db/models/post.model";
import { revalidatePath } from "next/cache";
import { getUserByClerkId } from "./util.action";
import { IComment, IFetchedPost, IPost, ISavedPost, IUser, IVote } from "@/lib/types/modals.type";
import Comment from "@/lib/db/models/comment.modal";
import SavedPost from "@/lib/db/models/savedPost.modal";
import Notification from "@/lib/db/models/notification.modal";
import Vote from "@/lib/db/models/vote.model";
import xss from "xss";
import imagekit from "@/lib/config/imagekit";

export type PostFormState = {
  success: boolean;
  message: string;
  content?: string;
};

// * Post handling functions
export async function createPost(postData: { images: File[]; content: string }): Promise<PostFormState> {
  const images: File[] = postData.images;
  const content = postData.content;

  if (images.length === 0 && !content.trim()) {
    throw new Error("Post cannot be empty.");
  }

  try {
    await connectDB();
    const user = await getUserByClerkId();

    if (!user) {
      throw new Error("Unauthorized.");
    }

    const post: IPost = new Post({ user: user._id });

    if (content.trim()) {
      const senitizedContent = xss(content);
      post.content = senitizedContent;
    }

    // Upload single image
    if (images && images.length === 1) {
      const arrayBuffer = await images[0].arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Generate file name: original name + _ + random 6 digits + _ + timestamp (ms)
      const randomDigits = Math.floor(100000 + Math.random() * 900000);
      const timestamp = Date.now(); // milliseconds
      const fileName = `${images[0].name}_${randomDigits}_${timestamp}`;

      const response = (await imagekit.upload({
        file: buffer,
        folder: "social_media/post_images",
        fileName,
      })) as { filePath: string };

      const url = imagekit.url({
        path: response.filePath,
        transformation: [{ quality: "auto" }, { format: "webp" }, { width: 512 }],
      });
      post.images.push(url);
    }

    // Upload multiple images
    if (images && images.length > 1) {
      for (const image of images) {
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Generate file name: original name + _ + random 6 digits + _ + timestamp (ms)
        const randomDigits = Math.floor(100000 + Math.random() * 900000);
        const timestamp = Date.now(); // milliseconds
        const fileName = `${image.name}_${randomDigits}_${timestamp}`;

        const response = (await imagekit.upload({
          file: buffer,
          folder: "social_media/post_images",
          fileName,
        })) as { filePath: string };

        const url = imagekit.url({
          path: response.filePath,
          transformation: [{ quality: "auto" }, { format: "webp" }, { width: 1080 }],
        });
        post.images.push(url);
      }
    }

    await post.save();
    revalidatePath("/");
    return { success: true, message: "Post created successfully!" };
  } catch (err) {
    console.error("Error creating post:", err);
    const message = err instanceof Error ? err.message : "An unknown error occurred.";
    throw new Error(message);
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
      for (const post of posts as unknown as IFetchedPost[]) {
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

        post.commentsCount = await Comment.countDocuments({ post: post._id });
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
  try {
    await connectDB();
    const user = await getUserByClerkId();
    const post: any = await Post.findById(postId).populate("user", "name username clerkId profilePic").lean();

    if (!post) return null;

    if (user) {
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

      post.commentsCount = await Comment.countDocuments({ post: post._id });
    } else {
      post.vote = "unauthenticated";
      post.isSaved = "unauthenticated";
    }

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
export async function updatePostVisibility(postId: string, visibility: string) {
  try {
    const user = getUserByClerkId();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const post = (await Post.findById(postId)) as IPost;
    if (!post) {
      throw new Error("Post not found");
    }

    if (visibility.toLowerCase() === "public") {
      post.visibility = "public";
    } else {
      post.visibility = "private";
    }

    await post.save();
    revalidatePath("/");
    return { success: true, message: "visibility updated successfully!" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "An unknown error occurred.";
    throw new Error(message);
  }
}
export async function getUserPosts(userId: string) {
  try {
    await connectDB();
    const user = await getUserByClerkId();

    const posts = await Post.find({ user: userId, visibility: "public" })
      .sort({ createdAt: -1 })
      .populate("user", "name username clerkId profilePic")
      .lean();

    if (user) {
      for (const post of posts as unknown as IFetchedPost[]) {
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

        post.commentsCount = await Comment.countDocuments({ post: post._id });
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
export async function getSavedPosts() {
  try {
    await connectDB();
    const user: IUser = await getUserByClerkId();

    const savedPosts = await SavedPost.find({ user: user._id })
      .populate({ path: "post", populate: { path: "user", select: "name username clerkId profilePic" } })
      .sort({ createdAt: -1 })
      .lean();

    const posts = savedPosts.map((saved) => saved.post);
    console.log(posts);

    if (user) {
      for (const post of posts as unknown as IFetchedPost[]) {
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

        post.commentsCount = await Comment.countDocuments({ post: post._id });
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
export async function getPrivatePosts() {
  try {
    await connectDB();
    const user: IUser = await getUserByClerkId();

    const posts = await Post.find({ user: user._id, visibility: "private" })
      .sort({ createdAt: -1 })
      .populate("user", "name username clerkId profilePic")
      .lean();

    if (user) {
      for (const post of posts as unknown as IFetchedPost[]) {
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

        post.commentsCount = await Comment.countDocuments({ post: post._id });
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

// * Vote handling functions
export async function giveUpvote(postId: string) {
  try {
    await connectDB();
    const user = await getUserByClerkId();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const post: IPost | null = await Post.findById(postId);

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

// * SavedPost handling functions
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

    const isAlreadySaved: ISavedPost | null = await SavedPost.findOne({
      post: post._id,
      user: user._id,
    });

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

    const savedPost: ISavedPost | null = await SavedPost.findOne({
      post: post._id,
      user: user._id,
    });

    return JSON.parse(JSON.stringify(savedPost));
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "An unknown error occurred.";
    throw new Error(message);
  }
}

// * Comment handling functions
export async function getComments(postId: string): Promise<IComment[]> {
  try {
    await connectDB();
    const comments = await Comment.find({ post: postId, type: "comment" })
      .sort({ createdAt: -1 })
      .populate("user")
      .lean();
    return JSON.parse(JSON.stringify(comments));
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "An unknown error occurred.";
    throw new Error(message);
  }
}
export async function addComment(postId: string, comment: string) {
  console.log(comment);
  console.log(postId);
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

    if (!comment.trim()) {
      throw new Error("Comment cannot be empty");
    }

    if (comment.length > 500) {
      throw new Error("Comment cannot be longer than 500 characters");
    }

    const senitizedComment = xss(comment);

    await new Comment({ post: post._id, user: user._id, content: senitizedComment }).save();

    revalidatePath("/");

    return { success: true };
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "An unknown error occurred.";
    throw new Error(message);
  }
}
export async function editComment(commentId: string, commentContent: string) {
  try {
    await connectDB();
    const user: IUser = await getUserByClerkId();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const comment: IComment | null = await Comment.findById(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    const userId = user._id as string;
    if (comment.user.toString() !== userId.toString()) {
      throw new Error("Unauthorized");
    }

    if (commentContent.trim() === comment.content.trim()) return;

    if (!commentContent.trim()) {
      throw Error("Comment cannot be empty");
    }

    if (commentContent.length > 500) {
      throw new Error("Comment cannot be longer than 500 characters");
    }

    comment.content = xss(commentContent.trim());
    comment.isEdited = true;

    await comment.save();
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "An unknown error occurred.";
    throw new Error(message);
  }
}
export async function deleteComment(commentId: string) {
  try {
    await connectDB();
    const user: IUser = await getUserByClerkId();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const comment: IComment | null = await Comment.findById(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    await Comment.findByIdAndDelete(commentId);

    revalidatePath("/");

    return { success: true };
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "An unknown error occurred.";
    throw new Error(message);
  }
}