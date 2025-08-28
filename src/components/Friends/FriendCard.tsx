import Image from "next/image";
import Link from "next/link";

export interface UserData {
  name: string;
  username: string;
  avatar: string;
  followers: number;
  onlineStatus?: boolean;
  type: "suggested" | "friend" | "sent" | "pending";
}

interface FriendCardProps {
  user: UserData;
}

export default function FriendCard({ user }: FriendCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors duration-200">
      <div className="flex items-center space-x-3 lg:space-x-4">
        <div className="avatar">
          <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full relative">
            <Image src={user.avatar} alt={user.username} width={64} height={64} />
            {user.onlineStatus !== undefined && (
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 lg:w-4 lg:h-4 rounded-full border-2 border-base-200 ${user.onlineStatus ? "bg-green-500" : "bg-gray-500"}`}
              ></div>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <Link href={`/profile/${user.username}`} className="font-semibold lg:text-lg hover:underline">
            {user.name}
          </Link>
          <p className="text-sm lg:text-base text-base-content/70">@{user.username}</p>
          {user.type === "suggested" && (
            <p className="text-xs lg:text-sm text-base-content/60">Suggested for you</p>
          )}
          <p className="text-xs lg:text-sm text-base-content/60">{user.followers} followers</p>
        </div>
      </div>
      <div className="flex-shrink-0">
        {user.type === "suggested" && (
          <button className="btn btn-primary btn-sm lg:btn-md">Follow</button>
        )}
        {user.type === "friend" && (
          <button className="btn btn-outline btn-sm lg:btn-md">Message</button>
        )}
        {user.type === "sent" && (
          <button className="btn btn-warning btn-sm lg:btn-md">Cancel Request</button>
        )}
        {user.type === "pending" && (
          <div className="flex space-x-2 lg:space-x-3">
            <button className="btn btn-success btn-sm lg:btn-md">Accept</button>
            <button className="btn btn-error btn-sm lg:btn-md">Reject</button>
          </div>
        )}
      </div>
    </div>
  );
}
