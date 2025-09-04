import { IPost } from "@/lib/types/modals.type";
import { useUser } from "@clerk/nextjs";
import { formatDistanceToNowStrict } from "date-fns";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Header({ post }: { post: IPost }) {
  const { user } = useUser();

  return (
    <div className="flex items-center p-4 border-b border-base-300 flex-shrink-0">
      <div className="avatar mr-3">
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <Link href={`/profile/${post.user.username}`}>
            <Image
              src={user?.imageUrl || ""}
              alt={user?.username || "User Avatar"}
              width={32}
              height={32}
              className="object-cover"
            />
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div>
          <Link href={`/profile/${post.user.username}`} className="hover:underline hover:text-gray-300">
            <p className="text-sm font-semibold">{post.user.name}</p>
          </Link>
          <p className="text-sm text-gray-400">@{post.user.username}</p>
          <div className="flex">
            <p className="text-xs text-gray-400">{formatDistanceToNowStrict(post.createdAt, { addSuffix: true })}</p>
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
    </div>
  );
}
