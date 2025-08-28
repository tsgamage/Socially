"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { 
  Heart, MessageCircle, Share, Bookmark, X, ChevronLeft, 
  ChevronRight, MoreHorizontal, Smile, MapPin, Send 
} from "lucide-react";

interface User {
  name: string;
  username: string;
  avatar: string;
}

interface Post {
  id: string;
  user: User;
  date: string;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  location?: string;
}

interface Comment {
  user: User;
  comment: string;
  date: string;
}

interface SinglePostModalProps {
  post: Post;
  onClose: () => void;
  initialImageIndex?: number;
}

const dummyComments: Comment[] = [
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
  {
    user: {
      name: "Commenter 4",
      username: "commenter4",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026706e",
    },
    comment: "This is amazing!",
    date: "August 25, 2025",
  },
  {
    user: {
      name: "Commenter 5",
      username: "commenter5",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026707e",
    },
    comment: "I've been waiting for something like this!",
    date: "August 24, 2025",
  },
  {
    user: {
      name: "Commenter 6",
      username: "commenter6",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026708e",
    },
    comment: "Beautiful capture! The lighting is perfect.",
    date: "August 23, 2025",
  },
  {
    user: {
      name: "Commenter 7",
      username: "commenter7",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026709e",
    },
    comment: "This made my day! 😍",
    date: "August 22, 2025",
  },
];

export default function SinglePostModal({ post, onClose, initialImageIndex = 0 }: SinglePostModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialImageIndex);
  const [newComment, setNewComment] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const commentsContainerRef = useRef<HTMLDivElement>(null);
  const hasImages = post.images && post.images.length > 0;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePrevImage = () => {
    if (!post.images) return;
    setCurrentImageIndex(prev => 
      prev === 0 ? post.images!.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!post.images) return;
    setCurrentImageIndex(prev => 
      prev === post.images!.length - 1 ? 0 : prev + 1
    );
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

  // For text-only posts
  if (!hasImages) {
    return (
      <div className="modal modal-open">
        <div className="modal-box max-w-2xl p-0 relative">
          <button 
            className="btn btn-sm btn-circle absolute right-2 top-2 z-10"
            onClick={onClose}
          >
            <X size={16} />
          </button>
          
          <div className="p-6">
            {/* User Info */}
            <div className="flex items-center mb-6">
              <div className="avatar mr-3">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Image 
                    src={post.user.avatar} 
                    alt={post.user.name} 
                    width={48} 
                    height={48} 
                    className="object-cover"
                  />
                </div>
              </div>
              <div>
                <Link
                  href={`/profile/${post.user.username}`}
                  className="font-semibold hover:underline block"
                >
                  {post.user.username}
                </Link>
                {post.location && (
                  <p className="text-sm text-gray-500 flex items-center">
                    <MapPin size={12} className="mr-1" />
                    {post.location}
                  </p>
                )}
              </div>
              <div className="flex-grow"></div>
              <button className="btn btn-ghost btn-sm btn-circle">
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Post Content */}
            <div className="mb-6">
              <p className="text-lg">{post.content}</p>
              <p className="text-sm text-gray-500 mt-2">{post.date}</p>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center mb-6 border-t border-b border-base-300 py-4">
              <div className="flex space-x-4">
                <button className="btn btn-ghost btn-sm">
                  <Heart size={20} />
                  <span className="ml-2">{post.likes}</span>
                </button>
                <button className="btn btn-ghost btn-sm">
                  <MessageCircle size={20} />
                  <span className="ml-2">{post.comments}</span>
                </button>
                <button className="btn btn-ghost btn-sm">
                  <Share size={20} />
                </button>
              </div>
              <button className="btn btn-ghost btn-sm">
                <Bookmark size={20} />
              </button>
            </div>

            {/* Comments Section */}
            <div className="mb-6 max-h-96 overflow-y-auto pr-2" ref={commentsContainerRef}>
              <h3 className="font-semibold mb-4">Comments</h3>
              {dummyComments.map((comment, index) => (
                <div key={index} className="flex mb-4 p-3 bg-base-200 rounded-lg">
                  <div className="avatar mr-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={comment.user.avatar}
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
                      <span className="text-sm">{comment.comment}</span>
                    </div>
                    <p className="text-xs text-gray-500">{comment.date}</p>
                    
                    <div className="flex items-center mt-1 space-x-3">
                      <button className="text-xs text-gray-500">Like</button>
                      <button className="text-xs text-gray-500">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={commentsEndRef} />
            </div>

            {/* Add Comment */}
            <div className="flex items-center">
              <Smile size={20} className="text-gray-500 mr-2" />
              <input
                type="text"
                className="input input-bordered input-sm w-full"
                placeholder="Add a comment..."
                value={newComment}
                onChange={handleCommentChange}
                onKeyPress={(e) => e.key === 'Enter' && handlePostComment()}
              />
              <button 
                className={`btn btn-ghost btn-sm ml-2 ${newComment ? 'text-primary' : 'text-gray-300'}`}
                onClick={handlePostComment}
                disabled={!newComment}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal modal-open">
      <div className={`modal-box p-0 relative ${isMobile ? 'h-full max-w-full rounded-none' : 'max-w-4xl h-[90vh]'}`}>
        <button 
          className="btn btn-sm btn-circle absolute right-2 top-2 z-10 bg-base-100/80"
          onClick={onClose}
        >
          <X size={16} />
        </button>
        
        <div className={`flex ${isMobile ? 'flex-col' : 'h-full'}`}>
          {/* Image Section */}
          <div className={`relative bg-black flex items-center justify-center ${isMobile ? 'h-80' : 'w-1/2'}`}>
            <Image
              src={post.images[currentImageIndex]}
              alt="Post Image"
              fill
              className="object-contain"
            />
            
            {/* Navigation Arrows */}
            {post.images.length > 1 && (
              <>
                <button
                  className="btn btn-circle absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-base-100/80 border-0"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
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
          <div className={`flex flex-col ${isMobile ? '' : 'w-1/2 h-full'}`}>
            {/* User Info */}
            <div className="flex items-center p-4 border-b border-base-300">
              <div className="avatar mr-3">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image 
                    src={post.user.avatar} 
                    alt={post.user.name} 
                    width={32} 
                    height={32} 
                    className="object-cover"
                  />
                </div>
              </div>
              <Link
                href={`/profile/${post.user.username}`}
                className="font-semibold text-sm hover:underline"
              >
                {post.user.username}
              </Link>
              <div className="flex-grow"></div>
              <button className="btn btn-ghost btn-sm">
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Post Caption - Fixed above comments */}
            <div className="p-4 border-b border-base-300">
              <div className="flex">
                <div className="avatar mr-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image 
                      src={post.user.avatar} 
                      alt={post.user.name} 
                      width={32} 
                      height={32} 
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-1">
                    <span className="font-semibold text-sm mr-2">{post.user.username}</span>
                    <span className="text-sm">{post.content}</span>
                  </div>
                  <p className="text-xs text-gray-500">{post.date}</p>
                </div>
              </div>
            </div>

            {/* Comments Section - Scrollable */}
            <div 
              className="flex-grow overflow-y-auto p-4"
              ref={commentsContainerRef}
            >
              <h3 className="font-semibold mb-4">Comments</h3>
              {dummyComments.map((comment, index) => (
                <div key={index} className="flex mb-4 p-3 bg-base-200 rounded-lg">
                  <div className="avatar mr-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={comment.user.avatar}
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
                      <span className="text-sm">{comment.comment}</span>
                    </div>
                    <p className="text-xs text-gray-500">{comment.date}</p>
                    
                    <div className="flex items-center mt-1 space-x-3">
                      <button className="text-xs text-gray-500">Like</button>
                      <button className="text-xs text-gray-500">Reply</button>
                    </div>
                  </div>
                  <button className="btn btn-ghost btn-sm p-0 hover:bg-transparent self-start">
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
                  <button className="btn btn-ghost btn-sm p-0 hover:bg-transparent">
                    <Heart size={24} />
                  </button>
                  <button className="btn btn-ghost btn-sm p-0 hover:bg-transparent">
                    <MessageCircle size={24} />
                  </button>
                  <button className="btn btn-ghost btn-sm p-0 hover:bg-transparent">
                    <Share size={24} />
                  </button>
                </div>
                <button className="btn btn-ghost btn-sm p-0 hover:bg-transparent">
                  <Bookmark size={24} />
                </button>
              </div>

              <p className="text-sm font-semibold mb-2">{post.likes} likes</p>
              <p className="text-xs text-gray-400 uppercase">{post.date}</p>
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
                  onKeyPress={(e) => e.key === 'Enter' && handlePostComment()}
                />
                <button 
                  className={`btn btn-ghost btn-sm ${newComment ? 'text-primary' : 'text-blue-200'}`}
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