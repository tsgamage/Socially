import { getComments } from "@/actions/post.actions";
import { IFetchedComment, IPost } from "@/lib/types/modals.type";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNowStrict } from "date-fns";
import { Angry, Frown, Loader2, MoreVertical, Smile } from "lucide-react";
import Image from "next/image";

export default function Comments({ post, ref }: { post: IPost; ref: React.RefObject<HTMLDivElement> }) {
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
        comments.map((c) => (
          <div key={c._id + c.user.clerkId} className="flex mb-4 p-3 bg-base-200 rounded-lg relative">
            <div className="avatar mr-3">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={c.user.profilePic}
                  alt={c.user.name || "User Avatar"}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col  mb-1">
                <span className="font-semibold text-sm mr-2">{c.user.name}</span>
                <div className="flex">
                  <span className="font-semibold text-xs  text-gray-500">{c.user.username}</span>
                  <p className="text-xs text-gray-400 mx-1">-</p>
                  <p className="text-xs text-gray-500">{formatDistanceToNowStrict(c.createdAt, { addSuffix: true })}</p>
                </div>
              </div>
              <span>{c.content}</span>
              <div className="flex gap-2 mt-2">
                <button className="cursor-pointer">
                  <Smile size={14} />
                </button>
                <button className="cursor-pointer">
                  <Frown size={14} />
                </button>
                <button className="cursor-pointer">
                  <Angry size={14} />
                </button>
              </div>
            </div>
            <div className="dropdown dropdown-end rounded-full">
              <div tabIndex={0} title="More" role="button" className="btn btn-ghost btn-circle">
                <MoreVertical size={15} />
              </div>
              <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                <li>
                  <a>Edit</a>
                </li>

                <li className="text-red-500">
                  <a title="Delete" onClick={() => {}}>
                    Delete
                  </a>
                </li>
              </ul>
            </div>
          </div>
        ))}

      <div ref={ref} />
    </div>
  );
}
