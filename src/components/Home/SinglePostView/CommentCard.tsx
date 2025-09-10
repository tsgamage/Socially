"use client";

import { deleteComment, editComment } from "@/actions/post.actions";
import DeleteComfirmationModal from "@/components/ui/modals/DeleteComfirmationsModal";
import { IComment, IFetchedComment, IFetchedPost } from "@/lib/types/modals.type";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNowStrict } from "date-fns";
import { MoreVertical } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

type Props = {
  comment: IFetchedComment;
  post: IFetchedPost;
};
export default function CommentCard({ comment, post }: Props) {
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [updatedComment, setUpdatedComment] = useState(comment.content);

  const { user } = useUser();
  const queryClient = useQueryClient();
  const deleteComfirmationModal = useRef<HTMLDialogElement>(null);

  const { mutate: editUserComment } = useMutation({
    mutationFn: async () => await editComment(comment._id as string, updatedComment),
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ["comments", post._id] });
      const allComments: IFetchedComment[] | undefined = queryClient.getQueryData(["comments", post._id]);
      const editedComment = allComments?.find((c) => c._id === comment._id);

      if (allComments) {
        queryClient.setQueryData(
          ["comments", post._id],
          allComments.map((c) => (c._id === comment._id ? { ...editedComment, content: updatedComment } : c))
        );
      }

      return { oldComment: allComments };
    },
    onError: (error, props, context) => {
      queryClient.setQueryData(["comments", post._id], context?.oldComment);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", post._id] });
    },
  });

  const { mutate: deleteUserComment, isPending: isDeletingComment } = useMutation({
    mutationFn: async () => await deleteComment(comment._id as string),
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ["comments", post._id] });
      const allComments: IComment[] | undefined = queryClient.getQueryData(["comments", post._id]);
      const updatedComments = allComments?.filter((c) => c._id !== comment._id);
      queryClient.setQueryData(["comments", post._id], updatedComments);
      return { oldComments: allComments };
    },
    onError: (error, props, context) => {
      queryClient.setQueryData(["comments", post._id], context?.oldComments);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", post._id] });
    },
  });

  const handleCommentSaveClick = async () => {
    if (updatedComment.trim()) {
      await editUserComment();
      setIsEditingComment(false);
    }
  };

  const handleCancelCommentEditClick = async () => {
    setUpdatedComment(comment.content);
    setIsEditingComment(false);
  };

  return (
    <>
      <DeleteComfirmationModal
        ref={deleteComfirmationModal as any}
        onDelete={async () => {
          await deleteUserComment();
          deleteComfirmationModal.current?.close();
        }}
        isDeleting={isDeletingComment}
        title="Delete Your Comment?"
        description="Are you sure you want to delete your comment?"
      />
      <div key={comment._id + comment.user.clerkId} className="flex mb-4 p-3 bg-base-200 rounded-lg relative">
        <div className="avatar mr-3">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={comment.user.profilePic}
              alt={comment.user.name || "User Avatar"}
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col  mb-1">
            <span className="font-semibold text-sm mr-2">{comment.user.name}</span>
            <div className="flex">
              <span className="font-semibold text-xs  text-gray-500">{comment.user.username}</span>
              <p className="text-xs text-gray-400 mx-1">-</p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNowStrict(comment.createdAt, { addSuffix: true })}
              </p>
              {comment.isEdited && (
                <>
                  <p className="text-xs text-gray-400 mx-1">-</p>
                  <span className="font-semibold text-xs  text-gray-500">Edited</span>
                </>
              )}
            </div>
          </div>
          {!isEditingComment && <span>{comment.content}</span>}
          {isEditingComment && (
            <>
              <textarea
                placeholder="Type your comment"
                className="w-full border border-gray-300 rounded-md p-2 bg-gray-800/50"
                defaultValue={comment.content}
                rows={2}
                autoFocus
                onChange={(event) => setUpdatedComment(event.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") handleCancelCommentEditClick();
                  if (e.key === "Enter" && e.ctrlKey) handleCommentSaveClick();
                }}
              />
              <div className="flex gap-3 my-2">
                <button
                  type="button"
                  disabled={!updatedComment.trim()}
                  className="btn btn-primary btn-xs"
                  onClick={handleCommentSaveClick}
                >
                  Save
                </button>
                <button type="button" className="btn btn-ghost btn-xs" onClick={handleCancelCommentEditClick}>
                  Cancel
                </button>
              </div>
            </>
          )}
          {/* <div className="flex gap-2 mt-2">
          <button className="cursor-pointer">
            <Smile size={14} />
          </button>
          <button className="cursor-pointer">
            <Frown size={14} />
          </button>
          <button className="cursor-pointer">
            <Angry size={14} />
          </button>
        </div> */}
        </div>
        {user?.id === comment.user.clerkId && (
          <div className="dropdown dropdown-end rounded-full">
            <div tabIndex={0} title="More" role="button" className="btn btn-ghost btn-circle">
              <MoreVertical size={15} />
            </div>
            <ul
              key={isEditingComment + comment.content}
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              <li onClick={() => setIsEditingComment(true)}>
                <a>Edit</a>
              </li>

              <li className="text-red-500">
                <a title="Delete" onClick={() => deleteComfirmationModal.current?.showModal()}>
                  Delete
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
