"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, ReactElement } from "react";
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Smile,
  MapPin,
  Send,
} from "lucide-react";
import { IPost } from "@/lib/types/modals.type";
import { formatDistanceToNowStrict } from "date-fns";

// Dummy data based on the models
const dummyUsers = [
  {
    _id: "user1",
    clerkId: "clerk_user1",
    username: "john_doe",
    email: "john@example.com",
    name: "John Doe",
    gender: "male",
    bio: "Passionate photographer and nature lover 📸",
    status: "Hey there!",
    profilePic: "https://i.pravatar.cc/150?u=john",
    bannerPic: "https://picsum.photos/id/1047/1200/400",
    followersCount: 1234,
    followingCount: 567,
    postsCount: 89,
    savedPostsCount: 42,
    notificationsCount: 5,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-12-01"),
  },
  {
    _id: "user2",
    clerkId: "clerk_user2",
    username: "jane_smith",
    email: "jane@example.com",
    name: "Jane Smith",
    gender: "female",
    bio: "Adventure seeker and coffee enthusiast ☕",
    status: "Living life to the fullest!",
    profilePic: "https://i.pravatar.cc/150?u=jane",
    bannerPic: "https://picsum.photos/id/1048/1200/400",
    followersCount: 856,
    followingCount: 234,
    postsCount: 45,
    savedPostsCount: 23,
    notificationsCount: 2,
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-11-28"),
  },
  {
    _id: "user3",
    clerkId: "clerk_user3",
    username: "mike_wilson",
    email: "mike@example.com",
    name: "Mike Wilson",
    gender: "male",
    bio: "Tech geek and fitness enthusiast 💪",
    status: "Coding and lifting!",
    profilePic: "https://i.pravatar.cc/150?u=mike",
    bannerPic: "https://picsum.photos/id/1049/1200/400",
    followersCount: 2100,
    followingCount: 890,
    postsCount: 156,
    savedPostsCount: 67,
    notificationsCount: 12,
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-12-02"),
  },
];

const dummyComments = [
  {
    _id: "comment1",
    user: dummyUsers[1],
    post: "post1",
    content: "This is absolutely stunning! Where was this taken?",
    type: "comment",
    parentComment: null,
    createdAt: new Date("2024-12-01T10:30:00"),
    updatedAt: new Date("2024-12-01T10:30:00"),
  },
  {
    _id: "comment2",
    user: dummyUsers[2],
    post: "post1",
    content: "Love the composition and colors! 🔥",
    type: "comment",
    parentComment: null,
    createdAt: new Date("2024-12-01T11:15:00"),
    updatedAt: new Date("2024-12-01T11:15:00"),
  },
  {
    _id: "comment3",
    user: dummyUsers[0],
    post: "post1",
    content: "Thanks everyone! This was taken at the Grand Canyon.",
    type: "comment",
    parentComment: "comment1",
    createdAt: new Date("2024-12-01T12:00:00"),
    updatedAt: new Date("2024-12-01T12:00:00"),
  },
  {
    _id: "comment4",
    user: dummyUsers[1],
    post: "post1",
    content: "Amazing! I've always wanted to visit there.",
    type: "reply",
    parentComment: "comment3",
    createdAt: new Date("2024-12-01T12:30:00"),
    updatedAt: new Date("2024-12-01T12:30:00"),
  },
];

interface SinglePostModalProps {
  post: IPost;
  onClose: () => void;
  initialImageIndex?: number;
}

export default function SinglePostModal({
  post,
  onClose,
  initialImageIndex = 0,
}: SinglePostModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialImageIndex);
  const [newComment, setNewComment] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const commentsContainerRef = useRef<HTMLDivElement>(null);

  // Use dummy user data for the post
  const postUser = dummyUsers[0]; // Assuming the post is by the first user

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  console.log("post", post);

  const handlePrevImage = () => {
    if (!post.images) return;
    console.log("prev");
    setCurrentImageIndex((prev) => (prev === 0 ? post.images!.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (!post.images) return;
    console.log("next");
    setCurrentImageIndex((prev) => (prev === post.images!.length - 1 ? 0 : prev + 1));
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageLoadStart = () => {
    setIsImageLoading(true);
    // Auto-hide loading after 2 seconds if image doesn't load
    setTimeout(() => {
      setIsImageLoading(false);
    }, 2000);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value);
  };

  const handlePostComment = () => {
    // In a real application, you would send this comment to a backend
    console.log("Posting comment:", newComment);
    setNewComment("");
    // Scroll to the bottom after posting a comment
    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const imageElementList: ReactElement[] = post.images.map((image, index) => (
    <Image
      key={index}
      src={image}
      alt={`Post Image ${index + 1}`}
      fill
      className="object-contain"
      sizes="(max-width: 768px) 100vw, 50vw"
      quality={20}
      decoding="async"
      loading="eager"
    />
  ));

  console.log("imageElementList", imageElementList);

  return (
    <div className="modal modal-open">
      <div
        className={`modal-box p-0 relative ${isMobile ? "h-full max-w-full rounded-none" : "max-w-4xl h-[90vh]"}`}
      >
        <button
          type="button"
          title="Close Modal"
          className="btn btn-sm btn-circle absolute right-2 top-2 z-10 bg-base-100/80"
          onClick={onClose}
        >
          <X size={16} />
        </button>

        <div className={`flex ${isMobile ? "flex-col" : "h-full"}`}>
          {/* Image Section */}
          <div
            className={`relative bg-black flex items-center justify-center ${isMobile ? "h-80" : "w-1/2"}`}
          >
            {/* Loading overlay */}
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                <div className="loading loading-spinner loading-lg text-white"></div>
              </div>
            )}

            {imageElementList.map((imageElement, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                {imageElement}
              </div>
            ))}

            {/* Navigation Arrows */}
            {post.images.length > 1 && (
              <>
                <button
                  title="Previous Image"
                  type="button"
                  className="btn btn-circle absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-base-100/80 border-0"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  title="Next Image"
                  type="button"
                  className="btn btn-circle absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-base-100/80 border-0"
                  onClick={handleNextImage}
                >
                  <ChevronRight size={20} />
                </button>

                {/* Image Counter */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
                  {currentImageIndex + 1} / {post.images.length}
                </div>
              </>
            )}
          </div>

          {/* Content Section */}
          <div className={`flex flex-col ${isMobile ? "" : "w-1/2 h-full"}`}>
            {/* User Info */}
            <div className="flex items-center p-4 border-b border-base-300">
              <div className="avatar mr-3">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={postUser.profilePic || "/user/default/user.jpg"}
                    alt={postUser.username}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
              </div>
              <Link
                href={`/profile/${postUser.username}`}
                className="font-semibold text-sm hover:underline"
              >
                {postUser.username}
              </Link>
              {post.location && (
                <div className="flex items-center ml-2 text-xs text-gray-500">
                  <MapPin size={12} className="mr-1" />
                  {post.location}
                </div>
              )}
              <div className="flex-grow"></div>
              <button type="button" title="More Options" className="btn btn-ghost btn-sm">
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Post Caption - Fixed above comments */}
            <div className="p-4 border-b border-base-300">
              <div className="flex">
                <div className="avatar mr-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={postUser.profilePic || "/user/default/user.jpg"}
                      alt={postUser.username}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-1">
                    <span className="font-semibold text-sm mr-2">{postUser.username}</span>
                    <span className="text-sm">{post.content}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNowStrict(post.createdAt, { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>

            {/* Comments Section - Scrollable */}
            <div className="flex-grow overflow-y-auto p-4" ref={commentsContainerRef}>
              <h3 className="font-semibold mb-4">Comments ({dummyComments.length})</h3>
              {dummyComments.map((comment) => (
                <div key={comment._id} className="flex mb-4 p-3 bg-base-200 rounded-lg">
                  <div className="avatar mr-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={comment.user.profilePic}
                        alt={comment.user.name}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className="font-semibold text-sm mr-2">{comment.user.username}</span>
                      <span className="text-sm">{comment.content}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNowStrict(comment.createdAt, { addSuffix: true })}
                    </p>

                    <div className="flex items-center mt-1 space-x-3">
                      <button className="text-xs text-gray-500">Like</button>
                      <button className="text-xs text-gray-500">Reply</button>
                    </div>
                  </div>
                  <button
                    type="button"
                    title="Like this comment"
                    className="btn btn-ghost btn-sm p-0 hover:bg-transparent self-start"
                  >
                    <Heart size={14} />
                  </button>
                </div>
              ))}
              <div ref={commentsEndRef} />
            </div>

            {/* Actions - Fixed at bottom */}
            <div className="p-4 border-t border-base-300">
              <div className="flex justify-between items-center mb-3">
                <div className="flex space-x-4">
                  <button
                    type="button"
                    title="Like this post"
                    className="btn btn-ghost btn-sm p-0 hover:bg-transparent"
                  >
                    <Heart size={24} />
                  </button>
                  <button
                    type="button"
                    title="Comment on this post"
                    className="btn btn-ghost btn-sm p-0 hover:bg-transparent"
                  >
                    <MessageCircle size={24} />
                  </button>
                  <button
                    type="button"
                    title="Share this post"
                    className="btn btn-ghost btn-sm p-0 hover:bg-transparent"
                  >
                    <Share size={24} />
                  </button>
                </div>
                <button
                  type="button"
                  title="Save this post"
                  className="btn btn-ghost btn-sm p-0 hover:bg-transparent"
                >
                  <Bookmark size={24} />
                </button>
              </div>

              <p className="text-sm font-semibold mb-2">{post.votesCount} likes</p>
              <p className="text-xs text-gray-400 uppercase">
                {formatDistanceToNowStrict(post.createdAt, { addSuffix: true })}
              </p>
            </div>

            {/* Add Comment - Fixed at bottom */}
            <div className="p-3 border-t border-base-300">
              <div className="flex items-center">
                <Smile size={20} className="text-gray-500 mr-2" />
                <input
                  type="text"
                  className="input input-ghost input-sm w-full focus:outline-none"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={handleCommentChange}
                  onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
                />
                <button
                  type="button"
                  title="Post Comment"
                  className={`btn btn-ghost btn-sm ${newComment ? "text-primary" : "text-blue-200"}`}
                  onClick={handlePostComment}
                  disabled={!newComment}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
