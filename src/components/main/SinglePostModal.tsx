"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Bookmark,
  X,
  ChevronLeft,
  ChevronRight,
  Smile,
  MapPin,
  Send,
  ArrowBigUpDash,
  ArrowBigDownDash,
  MessageSquareMore,
  MessageSquareOff,
} from "lucide-react";
import { IPost } from "@/lib/types/modals.type";
import { formatDistanceToNowStrict } from "date-fns";

/** Dummy placeholders — keep or replace with real data wiring as needed */
const dummyUsers = [
  {
    _id: "user1",
    username: "john_doe",
    name: "John Doe",
    profilePic: "https://i.pravatar.cc/150?u=john",
  },
];

const dummyComments = [
  {
    _id: "comment1",
    user: dummyUsers[0],
    content: "This is absolutely stunning! Where was this taken?",
    createdAt: new Date("2024-12-01T10:30:00"),
  },
  {
    _id: "comment2",
    user: dummyUsers[0],
    content: "Love the composition and colors! 🔥",
    createdAt: new Date("2024-12-01T11:15:00"),
  },
  {
    _id: "comment3",
    user: dummyUsers[0],
    content: "Thanks everyone! This was taken at the Grand Canyon.",
    createdAt: new Date("2024-12-01T12:00:00"),
  },
  {
    _id: "comment3",
    user: dummyUsers[0],
    content: "Thanks everyone! This was taken at the Grand Canyon.",
    createdAt: new Date("2024-12-01T12:00:00"),
  },
  {
    _id: "comment3",
    user: dummyUsers[0],
    content: "Thanks everyone! This was taken at the Grand Canyon.",
    createdAt: new Date("2024-12-01T12:00:00"),
  },
  {
    _id: "comment3",
    user: dummyUsers[0],
    content: "Thanks everyone! This was taken at the Grand Canyon.",
    createdAt: new Date("2024-12-01T12:00:00"),
  },
  {
    _id: "comment3",
    user: dummyUsers[0],
    content: "Thanks everyone! This was taken at the Grand Canyon.",
    createdAt: new Date("2024-12-01T12:00:00"),
  },
  {
    _id: "comment3",
    user: dummyUsers[0],
    content: "Thanks everyone! This was taken at the Grand Canyon.",
    createdAt: new Date("2024-12-01T12:00:00"),
  },
  {
    _id: "comment3",
    user: dummyUsers[0],
    content: "Thanks everyone! This was taken at the Grand Canyon.",
    createdAt: new Date("2024-12-01T12:00:00"),
  },
  {
    _id: "comment3",
    user: dummyUsers[0],
    content: "Thanks everyone! This was taken at the Grand Canyon.",
    createdAt: new Date("2024-12-01T12:00:00"),
  },
  {
    _id: "comment3",
    user: dummyUsers[0],
    content: "Thanks everyone! This was taken at the Grand Canyon.",
    createdAt: new Date("2024-12-01T12:00:00"),
  },
];

interface SinglePostModalProps {
  post: IPost;
  onClose: () => void;
  showCommens?: boolean;
  initialImageIndex?: number;
}

export default function SinglePostModal({
  post,
  onClose,
  showCommens,
  initialImageIndex = 0,
}: SinglePostModalProps) {
  const images = post.images ?? [];
  const [currentImageIndex, setCurrentImageIndex] = useState(initialImageIndex);
  const [newComment, setNewComment] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const postUser = dummyUsers[0];
  const [showCommentSection, setShowCommentSection] = useState(showCommens || false);

  // Prevent body scrolling while modal is open (important for mobile).
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Detect mobile breakpoint
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // keep index valid if images change
  useEffect(() => {
    setCurrentImageIndex((i) => Math.min(Math.max(i, 0), Math.max(images.length - 1, 0)));
  }, [images.length]);

  const handlePrevImage = useCallback(() => {
    if (!images.length) return;
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNextImage = useCallback(() => {
    if (!images.length) return;
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handlePostComment = () => {
    // wire to backend as needed
    setNewComment("");
    setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  return (
    <div className="modal modal-open">
      {/* Modal box: overflow-hidden so internal layout controls scroll behavior */}
      <div
        className={`modal-box p-0 relative overflow-hidden ${
          isMobile ? "max-w-full rounded-none min-h-auto max-h-11/12 h-auto" : "max-w-5xl h-[90vh]"
        } flex flex-col`}
      >
        {/* Close */}
        <button
          type="button"
          title="Close Modal"
          className="btn btn-sm btn-circle absolute right-2 top-2 z-40 bg-base-100/80"
          onClick={onClose}
        >
          <X size={16} />
        </button>

        {/* Main flex container: prevent outer overflow so only comments scroll */}
        <div className={`flex flex-1 overflow-hidden ${isMobile ? "flex-col" : "h-full"}`}>
          {/* IMAGE SECTION */}
          {(!isMobile || !showCommentSection) && post.images.length > 0 && (
            <div
              className={`relative bg-black flex items-center justify-center ${
                isMobile ? "h-80 flex-shrink-0" : "w-1/2 flex-shrink-0"
              }`}
            >
              {images.length > 0 && (
                <div className="relative w-full h-full">
                  {/* using key to force remount when src changes (avoids stuck image) */}
                  <Image
                    key={images[currentImageIndex]}
                    src={images[currentImageIndex]}
                    alt={`Post image ${currentImageIndex + 1}`}
                    fill
                    draggable={false}
                    className="object-contain select-none"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        title="Previous Image"
                        className="btn btn-circle absolute left-2 top-1/2 -translate-y-1/2 z-40 bg-base-100/30 hover:bg-base-100 border-0"
                        onClick={handlePrevImage}
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <button
                        type="button"
                        title="Next Image"
                        className="btn btn-circle absolute right-2 top-1/2 -translate-y-1/2 z-40 bg-base-100/30 hover:bg-base-100 border-0"
                        onClick={handleNextImage}
                      >
                        <ChevronRight size={20} />
                      </button>

                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-30">
                        {images.map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${i === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* CONTENT SECTION (flex column). On mobile: flex-1 h-0 overflow-hidden so comments container is solely scrollable */}
          <div
            className={`flex flex-col ${isMobile ? "flex-1 h-0 overflow-hidden" : `${post.images.length > 0 ? "w-1/2" : "w-full"} h-full`}`}
          >
            {/* Header (pinned) */}
            <div className="flex items-center p-4 border-b border-base-300 flex-shrink-0">
              <div className="avatar mr-3">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={postUser.profilePic}
                    alt={postUser.username}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Link
                  href={`/profile/${postUser.username}`}
                  className="font-semibold text-sm hover:underline"
                >
                  {postUser.username}
                </Link>

                <div className="flex items-center gap-2">
                  {post.location && (
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin size={12} className="mr-1" />
                      Ratmalana
                      {post.location}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 ">
                    {formatDistanceToNowStrict(post.createdAt, { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>

            {/* Caption (pinned) */}
            {(!isMobile || !showCommentSection) && (
              <div className="p-4 flex-shrink-0">
                <span className="text-sm">{post.content}</span>
              </div>
            )}

            {/* COMMENTS: the only scrollable area */}
            {(!isMobile || showCommentSection) && (
              <div className="flex-1 min-h-0 overflow-y-auto p-4">
                <h3 className="font-semibold mb-4">Comments ({dummyComments.length})</h3>

                {dummyComments.map((c) => (
                  <div key={c._id} className="flex mb-4 p-3 bg-base-200 rounded-lg">
                    <div className="avatar mr-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <Image
                          src={c.user.profilePic}
                          alt={c.user.name}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col  mb-1">
                        <span className="font-semibold text-sm mr-2">{c.user.username}</span>
                        <span className="text-sm">{c.content}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNowStrict(c.createdAt, { addSuffix: true })}
                      </p>
                    </div>

                    {/* <button className="btn btn-ghost btn-sm p-0 hover:bg-transparent self-start">
                    <Heart size={14} />
                  </button> */}
                  </div>
                ))}

                <div ref={commentsEndRef} />
              </div>
            )}

            {/* Add Comment (pinned) */}
            <div className="p-3 border-b border-base-300 flex-shrink-0">
              <div className="flex items-center">
                <Smile size={20} className="text-gray-500 mr-2" />
                <input
                  type="text"
                  className="input input-ghost input-md w-full focus:outline-none"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
                />
                <button
                  type="button"
                  data-tip="Post Comment"
                  title="Post Comment"
                  className="cursor-pointer tooltip tooltip-left tooltip-info btn btn-circle btn-sm "
                  onClick={handlePostComment}
                  disabled={!newComment}
                >
                  <Send size={16} className="cursor-pointer" />
                </button>
              </div>
            </div>

            {/* Actions (pinned) */}
            <div className="p-3">
              <div className="flex justify-between items-center mb-2 ">
                <div className="flex space-x-4">
                  <div className="flex items-center justify-between w-auto space-x-2 bg-gray-900/70  rounded-full ">
                    <div className="tooltip" data-tip="Upvote">
                      <button
                        title="Give a Upvote"
                        type="button"
                        className="cursor-pointer flex items-center gap-1 hover:bg-gray-800 w-full h-full rounded-l-full p-2 "
                      >
                        <ArrowBigUpDash size={24} />
                        <p className="text-sm font-semibold mb-1">{post.votesCount}</p>
                      </button>
                    </div>
                    <div className="tooltip" data-tip="Downvote">
                      <button
                        title="Give a Downvote"
                        type="button"
                        className="cursor-pointer flex items-center gap-1 hover:bg-gray-800 w-full h-full rounded-r-full p-2 "
                      >
                        <ArrowBigDownDash scale={24} />
                      </button>
                    </div>
                  </div>
                  <div
                    className="tooltip"
                    data-tip={showCommentSection ? "Hide Comments" : "Show Comments"}
                  >
                    {isMobile && (
                      <button
                        title={showCommentSection ? "Hide Comments" : "Show Comments"}
                        type="button"
                        className="flex items-center gap-2 bg-gray-900/70 p-2 rounded-full hover:bg-gray-800 cursor-pointer"
                        onClick={() => setShowCommentSection((preValue) => !preValue)}
                      >
                        {showCommentSection ? (
                          <MessageSquareOff size={24} />
                        ) : (
                          <MessageSquareMore size={24} />
                        )}

                        {post && post.commentsCount > 0 && (
                          <p className="text-sm font-semibold mb-1">{post.commentsCount}</p>
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <div className="tooltip" data-tip="Save Post">
                  <button
                    title="Bookmark Button"
                    type="button"
                    className="bg-gray-900/70 p-2 rounded-full hover:bg-gray-800 cursor-pointer"
                  >
                    <Bookmark size={24} />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions (pinned) */}
          </div>
        </div>
      </div>
    </div>
  );
}
