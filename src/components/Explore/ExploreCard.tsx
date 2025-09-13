import { IFetchedPost } from "@/lib/types/modals.type";
import { ArrowBigUpDash } from "lucide-react";
import Image from "next/image";

type Props = {
  post: IFetchedPost;
  imageIndex?: number;
  onClick: (postId: string, imageIndex: number) => void;
};

export default function ExploreCard({ post, onClick, imageIndex = 0 }: Props) {
  return (
    <div
      key={post.id}
      className={`relative overflow-hidden rounded-xl cursor-pointer group `}
      onClick={() => onClick(post._id as string, imageIndex)}
    >
      <Image
        src={post.images[imageIndex]}
        alt={post.user.username + post.content || ""}
        quality={75}
        sizes="300px"
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-500"
      />

      {/* Gradient overlay */}
      {/* Top and bottom gradient overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Top gradient */}
        {post.content && (
          <div className="absolute top-0 left-0 right-0 h-2/3 bg-gradient-to-b from-black/80 via-transparent to-transparent" />
        )}
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>

      {/* Content overlay */}
      {post.content && (
        <p
          title={post.content}
          className="absolute top-0 w-full truncate text-sm p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          {post.content}
        </p>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center truncate w-3/4">
            <div className="avatar mr-2">
              <div className="w-6 h-6 rounded-full ring-1 ring-white/30">
                <Image
                  src={post.user.profilePic}
                  alt={post.user.username}
                  width={24}
                  height={24}
                  className="object-cover"
                />
              </div>
            </div>
            <span title={post.user.username} className="font-medium text-sm truncate">
              {post.user.username}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs bg-black/30 px-2 py-1 rounded-full">
            <ArrowBigUpDash className={post.vote === 1 ? "text-blue-500" : ""} size={18} />

            <span>{post.votesCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
