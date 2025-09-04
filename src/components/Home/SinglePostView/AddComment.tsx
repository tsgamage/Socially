import { addComment } from "@/actions/post.actions";
import { IPost } from "@/lib/types/modals.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, Smile } from "lucide-react";
import { useState } from "react";

export default function AddComment({
  post,
  postedCommentRef,
}: {
  post: IPost;
  postedCommentRef: React.RefObject<HTMLDivElement>;
}) {
  const [newComment, setNewComment] = useState("");

  const queryClient = useQueryClient();

  const { mutate: addCommentToPost } = useMutation({
    mutationFn: async () => await addComment(post._id as string, newComment),
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["comments", post._id] });
    },
  });

  const handlePostComment = () => {
    addCommentToPost();
    setTimeout(() => postedCommentRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  return (
    <div className="p-3 border-b border-base-300 flex-shrink-0">
      <div className="flex items-center">
        <Smile size={20} className="text-gray-500 mr-2" />
        <input
          type="text"
          className="input input-ghost input-md w-full focus:outline-none"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
        />
        <button
          type="button"
          data-tip="Post Comment"
          title="Post Comment"
          className="cursor-pointer tooltip tooltip-left tooltip-info btn btn-circle btn-sm "
          onClick={handlePostComment}
          disabled={!newComment}
        >
          <Send size={16} className="cursor-pointer" />
        </button>
      </div>
    </div>
  );
}
