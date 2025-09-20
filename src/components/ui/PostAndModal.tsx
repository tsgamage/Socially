import { IFetchedPost } from "@/lib/types/modals.type";
import { useState } from "react";
import PostCard from "../Home/PostCard";
import SinglePostModal from "../Home/SinglePostView/SinglePostModal";

type Props = {
  postData: IFetchedPost[] | undefined;
};

export default function PostAndModal({ postData }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<IFetchedPost>({} as IFetchedPost);
  const [initialImageIndex, setInitialImageIndex] = useState(0);
  const [isCommentClicked, setIsCommentClicked] = useState(false);

  const handlePostClick = (post: IFetchedPost, imageIndex: number = 0) => {
    setSelectedPost(post);
    setInitialImageIndex(imageIndex);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPost({} as IFetchedPost);
    setInitialImageIndex(0);
    setIsCommentClicked(false);
  };

  const handleBookmarkClick = () => {};

  const handleCopyLinkClick = async (postId: string, imageIndex: number) => {
    await navigator.clipboard.writeText(
      process.env.NEXT_PUBLIC_SITE_URL +
        `/post/${postId}/?view=${isCommentClicked ? "comments" : "post"}&initialImage=${imageIndex + 1}`
    );
  };

  return (
    <div>
      {postData &&
        postData.map((post: IFetchedPost, index: number) => (
          <PostCard
            key={index}
            post={post}
            onClick={(imageIndex?: number) => handlePostClick(post, imageIndex ?? 0)}
            onCommentClick={() => setIsCommentClicked(true)}
            onBookmarkClick={() => handleBookmarkClick()}
            onCopyLinkClick={(imageIndex) => handleCopyLinkClick(post._id as string, imageIndex as number)}
          />
        ))}

      {showModal && selectedPost && (
        <SinglePostModal
          postId={selectedPost._id as string}
          onClose={handleCloseModal}
          showCommens={isCommentClicked}
          initialImageIndex={initialImageIndex}
        />
      )}
    </div>
  );
}
