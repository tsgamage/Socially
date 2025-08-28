import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface SinglePostModalProps {
  post: {
    id: string;
    user: {
      name: string;
      username: string;
      avatar: string;
    };
    date: string;
    content: string;
    images: string[];
    likes: number;
    comments: number;
  };
  onClose: () => void;
}

const dummyComments = [
  {
    user: {
      name: "Commenter 1",
      username: "commenter1",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024e",
    },
    comment: "Great post! Loved it.",
    date: "August 28, 2025",
  },
  {
    user: {
      name: "Commenter 2",
      username: "commenter2",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
    },
    comment: "This is so insightful, thanks for sharing!",
    date: "August 27, 2025",
  },
  {
    user: {
      name: "Commenter 3",
      username: "commenter3",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705e",
    },
    comment: "I agree with this point.",
    date: "August 26, 2025",
  },
];

export default function SinglePostModal({ post, onClose }: SinglePostModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newComment, setNewComment] = useState("");

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? post.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === post.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  const handlePostComment = () => {
    // In a real application, you would send this comment to a backend
    console.log("Posting comment:", newComment);
    setNewComment(""); // Clear the input after posting
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-6xl p-0 relative h-[90vh]">
        <button className="btn btn-sm btn-circle absolute right-2 top-2 z-10" onClick={onClose}>
          ✕
        </button>
        <div className="flex flex-col md:flex-row h-full">
          {/* Left side: Image */}
          <div className="md:w-3/5 relative bg-black flex items-center justify-center">
            {post.images.length > 0 && (
              <Image
                src={post.images[currentImageIndex]}
                alt="Post Image"
                layout="fill"
                objectFit="contain"
              />
            )}
            {post.images.length > 1 && (
              <>
                <button
                  className="btn btn-circle absolute left-2 top-1/2 -translate-y-1/2 z-10"
                  onClick={handlePrevImage}
                >
                  ❮
                </button>
                <button
                  className="btn btn-circle absolute right-2 top-1/2 -translate-y-1/2 z-10"
                  onClick={handleNextImage}
                >
                  ❯
                </button>
              </>
            )}
          </div>

          {/* Right side: Details and Comments */}
          <div className="md:w-2/5 p-4 flex flex-col h-full">
            {/* Post Info Section */}
            <div className="flex-shrink-0 pb-4">
              {/* User Info */}
              <div className="flex items-center mb-4">
                <div className="avatar mr-3">
                  <div className="w-10 h-10 rounded-full">
                    <Image src={post.user.avatar} alt={post.user.name} width={40} height={40} />
                  </div>
                </div>
                <div>
                  <Link href={`/profile/${post.user.username}`} className="font-semibold hover:underline">
                    {post.user.name}
                  </Link>
                  <p className="text-sm text-base-content/70">@{post.user.username}</p>
                </div>
              </div>

              {/* Post Content */}
              <p className="mb-4">{post.content}</p>
            </div>

            {/* Comments Section */}
            <div className="flex-grow overflow-y-auto py-4 pr-2 bg-base-200 rounded-box">
              <h3 className="font-semibold mb-2 px-2">Comments</h3>
              {dummyComments.map((comment, index) => (
                <div key={index} className="flex items-start mb-4 px-2 border-b border-base-300 pb-3 last:border-b-0">
                  <div className="avatar mr-3">
                    <div className="w-8 h-8 rounded-full">
                      <Image src={comment.user.avatar} alt={comment.user.name} width={32} height={32} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <p className="font-semibold text-sm mr-2">{comment.user.name}</p>
                      <p className="text-xs text-base-content/70">{comment.date}</p>
                    </div>
                    <p className="text-sm">{comment.comment}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Input */}
            <div className="flex-shrink-0 pt-4">
              <textarea
                className="textarea textarea-bordered w-full mb-2"
                placeholder="Add a comment..."
                value={newComment}
                onChange={handleCommentChange}
              ></textarea>
              <button className="btn btn-primary w-full" onClick={handlePostComment}>
                Post Comment
              </button>
            </div>

            {/* Actions (Like, Comment, Date) */}
            <div className="flex-shrink-0 pt-4 border-t border-base-300 mt-4">
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <button className="btn btn-ghost btn-sm">Like ({post.likes})</button>
                  <button className="btn btn-ghost btn-sm">Comment ({post.comments})</button>
                </div>
                <p className="text-sm text-base-content/70">{post.date}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}