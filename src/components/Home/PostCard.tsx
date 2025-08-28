"use client";
import Image from "next/image";
import { useState } from "react";
import { 
  Heart, MessageCircle, Share, Bookmark, ChevronLeft, 
  ChevronRight, MoreHorizontal, MapPin 
} from "lucide-react";

interface Post {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  date: string;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  location?: string;
}

interface PostCardProps {
  post: Post;
  onClick: (imageIndex?: number) => void;
}

export default function PostCard({ post, onClick }: PostCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => 
      prev === 0 && post.images ? post.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => 
      post.images && prev === post.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleImageClick = (index: number) => {
    onClick(index);
  };

  return (
    <div className="card bg-base-100 shadow-md border border-base-300 rounded-xl mb-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center">
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
          <div>
            <p className="text-sm font-semibold">{post.user.username}</p>
            {post.location && (
              <p className="text-xs text-gray-500 flex items-center">
                <MapPin size={12} className="mr-1" />
                {post.location}
              </p>
            )}
          </div>
        </div>
        <button className="btn btn-ghost btn-sm btn-circle">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Image Carousel */}
      {post.images && post.images.length > 0 && (
        <div 
          className="relative aspect-square w-full bg-black cursor-pointer"
          onClick={() => handleImageClick(currentImageIndex)}
        >
          <Image 
            src={post.images[currentImageIndex]} 
            alt="Post image" 
            fill
            className="object-cover"
          />
          
          {/* Navigation Arrows */}
          {post.images.length > 1 && (
            <>
              <button 
                className="absolute left-2 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-base-100/70 hover:bg-base-100 border-0"
                onClick={handlePrevImage}
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-base-100/70 hover:bg-base-100 border-0"
                onClick={handleNextImage}
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
          
          {/* Image Indicator Dots */}
          {post.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5">
              {post.images.map((_, index) => (
                <div 
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                ></div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex space-x-4">
            <button className="btn btn-ghost btn-sm p-0 hover:bg-transparent">
              <Heart size={24} />
            </button>
            <button 
              className="btn btn-ghost btn-sm p-0 hover:bg-transparent"
              onClick={() => handleImageClick(0)}
            >
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

        {/* Likes count */}
        <p className="text-sm font-semibold mb-1">{post.likes} likes</p>

        {/* Content */}
        <div className="mb-1">
          <span className="text-sm font-semibold mr-2">{post.user.username}</span>
          <span className="text-sm">{post.content}</span>
        </div>

        {/* View all comments */}
        {post.comments > 0 && (
          <button 
            className="text-sm text-gray-500 mb-2" 
            onClick={() => handleImageClick(0)}
          >
            View all {post.comments} comments
          </button>
        )}

        {/* Date */}
        <p className="text-xs text-gray-400 uppercase">{post.date}</p>
      </div>

      {/* Add comment (simplified) */}
      <div className="border-t border-base-300 p-3">
        <div className="flex items-center">
          <input 
            type="text" 
            placeholder="Add a comment..." 
            className="input input-ghost input-sm w-full focus:outline-none" 
          />
          <button className="btn btn-ghost btn-sm text-primary">Post</button>
        </div>
      </div>
    </div>
  );
}