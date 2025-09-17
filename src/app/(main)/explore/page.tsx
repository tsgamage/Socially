"use client";
import { useState } from "react";
import SinglePostModal from "@/components/Home/SinglePostView/SinglePostModal";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "@/actions/post.actions";
import ExploreCard from "@/components/Explore/ExploreCard";
import { IFetchedPost } from "@/lib/types/modals.type";
import { Frown, Loader2Icon } from "lucide-react";

// Keep the dummyPosts array as is

export default function ExplorePage() {
  const [selectedPostId, setSelectedPostId] = useState("");
  const [showingImage, setShowingImage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: fetchedPosts, isLoading: isPostsFetching } = useQuery({
    queryKey: ["posts", "explore"],
    queryFn: async () => await getAllPosts(),
  });

  const handleCloseModal = () => {
    setSelectedPostId("");
  };
  const handleImageClick = (postId: string, imageIndex: number): void => {
    setSelectedPostId(postId);
    setShowingImage(imageIndex);
  };

  let filteredPosts: IFetchedPost[] = [];
  if (fetchedPosts) {
    filteredPosts = fetchedPosts.filter(
      (post) =>
        (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (post.user.name && post.user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (post.location && post.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  const ExploreCardContent = (post: IFetchedPost) => {
    if (post.images.length === 1) {
      return <ExploreCard key={post.images[0]} post={post} onClick={handleImageClick} />;
    } else {
      return post.images.map((image, imgIndex) => (
        <ExploreCard key={post.images[imgIndex]} imageIndex={imgIndex} post={post} onClick={handleImageClick} />
      ));
    }
  };

  return (
    <div className="max-w-7xl mx-auto md:p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Explore</h1>
        <p className="text-base-content/70">Discover amazing content from our community</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8 max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-base-content/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
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
      {isPostsFetching && (
        <div className="flex flex-col items-center justify-center mt-10">
          <Loader2Icon className="animate-spin mb-2" />
          <p className="animate-bounce drop-shadow-[3px_5px_0px_rgba(0,0,0)]">Loading...</p>
        </div>
      )}

      {!isPostsFetching &&
        (filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Frown className="h-16 w-16 text-base-content/30 mb-4" />
            <p className="text-base-content/60 text-lg font-medium">No posts found</p>
            <p className="text-base-content/40 mt-1">
              {searchQuery ? "Try a different search term" : "Check back later for new content"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 auto-rows-[300px] gap-2">
            {filteredPosts.map((post) => (post.images.length > 0 ? ExploreCardContent(post) : null))}
          </div>
        ))}

      {/* Load More Button */}
      {!isPostsFetching && filteredPosts.length > 0 && (
        <div className="flex justify-center mt-10">
          <button className="btn btn-outline">Load More</button>
        </div>
      )}

      {/* Single Post Modal */}
      {selectedPostId && (
        <SinglePostModal postId={selectedPostId} initialImageIndex={showingImage} onClose={handleCloseModal} />
      )}
    </div>
  );
}
