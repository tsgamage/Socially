"use server";

import { connectDB } from "@/lib/db/db.config";
import Follow from "@/lib/db/models/follow.model";
import Notification from "@/lib/db/models/notification.modal";
import Post from "@/lib/db/models/post.model";
import User from "@/lib/db/models/user.model";
import {
  IFetchedFollow,
  IFetchedFollowRequest,
  IFetchedSuggestedFriends,
  IFollow,
  IFollowRequest,
  IUser,
} from "@/lib/types/modals.type";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "./util.action";
import FollowRequest from "@/lib/db/models/followRequests.modal";
import { revalidatePath } from "next/cache";

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
export async function getSuggestedFriends(): Promise<IFetchedSuggestedFriends[]> {
  try {
    const user: IUser = await getUserByClerkId();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const alreadyFollowedUsers: IFollow[] = await Follow.find({ follower: user._id }).select(["following", "-_id"]);
    const alreadyFollowingUsers: IFollow[] = await Follow.find({ following: user._id }).select(["follower", "-_id"]);

    const requestSendedUsers: IFollowRequest[] = await FollowRequest.find({ sender: user._id }).select([
      "receiver",
      "-_id",
    ]);
    const requestIncomingUsers: IFollowRequest[] = await FollowRequest.find({ receiver: user._id }).select([
      "sender",
      "-_id",
    ]);

    const alreadyFollowedUsersIds = alreadyFollowedUsers.map((m: IFollow) => m.following);
    const alreadyFollowingUsersIds = alreadyFollowingUsers.map((m: IFollow) => m.follower);
    const alreadySendedUserIds = requestSendedUsers.map((m: IFollowRequest) => m.receiver);
    const requestIncomingUsersIds = requestIncomingUsers.map((m: IFollowRequest) => m.sender);

    const friends: IUser[] = await User.find({
      _id: {
        $nin: [
          user._id,
          ...alreadySendedUserIds,
          ...requestIncomingUsersIds,
          ...alreadyFollowedUsersIds,
          ...alreadyFollowingUsersIds,
        ],
      },
    })
      .limit(10)
      .select(["name", "username", "followersCount", "profilePic"]);

    return JSON.parse(JSON.stringify(friends));
  } catch (err) {
    console.error("Error in getSuggestedFriends:", err);
    throw new Error("Error in getSuggestedFriends");
  }
}
export async function getAllFriends(): Promise<IFetchedFollow[]> {
  try {
    const user: IUser = await getUserByClerkId();
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Users that current user follows
    const followed: IFetchedFollow[] = (await Follow.find({ follower: user._id }).populate([
      "follower",
      "following",
    ])) as IFetchedFollow[];
    // Users that follow current user
    const following: IFetchedFollow[] = (await Follow.find({ following: user._id }).populate([
      "follower",
      "following",
    ])) as IFetchedFollow[];

    const followedCopy = followed.map((m) => m.toObject());
    const followingCopy = following.map((m) => m.toObject());

    // Merge both lists but avoid duplicates when the relationship is mutual.
    // For mutual relationships, prefer the entry where the current user is the follower
    // so the UI shows the "UnFollow" state instead of "Follow Back".
    const mergedByOtherUserId = new Map<string, IFetchedFollow>();

    // First, store entries where current user is the follower (preferred for mutuals)
    for (const f of followedCopy) {
      const otherUserId = String((f as IFetchedFollow).following._id);
      // mark as not yet known if mutual; we'll set true when we detect reverse link
      (f as IFetchedFollow).isMutual = false;
      mergedByOtherUserId.set(otherUserId, f as IFetchedFollow);
    }

    // Then, add entries where other users follow current user if not already present
    for (const f of followingCopy) {
      const otherUserId = String((f as IFetchedFollow).follower._id);
      if (!mergedByOtherUserId.has(otherUserId)) {
        // one-way follower only
        (f as IFetchedFollow).isMutual = false;
        mergedByOtherUserId.set(otherUserId, f as IFetchedFollow);
      } else {
        // reverse relationship exists → mutual follow
        const existing = mergedByOtherUserId.get(otherUserId)!;
        existing.isMutual = true;
      }
    }

    const uniqueFriends = Array.from(mergedByOtherUserId.values());
    return JSON.parse(JSON.stringify(uniqueFriends));
  } catch (err) {
    console.error("Error in getAllFriends:", err);
    throw new Error("Error in getAllFriends");
  }
}
export async function getFriendRequests(): Promise<IFetchedFollowRequest[]> {
  try {
    const user: IUser = await getUserByClerkId();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const sendedRequests: IFetchedFollowRequest[] = await FollowRequest.find({ sender: user._id })
      .populate("sender")
      .populate("receiver");
    const receivedRequests: IFetchedFollowRequest[] = await FollowRequest.find({ receiver: user._id })
      .populate("sender")
      .populate("receiver");

    return JSON.parse(JSON.stringify([...sendedRequests, ...receivedRequests]));
  } catch (err) {
    console.error("Error in getFriendRequests:", err);
    throw new Error("Error in getFriendRequests");
  }
}
export async function toggleUserFollowRequestById(followerId: string) {
  try {
    const user: IUser = await getUserByClerkId();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const followingUser: IUser[] = await User.find({ _id: followerId });
    if (!followingUser) {
      throw new Error("User not found");
    }

    let response = { success: false, message: "Something happened while sending or deleting request" } as {
      success: boolean;
      message: string;
    };

    const otherUserAlreadyFollowed = await Follow.findOne({ follower: followerId, following: user._id });

    if (otherUserAlreadyFollowed) {
      const newFollowing: IFollow = new Follow({
        follower: user._id,
        following: followerId,
      });

      await newFollowing.save();
    } else {
      const alreadySended: IUser | null = await FollowRequest.findOne({ sender: user._id, receiver: followerId });

      if (alreadySended) {
        await FollowRequest.findByIdAndDelete(alreadySended._id);
        response = { success: true, message: "Friend request deleted" };
      } else {
        const followReq: IFollowRequest = new FollowRequest({
          sender: user._id,
          receiver: followerId,
          status: "pending",
        });
        await followReq.save();
        response = { success: true, message: "Friend request sended" };
      }
    }

    revalidatePath("/friends");
    return response;
  } catch (err) {
    console.error("Error in followUser:", err);
    throw new Error("Error in followUser");
  }
}
export async function unfollowUserById(followId: string) {
  try {
    const user: IUser = await getUserByClerkId();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const userFollow = await Follow.findById(followId);
    if (!userFollow) {
      throw new Error("No any Follow data found");
    }

    await Follow.findByIdAndDelete(followId);

    return { success: true };
  } catch (err) {
    console.error("Error in acceptFriendRequest:", err);
    throw new Error("Error in acceptFriendRequest");
  }
}
export async function acceptFriendRequest(requestId: string) {
  try {
    const user: IUser = await getUserByClerkId();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const request = (await FollowRequest.findById(requestId)) as IFollowRequest;
    if (!request) {
      throw new Error("No any request found");
    }

    await FollowRequest.findByIdAndDelete(requestId);

    const newFollowing: IFollow = new Follow({
      follower: request.sender,
      following: request.receiver,
    });

    await newFollowing.save();

    return { success: true };
  } catch (err) {
    console.error("Error in acceptFriendRequest:", err);
    throw new Error("Error in acceptFriendRequest");
  }
}

export async function sendFriendRequestByUsername(username: string) {
  let response = { success: false, message: "Something happened while sending or deleting request" } as {
    success: boolean;
    message: string;
  };
  try {
    username = username.trim();

    const user: IUser = await getUserByClerkId();

    if (!user) {
      throw new Error("Unauthorized");
    }

    if (!username.trim()) {
      throw new Error("Please enter a valid username");
    }

    if (username === user.username) {
      throw new Error("You can't send request to yourself");
    }

    const followingUser: IUser | null = await User.findOne({ username: username });
    if (!followingUser) {
      throw new Error("User not found");
    }

    const alreadyFriends: IFollow | null = await Follow.findOne({ follower: user._id, following: followingUser._id });
    if (alreadyFriends) {
      throw new Error("You both are already friends");
    }

    const alreadySended: IUser | null = await FollowRequest.findOne({ sender: user._id, receiver: followingUser._id });
    if (alreadySended) {
      if (!followingUser) {
        throw new Error("Already sended!");
      }
    }

    const otherUserAlreadyFollowed = await Follow.findOne({ follower: followingUser._id, following: user._id });

    if (otherUserAlreadyFollowed) {
      const newFollowing: IFollow = new Follow({
        follower: user._id,
        following: followingUser._id,
      });
      await newFollowing.save();
      response = { success: true, message: "Oh Yeah! You both are now friends" };
    } else {
      const followReq: IFollowRequest = new FollowRequest({
        sender: user._id,
        receiver: followingUser._id,
      });
      await followReq.save();
      response = { success: true, message: "Friend request sended" };
    }

    revalidatePath("/friends");
    return response;
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "An unknown error occurred.";
    throw new Error(message);
  }
}
