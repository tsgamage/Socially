import { IFetchedFollow } from "@/lib/types/modals.type";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

type Props = {
  friend: IFetchedFollow;
  onUnfollow: (followId: string) => void;
  toggleFollow: (followerId: string) => void;
};

export default function FriendCard({ friend, onUnfollow, toggleFollow }: Props) {
  const { user } = useUser();

  return (
    <>
      {friend.follower.clerkId === user?.id && (
        <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors duration-200">
          <div className="flex items-center space-x-3 lg:space-x-4 truncate">
            <div className="avatar">
              <div className="w-10 h-10 lg:w-16 lg:h-16 rounded-full relative">
                <Image src={friend.following.profilePic} alt={friend.following.username} width={64} height={64} />
              </div>
            </div>
            <div className="flex flex-col">
              <Link href={`/profile/${friend.following.username}`} className="font-semibold lg:text-lg hover:underline">
                {friend.following.name}
              </Link>
              <p className="text-sm lg:text-base text-base-content/70">@{friend.following.username}</p>
              <p className="text-xs lg:text-sm text-base-content/60">{`Note: ${friend.following.note}`}</p>
            </div>
          </div>
          <div className="flex flex-shrink-0 gap-2 ml-2">
            <button className="btn btn-dash btn-sm lg:btn-md" onClick={() => onUnfollow(friend._id as string)}>
              UnFollow
            </button>
            {friend.isMutual && (
              <button className="btn btn-primary btn-sm lg:btn-md" onClick={() => {}}>
                Message
              </button>
            )}
          </div>
        </div>
      )}
      {friend.follower.clerkId !== user?.id && (
        <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors duration-200">
          <div className="flex items-center space-x-3 lg:space-x-4 truncate">
            <div className="avatar">
              <div className="w-10 h-10 lg:w-16 lg:h-16 rounded-full relative">
                <Image src={friend.follower.profilePic} alt={friend.follower.username} width={64} height={64} />
              </div>
            </div>
            <div className="flex flex-col">
              <Link href={`/profile/${friend.follower.username}`} className="font-semibold lg:text-lg hover:underline">
                {friend.follower.name}
              </Link>
              <p className="text-sm lg:text-base text-base-content/70">@{friend.follower.username}</p>

              <p className="text-xs lg:text-sm text-base-content/60">{friend.follower.followersCount} followers</p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="flex space-x-2 lg:space-x-3 ml-2">
              <button
                className="btn btn-dash btn-sm lg:btn-md"
                onClick={() => toggleFollow(friend.follower._id as string)}
              >
                Follow Back
              </button>
              {friend.isMutual && (
                <button className="btn btn-primary btn-sm lg:btn-md" onClick={() => {}}>
                  Message
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
