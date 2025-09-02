"use client";
import { getAllPosts } from "@/actions/post.actions";
import CreatePost from "@/components/Home/CreatePost";
import PostCard from "@/components/Home/PostCard";
import SinglePostModal from "@/components/main/SinglePostModal";
import { IPost } from "@/lib/types/modals.type";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<IPost>({} as IPost);
  const [initialImageIndex, setInitialImageIndex] = useState(0);
  const [isCommentClicked, setIsCommentClicked] = useState(false);

  const { data, isLoading } = useQuery({
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

  const handleBookmarkClick = () => {};

  const handleCopyLinkClick = async (postId: string, imageIndex: number) => {
    console.log(initialImageIndex);
    await navigator.clipboard.writeText(
      process.env.NEXT_PUBLIC_SITE_URL +
        `/post/${postId}/?view=${isCommentClicked ? "comments" : "post"}&initialImage=${imageIndex + 1}`
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <CreatePost />
      {isLoading && (
        <div className="flex flex-col items-center justify-center mt-10">
          <Loader2Icon className="animate-spin mb-2" />
          <p className="animate-bounce drop-shadow-[3px_5px_0px_rgba(0,0,0)]">Loading...</p>
        </div>
      )}
      <div>
        {!isLoading &&
          data!.map((post: IPost, index: number) => (
            <PostCard
              key={index}
              post={post}
              onClick={(imageIndex?: number) => handlePostClick(post, imageIndex ?? 0)}
              onCommentClick={() => setIsCommentClicked(true)}
              onBookmarkClick={() => handleBookmarkClick()}
              onCopyLinkClick={(imageIndex) => handleCopyLinkClick(post._id as string, imageIndex as number)}
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
