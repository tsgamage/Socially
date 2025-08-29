"use client";
import { getAllPosts } from "@/actions/post.actions";
import CreatePost from "@/components/Home/CreatePost";
import PostCard from "@/components/Home/PostCard";
import SinglePostModal from "@/components/main/SinglePostModal";
import { IPost } from "@/lib/types/modals.type";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<IPost>({} as IPost);
  const [initialImageIndex, setInitialImageIndex] = useState(0);
  const [isCommentClicked, setIsCommentClicked] = useState(false);

  const { data, isLoading } = useSuspenseQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });

  const handlePostClick = (post: IPost, imageIndex: number = 0) => {
    setSelectedPost(post);
    setInitialImageIndex(imageIndex);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPost({} as IPost);
    setInitialImageIndex(0);
    setIsCommentClicked(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <CreatePost />
      <div>
        {!isLoading &&
          data!.map((post: IPost, index: number) => (
            <PostCard
              key={index}
              post={post}
              onClick={(imageIndex?: number) => handlePostClick(post, imageIndex ?? 0)}
              onCommentClick={() => setIsCommentClicked(true)}
            />
          ))}
      </div>

      {showModal && selectedPost && (
        <SinglePostModal
          post={selectedPost}
          onClose={handleCloseModal}
          showCommens={isCommentClicked}
          initialImageIndex={initialImageIndex}
        />
      )}
    </div>
  );
}
