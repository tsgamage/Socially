"use client";
import Image from "next/image";
import { useState } from "react";
import SinglePostModal from "@/components/Home/SinglePostView/SinglePostModal";

// Keep the dummyPosts array as is

export default function ExplorePage() {
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
const dummyPosts = [
  {
    id: "post1",
    user: {
      name: "Alice Johnson",
      username: "alicej",
      avatar: "https://i.pravatar.cc/150?u=alice",
    },
    date: "2 hours ago",
    content: "Exploring new places! This view is breathtaking. ⛰️",
    images: ["https://picsum.photos/id/1035/1000/600"],
    likes: 243,
    comments: 32,
    location: "Mountain View",
  },
  {
    id: "post2",
    user: {
      name: "Bob Smith",
      username: "bobsmith",
      avatar: "https://i.pravatar.cc/150?u=bob",
    },
    date: "5 hours ago",
    content: "Delicious dinner tonight! 🍝",
    images: ["https://picsum.photos/id/292/1000/600"],
    likes: 187,
    comments: 24,
  },
  {
    id: "post3",
    user: {
      name: "Charlie Brown",
      username: "charlieb",
      avatar: "https://i.pravatar.cc/150?u=charlie",
    },
    date: "1 day ago",
    content: "Throwback to last summer's adventure! ☀️",
    images: ["https://picsum.photos/id/1050/1000/600"],
    likes: 421,
    comments: 56,
    location: "Beach Paradise",
  },
  {
    id: "post4",
    user: {
      name: "Diana Prince",
      username: "dianap",
      avatar: "https://i.pravatar.cc/150?u=diana",
    },
    date: "2 days ago",
    content: "Art gallery visit today. So inspiring! 🎨",
    images: ["https://picsum.photos/id/28/1000/600"],
    likes: 312,
    comments: 41,
  },
  {
    id: "post5",
    user: {
      name: "Eve Adams",
      username: "evea",
      avatar: "https://i.pravatar.cc/150?u=eve",
    },
    date: "3 days ago",
    content: "My new workspace setup. Productivity level 100! 💻",
    images: ["https://picsum.photos/id/119/1000/600"],
    likes: 534,
    comments: 67,
  },
  {
    id: "post6",
    user: {
      name: "Frank Ocean",
      username: "franko",
      avatar: "https://i.pravatar.cc/150?u=frank",
    },
    date: "4 days ago",
    content: "Sunset views never get old. 🌅",
    images: ["https://picsum.photos/id/306/1000/600"],
    likes: 876,
    comments: 92,
    location: "West Coast",
  },
  {
    id: "post7",
    user: {
      name: "Grace Lee",
      username: "gracelee",
      avatar: "https://i.pravatar.cc/150?u=grace",
    },
    date: "5 days ago",
    content: "Weekend hike with amazing views! 🥾",
    images: ["https://picsum.photos/id/338/1000/600"],
    likes: 345,
    comments: 38,
  },
  {
    id: "post8",
    user: {
      name: "Henry Cavill",
      username: "henryc",
      avatar: "https://i.pravatar.cc/150?u=henry",
    },
    date: "1 week ago",
    content: "Coffee and coding. Perfect combination. ☕",
    images: ["https://picsum.photos/id/431/1000/600"],
    likes: 623,
    comments: 71,
  },
  {
    id: "post9",
    user: {
      name: "Ivy Chen",
      username: "ivyc",
      avatar: "https://i.pravatar.cc/150?u=ivy",
    },
    date: "1 week ago",
    content: "Book recommendations anyone? 📚",
    images: ["https://picsum.photos/id/24/1000/600"],
    likes: 278,
    comments: 45,
  },
];
  const handleImageClick = (post: any) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  // Filter posts based on search query
  const filteredPosts = dummyPosts.filter(post => 
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.location && post.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  

  // Function to assign bento grid layout classes based on index
  const getBentoClass = (index: number) => {
    const patterns = [
      "col-span-2 row-span-2", // Large square
      "col-span-1 row-span-1", // Small square
      "col-span-1 row-span-1", // Small square
      "col-span-1 row-span-2", // Tall rectangle
      "col-span-2 row-span-1", // Wide rectangle
      "col-span-1 row-span-1", // Small square
      "col-span-1 row-span-1", // Small square
      "col-span-2 row-span-2", // Large square
      "col-span-1 row-span-1", // Small square
    ];
    
    return patterns[index % patterns.length];
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Explore</h1>
        <p className="text-base-content/70">Discover amazing content from our community</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8 max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search posts, people, or locations..."
          className="input input-bordered input-lg w-full pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Bento Grid Layout */}
      {filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-base-content/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-base-content/60 text-lg font-medium">No posts found</p>
          <p className="text-base-content/40 mt-1">
            {searchQuery ? "Try a different search term" : "Check back later for new content"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 auto-rows-[160px]">
          {filteredPosts.map((post, index) => (
            <div
              key={post.id}
              className={`relative overflow-hidden rounded-xl cursor-pointer group ${getBentoClass(index)}`}
              onClick={() => handleImageClick(post)}
            >
              <Image 
                src={post.images[0]} 
                alt={post.content} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="avatar mr-2">
                      <div className="w-6 h-6 rounded-full ring-1 ring-white/30">
                        <Image 
                          src={post.user.avatar} 
                          alt={post.user.name} 
                          width={24} 
                          height={24}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <span className="font-medium text-sm truncate">{post.user.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs bg-black/30 px-2 py-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span>{post.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {filteredPosts.length > 0 && (
        <div className="flex justify-center mt-10">
          <button className="btn btn-outline">Load More</button>
        </div>
      )}

      {/* Single Post Modal */}
      {selectedPost && (
        <SinglePostModal
          post={selectedPost}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}