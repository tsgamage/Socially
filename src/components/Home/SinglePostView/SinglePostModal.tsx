"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import ImageSection from "./ImageSection";
import { useMediaQuery } from "react-responsive";
import Header from "./Header";
import PostContent from "./PostContent";
import Comments from "./Comments";
import AddComment from "./AddComment";
import Actions from "./Actions";
import { useQuery } from "@tanstack/react-query";
import { getPostById } from "@/actions/post.actions";

interface SinglePostModalProps {
  postId: string;
  onClose: () => void;
  showCommens?: boolean;
  initialImageIndex?: number;
}

export default function SinglePostModal({ postId, onClose, showCommens, initialImageIndex = 0 }: SinglePostModalProps) {
  const [showCommentSection, setShowCommentSection] = useState(showCommens || false);

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const postedCommentRef = useRef<HTMLDivElement>(null);

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostById(postId),
  });

  // Prevent body scrolling while modal is open (important for mobile).
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (isLoading || !post) return null;

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
            <ImageSection post={post} initialImageIndex={initialImageIndex} isMobile={isMobile} />
          )}

          {/* CONTENT SECTION (flex column). On mobile: flex-1 h-0 overflow-hidden so comments container is solely scrollable */}
          <div
            className={`flex flex-col ${isMobile ? "flex-1 h-0 overflow-hidden" : `${post.images.length > 0 ? "w-1/2" : "w-full"} h-full`}`}
          >
            {/* Header (pinned) */}
            <Header post={post} />

            {/* Caption (pinned) */}
            {(!isMobile || !showCommentSection) && <PostContent postContent={post.content} />}

            {/* COMMENTS: the only scrollable area */}
            {(!isMobile || showCommentSection) && (
              <Comments post={post} ref={postedCommentRef as React.RefObject<HTMLDivElement>} />
            )}

            {/* Add Comment (pinned) */}
            <AddComment post={post} postedCommentRef={postedCommentRef as React.RefObject<HTMLDivElement>} />

            {/* Actions (pinned) */}
            <Actions
              showCommens={showCommentSection}
              post={post}
              isMobile={isMobile}
              onToggleComments={() => setShowCommentSection((preValue) => !preValue)}
            />

            {/* Actions (pinned) */}
          </div>
        </div>
      </div>
    </div>
  );
}
