import { giveDownvote, giveUpvote, toggleSavePost } from "@/actions/post.actions";
import { IFetchedPost } from "@/lib/types/modals.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowBigUpDash, ArrowBigDownDash, Bookmark, MessageSquareOff, MessageSquareMore } from "lucide-react";

type Props = { post: IFetchedPost; showCommens: boolean; isMobile: boolean; onToggleComments: () => void };

export default function Actions({ post, isMobile, showCommens, onToggleComments }: Props) {
  const queryClient = useQueryClient();

  const { mutate: giveUpvoteForPost } = useMutation({
    mutationFn: giveUpvote,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Use functional update to avoid unnecessary array copies
      const previousPosts = queryClient.getQueryData<IFetchedPost[]>(["posts"]);
      const previousPost = queryClient.getQueryData<IFetchedPost>(["post", postId]);

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

      queryClient.setQueryData<IFetchedPost>(["post", postId], (oldPost) => {
        if (!oldPost) return oldPost;
        if (oldPost.vote === 1) {
          return { ...oldPost, votesCount: oldPost.votesCount - 1, vote: 0 } as IFetchedPost;
        } else if (oldPost.vote === -1) {
          return { ...oldPost, votesCount: oldPost.votesCount + 2, vote: 1 } as IFetchedPost;
        } else {
          return { ...oldPost, votesCount: oldPost.votesCount + 1, vote: 1 } as IFetchedPost;
        }
      });

      return { oldPosts: previousPosts, oldPost: previousPost };
    },
    onError: (err, postId, context) => {
      // Rollback to previous state if error
      queryClient.setQueryData(["posts"], context?.oldPosts);
      queryClient.setQueryData(["post", postId], context?.oldPost);
    },
    onSettled: () => {
      // Optionally revalidate, but for efficiency, you may want to debounce or batch this
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", post._id] });
    },
  });

  const { mutate: giveDownvoteForPost } = useMutation({
    mutationFn: giveDownvote,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Use functional update to avoid unnecessary array copies
      const previousPosts = queryClient.getQueryData<IFetchedPost[]>(["posts"]);
      const previousPost = queryClient.getQueryData<IFetchedPost>(["post", postId]);

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

      queryClient.setQueryData<IFetchedPost>(["post", postId], (oldpost) => {
        if (!oldpost) return oldpost;
        if (oldpost.vote === -1) {
          return { ...oldpost, votesCount: oldpost.votesCount + 1, vote: 0 } as IFetchedPost;
        } else if (oldpost.vote === 1) {
          return { ...oldpost, votesCount: oldpost.votesCount - 2, vote: -1 } as IFetchedPost;
        } else {
          return { ...oldpost, votesCount: oldpost.votesCount - 1, vote: -1 } as IFetchedPost;
        }
      });

      return { oldPosts: previousPosts, oldPost: previousPost };
    },
    onError: (err, postId, context) => {
      // Rollback to previous state if error
      queryClient.setQueryData(["posts"], context?.oldPosts);
      queryClient.setQueryData(["post", postId], context?.oldPost);
    },

    onSettled: () => {
      // Optionally revalidate, but for efficiency, you may want to debounce or batch this
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", post._id] });
    },
  });

  const { mutate: togglePostSave } = useMutation({
    mutationFn: toggleSavePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const allPosts: IFetchedPost[] | undefined = queryClient.getQueryData(["posts"]);
      const oldPost = queryClient.getQueryData(["post", postId]) as IFetchedPost;

      const updatedPosts = allPosts?.map((p) => (p._id === postId ? { ...p, isSaved: !p.isSaved } : p));

      queryClient.setQueryData(["posts"], updatedPosts);
      queryClient.setQueryData(["post", postId], { ...oldPost, isSaved: !oldPost.isSaved });
      return { oldPosts: allPosts, oldPost };
    },

    onError: (err, postId, context) => {
      queryClient.setQueryData(["posts"], context!.oldPosts);
      queryClient.setQueryData(["post", postId], context!.oldPost);
    },

    onSettled: (data, error, postId) => {
      queryClient.invalidateQueries({ queryKey: ["posts", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  return (
    <div className="p-3">
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
          <div className="tooltip" data-tip={showCommens ? "Hide Comments" : "Show Comments"}>
            {isMobile && (
              <button
                title={showCommens ? "Hide Comments" : "Show Comments"}
                type="button"
                className="flex items-center gap-2 bg-gray-900/70 p-2 rounded-full hover:bg-gray-800 cursor-pointer"
                onClick={onToggleComments}
              >
                {showCommens ? <MessageSquareOff size={24} /> : <MessageSquareMore size={24} />}

                {post && post.commentsCount > 0 && <p className="text-sm font-semibold mb-1">{post.commentsCount}</p>}
              </button>
            )}
          </div>
        </div>
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
      </div>
    </div>
  );
}
