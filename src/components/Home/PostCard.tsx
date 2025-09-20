"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  MapPin,
  ArrowBigUpDash,
  ArrowBigDownDash,
  MessageSquare,
  SendHorizontal,
  X,
  Link2,
  Check,
} from "lucide-react";
import { IFetchedPost } from "@/lib/types/modals.type";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { deletePost, giveDownvote, giveUpvote, toggleSavePost, updatePostVisibility } from "@/actions/post.actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DeleteComfirmationModal from "../ui/modals/DeleteComfirmationsModal";
import VisibilityChangeModal from "../ui/modals/VisibilityChangeModal";

interface PostCardProps {
  post: IFetchedPost;
  onClick: (imageIndex?: number) => void;
  onCommentClick: () => void;
  onCopyLinkClick: (currentImageIndex: number) => void;
  onBookmarkClick: () => void;
}

export default function PostCard({ post, onClick, onCommentClick, onCopyLinkClick }: PostCardProps) {
  const { user: clerkUser } = useUser();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [isCopyLinkClicked, setIsCopyLinkClicked] = useState(false);
  const [readmoreClicked, setReadmoreClicked] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const deleteComfirmationModal = useRef<HTMLDialogElement>(null);
  const visibilityChangeModal = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (dropdownRef.current) {
        // Close the dropdown by clicking outside or using the dropdown's API
        const dropdown = dropdownRef.current;
        const dropdownContent = dropdown.querySelector(".dropdown-content");

        if (dropdownContent && dropdownContent.classList.contains("dropdown-open")) {
          // Close the dropdown by removing the open class or triggering click
          dropdown.click();
        }
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup function
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const queryClient = useQueryClient();

  const { mutate: deletePostById, isPending: isDeleting } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const { mutate: giveUpvoteForPost } = useMutation({
    mutationFn: giveUpvote,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Use functional update to avoid unnecessary array copies
      const previousPosts = queryClient.getQueryData<IFetchedPost[]>(["posts"]);

      queryClient.setQueryData<IFetchedPost[]>(["posts"], (oldPosts) => {
        if (!oldPosts) return oldPosts;
        return oldPosts.map((post) => {
          if (post._id !== postId) return post;
          // Only update the affected post
          if (post.vote === 1) {
            return { ...post, votesCount: post.votesCount - 1, vote: 0 } as IFetchedPost;
          } else if (post.vote === -1) {
            return { ...post, votesCount: post.votesCount + 2, vote: 1 } as IFetchedPost;
          } else {
            return { ...post, votesCount: post.votesCount + 1, vote: 1 } as IFetchedPost;
          }
        });
      });

      return { oldPosts: previousPosts };
    },
    onError: (err, postId, context) => {
      // Rollback to previous state if error
      queryClient.setQueryData(["posts"], context?.oldPosts);
    },
    onSettled: () => {
      // Optionally revalidate, but for efficiency, you may want to debounce or batch this
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const { mutate: giveDownvoteForPost } = useMutation({
    mutationFn: giveDownvote,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Use functional update to avoid unnecessary array copies
      const previousPosts = queryClient.getQueryData<IFetchedPost[]>(["posts"]);

      queryClient.setQueryData<IFetchedPost[]>(["posts"], (oldPosts) => {
        if (!oldPosts) return oldPosts;
        return oldPosts.map((post) => {
          if (post._id !== postId) return post;
          // Only update the affected post
          if (post.vote === -1) {
            return { ...post, votesCount: post.votesCount + 1, vote: 0 } as IFetchedPost;
          } else if (post.vote === 1) {
            return { ...post, votesCount: post.votesCount - 2, vote: -1 } as IFetchedPost;
          } else {
            return { ...post, votesCount: post.votesCount - 1, vote: -1 } as IFetchedPost;
          }
        });
      });

      return { oldPosts: previousPosts };
    },
    onError: (err, postId, context) => {
      // Rollback to previous state if error
      queryClient.setQueryData(["posts"], context?.oldPosts);
    },
    onSettled: () => {
      // Optionally revalidate, but for efficiency, you may want to debounce or batch this
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const { mutate: togglePostSave } = useMutation({
    mutationFn: toggleSavePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const allPosts: IFetchedPost[] | undefined = queryClient.getQueryData(["posts"]);

      const updatedPosts = allPosts?.map((p) => (p._id === postId ? { ...p, isSaved: !p.isSaved } : p));

      queryClient.setQueryData(["posts"], updatedPosts);
      return { oldPosts: allPosts };
    },

    onError: (err, postId, context) => {
      queryClient.setQueryData(["posts"], context!.oldPosts);
    },

    onSettled: (data, error, postId) => {
      queryClient.invalidateQueries({ queryKey: ["posts", postId] });
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
    },
  });

  const { mutate: changePostVisibility } = useMutation({
    mutationFn: async (visibility: string) => await updatePostVisibility(post._id as string, visibility),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["privatePosts", post.user.username] });
    },
  });

  const handleVisibilityChange = async (visibility: string) => {
    changePostVisibility(visibility);
    visibilityChangeModal.current?.close();
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 && post.images ? post.images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (post.images && prev === post.images.length - 1 ? 0 : prev + 1));
  };

  const handleImageClick = (index: number) => {
    onClick(index);
  };

  return (
    <>
      <DeleteComfirmationModal
        ref={deleteComfirmationModal as any}
        onDelete={async () => {
          await deletePostById(post._id as string);
          deleteComfirmationModal.current?.close();
        }}
        isDeleting={isDeleting}
        title="Delete Post?"
        description="Are you sure you want to delete this post?"
      />
      <VisibilityChangeModal
        ref={visibilityChangeModal as any}
        onChange={handleVisibilityChange}
        defaultValue={post.visibility}
      />
      <div className="card xl:w-10/12 bg-base-500 shadow-md border border-base-content/10 rounded-xl mb-6 overflow-hidden mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b-1 border-base-content/10">
          <div className="flex items-center">
            <div className="avatar mr-3">
              <div className="size-10 rounded-full overflow-hidden cursor-pointer">
                <Link href={`/profile/${post.user.username}`}>
                  <Image
                    src={post.user.profilePic || "/user/default/user.jpg"}
                    alt={post.user.username as string}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </Link>
              </div>
            </div>
            <div>
              <Link href={`/profile/${post.user.username}`} className="hover:underline hover:text-gray-300">
                <p className="text-sm font-semibold">{post.user.name}</p>
              </Link>
              <p className="text-sm text-gray-400">@{post.user.username}</p>
              <div className="flex">
                <p className="text-xs text-gray-400">
                  {formatDistanceToNowStrict(post.createdAt, { addSuffix: true })}
                </p>
                <p className="text-xs text-gray-400 ml-1">-</p>
                <p className="text-xs text-gray-400 ml-1">{post.visibility}</p>
                {post.isEdited && (
                  <>
                    <p className="text-xs text-gray-400 ml-1">-</p>
                    <p className="text-xs text-gray-400 ml-1">Edited</p>
                  </>
                )}
              </div>
              {post.location && (
                <p className="text-xs text-gray-500 flex items-center">
                  <MapPin size={12} className="mr-1" />
                  {post.location}
                </p>
              )}
            </div>
          </div>

          {post.user.clerkId === clerkUser?.id ? (
            <div className="dropdown dropdown-end rounded-full" ref={dropdownRef}>
              <div tabIndex={0} title="More" role="button" className="btn btn-ghost btn-circle">
                <MoreHorizontal size={20} />
              </div>
              <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                <>
                  <li>
                    <a>Edit</a>
                  </li>
                  <li onClick={() => visibilityChangeModal.current?.showModal()}>
                    <a>Visibility ({post.visibility})</a>
                  </li>
                </>

                <li className="text-red-500">
                  <a title="Delete" onClick={() => deleteComfirmationModal.current?.showModal()}>
                    Delete
                  </a>
                </li>
              </ul>
            </div>
          ) : (
            <div className="btn btn-ghost btn-circle tooltip tooltip-error tooltip-left" data-tip="Hide This Post">
              <X size={20} />
            </div>
          )}
        </div>

        {/* Content */}
        {post.content && (
          <div className="mb-1 p-3 ">
            {post.content.length > 100 && !readmoreClicked && (
              <span className="text-md whitespace-pre-wrap">{post.content.slice(0, 100)} ...</span>
            )}
            {(readmoreClicked || post.content.length < 100) && (
              <span className="text-md whitespace-pre-wrap">{post.content}</span>
            )}
            {post.content.length > 100 && !readmoreClicked && (
              <button
                className="block text-md text-blue-600 underline cursor-pointer"
                onClick={() => setReadmoreClicked(true)}
              >
                Readmore
              </button>
            )}
          </div>
        )}

        {/* Image Carousel */}
        {post.images && post.images.length > 0 && (
          <div
            className="relative aspect-square w-full bg-black cursor-pointer"
            onClick={() => handleImageClick(currentImageIndex)}
          >
            <Image src={post.images[currentImageIndex]} alt="Post image" fill className="object-cover object-top" />

            {/* Navigation Arrows */}
            {post.images.length > 1 && (
              <div>
                <button
                  type="button"
                  title="Previous Image"
                  className="absolute left-2 top-1/2 btn btn-circle btn-sm bg-base-100/30 hover:bg-base-100 border-0"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  title="Next Image"
                  className="absolute right-2 top-1/2 btn btn-circle btn-sm bg-base-100/30 hover:bg-base-100 border-0"
                  onClick={handleNextImage}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Image Indicator Dots */}
            {post.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5">
                {post.images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                  ></div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="p-3 text-gray-400">
          <div className="flex justify-between items-center mb-2 ">
            <div className="flex space-x-4">
              <div className="flex items-center justify-between w-auto bg-gray-900/70  rounded-full">
                <div className="tooltip" data-tip="Upvote">
                  <button
                    title="Give a Upvote"
                    type="button"
                    className={`group cursor-pointer flex items-center gap-1 w-full h-full rounded-l-full p-2 pr-4  ${
                      post.vote === 1 ? "bg-blue-900/70" : "hover:bg-gray-800"
                    }`}
                    onClick={() => giveUpvoteForPost(post._id as string)}
                  >
                    <ArrowBigUpDash className={post.vote === 1 ? "text-blue-500" : ""} size={24} />
                    <p className="text-sm font-semibold mb-1">{post.votesCount}</p>
                  </button>
                </div>
                <div className="tooltip" data-tip="Downvote">
                  <button
                    title="Give a Downvote"
                    type="button"
                    className={`cursor-pointer flex items-center gap-1 w-full h-full rounded-r-full p-2 ${
                      post.vote === -1 ? "bg-red-900/70" : "hover:bg-gray-800"
                    }`}
                    onClick={() => giveDownvoteForPost(post._id as string)}
                  >
                    <ArrowBigDownDash className={post.vote === -1 ? "text-red-500/80" : ""} scale={24} />
                  </button>
                </div>
              </div>
              <div className="tooltip" data-tip="See Comments">
                <button
                  title="See Comments"
                  type="button"
                  className="flex items-center gap-2 bg-gray-900/70 p-2 rounded-full hover:bg-gray-800 cursor-pointer"
                  onDoubleClick={() => setShowCommentInput((preValue) => !preValue)}
                  onClickCapture={() => {
                    onCommentClick();
                    onClick();
                  }}
                >
                  <MessageSquare size={24} />
                  {post && post.commentsCount > 0 && <p className="text-sm font-semibold mb-1">{post.commentsCount}</p>}
                </button>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="tooltip" data-tip={`${post.isSaved ? "Unsave Post" : "Save Post"}`}>
                <button
                  title="Bookmark Button"
                  type="button"
                  className="bg-gray-900/70 p-2 rounded-full hover:bg-gray-800 cursor-pointer"
                  onClick={() => togglePostSave(post._id as string)}
                >
                  <Bookmark className={`${post.isSaved ? "fill-gray-400" : ""}`} size={24} />
                </button>
              </div>
              <div
                className={`tooltip tooltip-left  ${isCopyLinkClicked && "tooltip-success"}`}
                data-tip={isCopyLinkClicked ? "Copied!" : "Copy Link"}
              >
                <button
                  title="Copy Link"
                  type="button"
                  className={`flex items-center gap-2 bg-gray-900/70 p-2 rounded-full hover:bg-gray-800 cursor-pointer`}
                  onClick={() => {
                    setIsCopyLinkClicked(true);
                    onCopyLinkClick(currentImageIndex);
                    setTimeout(() => setIsCopyLinkClicked(false), 500);
                  }}
                >
                  {isCopyLinkClicked ? <Check size={24} /> : <Link2 size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add comment (simplified) */}
        {showCommentInput && (
          <div className="border-t border-base-300 p-3">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Add a comment..."
                className="input input-ghost input-md w-full focus:outline-none"
              />
              <button type="button" title="Post comment" className="btn btn-ghost btn-circle text-primary">
                <SendHorizontal />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
