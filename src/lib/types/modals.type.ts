import { Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  username: string | null;
  email: string;
  name: string | null;
  gender: string;
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
  user: IUser;
  content: string;
  location: string | null;
  images: string[];
  commentsCount: number;
  votesCount: number;
  visibility: "public" | "private";
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment extends Document {
  user: ObjectId;
  post: ObjectId;
  content: string;
  type: string;
  parentComment: ObjectId | null;
  repliesCount: number;
  isEdited: boolean;
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

export interface IVote extends Document {
  post: ObjectId;
  user: ObjectId;
  value: number; // 1 for upvote, -1 for downvote
  createdAt: Date;
  updatedAt: Date;
}

export interface IFetchedPost extends IPost {
  vote: number | "unauthenticated";
  isSaved: boolean | "unauthenticated";
}

export interface IFetchedComment extends Omit<IComment, "user"> {
  user: {
    clerkId: string;
    username: string | null;
    email: string;
    name: string | null;
    profilePic: string;
  };
}
