import { getComments } from "@/actions/post.actions";
import { IFetchedComment, IFetchedPost } from "@/lib/types/modals.type";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import CommentCard from "./CommentCard";

export default function Comments({ post, ref }: { post: IFetchedPost; ref: React.RefObject<HTMLDivElement> }) {
  const {
    data: comments,
    isLoading: isLoadingComments,
    isError: isErrorComments,
    refetch: refetchComments,
  } = useQuery({
    queryKey: ["comments", post._id],
    queryFn: async () => (await getComments(post._id as string)) as unknown as IFetchedComment[],
  });
  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-4">
      <h3 className="font-semibold mb-4">
        Comments {isLoadingComments ? <Loader2 size={16} className="inline animate-spin" /> : `(${comments?.length})`}
      </h3>

      {isLoadingComments && <p className="text-sm text-gray-500 text-center animate-pulse mb-4">Loading comments...</p>}

      {comments?.length === 0 && <p className="text-sm text-gray-500 text-center">Be the first to comment</p>}

      {isErrorComments && (
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-500 text-center">Error loading comments</p>
          <button type="button" className="btn btn-primary btn-sm mt-2" onClick={() => refetchComments()}>
            Retry
          </button>
        </div>
      )}

      {!isLoadingComments &&
        !isErrorComments &&
        comments !== undefined &&
        comments.map((comment) => (
          <CommentCard key={comment._id + comment.user.clerkId} comment={comment} post={post} />
        ))}

      <div ref={ref} />
    </div>
  );
}
