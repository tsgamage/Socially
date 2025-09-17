import { IFetchedSuggestedFriends } from "@/lib/types/modals.type";
import Image from "next/image";
import Link from "next/link";

type Props = { user: IFetchedSuggestedFriends; onFollow: () => void; type: string; followed: boolean };

export default function SuggestedFriendCard({ user, onFollow, type, followed }: Props) {
  return (
    <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors duration-200">
      <div className="flex items-center space-x-3 lg:space-x-4 truncate">
        <div className="avatar">
          <div className="w-10 h-10 lg:w-16 lg:h-16 rounded-full relative">
            <Image src={user.profilePic} alt={user.username} width={64} height={64} />
            {user.lastOnline !== undefined && (
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 lg:w-4 lg:h-4 rounded-full border-2 border-base-200 ${user.lastOnline ? "bg-green-500" : "bg-gray-500"}`}
              ></div>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <Link href={`/profile/${user.username}`} className="font-semibold lg:text-lg hover:underline">
            {user.name}
          </Link>
          <p className="text-sm lg:text-base text-base-content/70">@{user.username}</p>
          {type === "suggested" && <p className="text-xs lg:text-sm text-base-content/60">Suggested for you</p>}
          <p className="text-xs lg:text-sm text-base-content/60">{user.followersCount} followers</p>
        </div>
      </div>
      <div className="flex-shrink-0 ml-2">
        {type === "suggested" && (
          <button className="btn btn-primary btn-sm lg:btn-md" disabled={followed} onClick={onFollow}>
            {followed ? "Follow request sended" : "Follow"}
          </button>
        )}
        {type === "friend" && <button className="btn btn-outline btn-sm lg:btn-md">Message</button>}
      </div>
    </div>
  );
}
