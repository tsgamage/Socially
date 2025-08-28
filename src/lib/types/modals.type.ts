import { Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  username: string | null;
  email: string;
  name: string | null;
  bio: string | null;
  status: string | null;
  profilePic: string;
  bannerPic: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  savedPostsCount: number;
  notificationsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPost extends Document {
  user: ObjectId;
  content: string;
  images: string[];
  votes: {
    upvotes: ObjectId[];
    downvotes: ObjectId[];
    voteCount: number;
  };
  commentsCount: number;
  votesCount: number;
  visibility: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment extends Document {
  user: ObjectId;
  post: ObjectId;
  content: string;
  type: string;
  parentComment: ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFollowRequest extends Document {
  sender: ObjectId;
  receiver: ObjectId;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotification extends Document {
  user: ObjectId;
  sender: ObjectId | null;
  type: string;
  post: ObjectId | null;
  comment: ObjectId | null;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISavedPost extends Document {
  user: ObjectId;
  post: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFollow extends Document {
  follower: ObjectId;
  following: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
