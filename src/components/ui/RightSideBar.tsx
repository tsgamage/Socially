"use client";
import Image from "next/image";
import { UserPlus, ChevronRight } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSuggestedFriends, toggleUserFollowRequestById } from "@/actions/user.actions";
import { IFetchedSuggestedFriends } from "@/lib/types/modals.type";
import { useState } from "react";

const SideBarFriendCard = ({
  user,
  toggleFollow,
}: {
  user: IFetchedSuggestedFriends;
  toggleFollow: (userId: string) => void;
}) => {
  const [followClicked, setFollowClicked] = useState(false);
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-base-200 transition-colors duration-200">
      <div className="flex items-center space-x-3">
        <div className="avatar">
          <div className="w-10 h-10 rounded-full">
            <Image src={user.profilePic} alt={user.username} width={40} height={40} className="object-cover" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{user.username}</span>
        </div>
      </div>
      {followClicked ? (
        <button
          className="btn btn-dash btn-xs rounded-full"
          onClick={() => {
            setFollowClicked(false);
            toggleFollow(user._id as string);
          }}
        >
          Cancel
        </button>
      ) : (
        <button
          className="btn btn-primary btn-xs rounded-full"
          onClick={() => {
            setFollowClicked(true);
            toggleFollow(user._id as string);
          }}
        >
          Follow
        </button>
      )}
    </div>
  );
};

export default function RightSideBar() {
  const queryClient = useQueryClient();

  const { mutate: toggleUserFollow } = useMutation({
    mutationFn: async (followerId: string) => await toggleUserFollowRequestById(followerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends", "requests"] });
      queryClient.invalidateQueries({ queryKey: ["friends", "all"] });
    },
  });
  const { data: suggestedFriends } = useQuery({ queryKey: ["friends", "suggested"], queryFn: getSuggestedFriends });

  return (
    <>
      {/* Sidebar */}
      <div
        id="right-sidebar"
        className={`
          hidden sm:flex  lg:sticky top-0 right-0 h-full lg:h-screen
          w-80 max-w-[85vw] lg:max-w-none
          bg-base-200 border-l border-base-content/10
          transform transition-transform duration-300 ease-in-out z-50 lg:z-auto
           flex-col`}
      >
        {/* Suggestions Card */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-base-100 rounded-xl shadow-sm p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <UserPlus size={18} />
                Suggestions For You
              </h3>
              <span className="badge badge-primary badge-sm">{suggestedFriends?.length}</span>
            </div>

            {suggestedFriends && suggestedFriends.length === 0 ? (
              <div className="text-center py-4 text-base-content/60">
                <p>No suggestions found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {suggestedFriends &&
                  suggestedFriends.map((user) => (
                    <SideBarFriendCard key={user.username} user={user} toggleFollow={toggleUserFollow} />
                  ))}
              </div>
            )}
          </div>

          {/* Additional Cards (Placeholder for future content) */}
          <div className="bg-base-100 rounded-xl shadow-sm p-4 mb-4">
            <h3 className="font-semibold text-lg mb-3">Trending Topics</h3>
            <div className="space-y-2">
              {["Technology", "Travel", "Food", "Fitness", "Art"].map((topic, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-2 rounded hover:bg-base-200 transition-colors"
                >
                  <span className="text-sm">#{topic}</span>
                  <span className="text-xs text-base-content/60">2.5k posts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Another placeholder card */}
          <div className="bg-base-100 rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-lg mb-3">Recent Activity</h3>
            <div className="text-center py-4 text-base-content/60">
              <p>No recent activity</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
