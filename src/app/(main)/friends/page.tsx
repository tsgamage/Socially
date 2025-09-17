"use client";
import { useState } from "react";
import SuggestedFriendCard from "@/components/Friends/SuggestedFriendCard";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  toggleUserFollowRequestById,
  getAllFriends,
  getFriendRequests,
  getSuggestedFriends,
  acceptFriendRequest,
  unfollowUserById,
  sendFriendRequestByUsername,
} from "@/actions/user.actions";
import FriendRequestCard from "@/components/Friends/FriendRequestCard";
import FriendCard from "@/components/Friends/FriendCard";
import FriendsSearch from "@/components/Friends/FriendsSearch";
import FriendsTabs from "@/components/Friends/FriendsTabs";

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState("suggested");
  const queryClient = useQueryClient();

  const { data: suggestedFriends } = useQuery({
    queryKey: ["friends", "suggested"],
    queryFn: async () => await getSuggestedFriends(),
  });

  const { data: allFriends } = useQuery({
    queryKey: ["friends", "all"],
    queryFn: async () => await getAllFriends(),
  });

  const { data: allRequests } = useQuery({
    queryKey: ["friends", "requests"],
    queryFn: async () => await getFriendRequests(),
  });

  const { mutate: toggleUserFollow } = useMutation({
    mutationFn: async (followerId: string) => await toggleUserFollowRequestById(followerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends", "requests"] });
      queryClient.invalidateQueries({ queryKey: ["friends", "all"] });
    },
  });
  const { mutate: unfollowUser } = useMutation({
    mutationFn: async (followId: string) => await unfollowUserById(followId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends", "all"] });
    },
  });
  const { mutate: acceptRequest } = useMutation({
    mutationFn: async (requestId: string) => await acceptFriendRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends", "requests"] });
      queryClient.invalidateQueries({ queryKey: ["friends", "all"] });
    },
  });
  const {
    mutate: sendFriendRequestWithUsername,
    data,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async (username: string) => await sendFriendRequestByUsername(username),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends", "all"] });
      queryClient.invalidateQueries({ queryKey: ["friends", "requests"] });
      queryClient.invalidateQueries({ queryKey: ["friends", "suggested"] });
    },
  });

  return (
    <div className="sm:p-4 max-w-6xl p-2 mx-auto w-full">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Friends</h1>
        <p className="text-sm sm:text-base text-base-content/60">Hang with your amazing friends!</p>
      </div>

      <FriendsSearch
        isError={isError}
        isSending={isPending}
        error={error?.message as string}
        successMessage={data?.message as string}
        placeholder="Send friend request ..."
        onSubmit={sendFriendRequestWithUsername}
      />

      <FriendsTabs
        active={activeTab as any}
        onChange={(t) => setActiveTab(t)}
        counts={{ suggested: suggestedFriends?.length, friends: allFriends?.length, requests: allRequests?.length }}
      />

      {/* Active Tab Label */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-semibold capitalize">
          {activeTab === "suggested" && "People You May Know"}
          {activeTab === "friends" && "Your Friends"}
          {activeTab === "requests" && "Friend Requests"}
        </h2>
        <span className="text-xs sm:text-sm text-base-content/60">
          {activeTab === "suggested" && `${suggestedFriends && suggestedFriends.length} suggestions`}
          {activeTab === "friends" && `${allFriends?.length} friends`}
          {activeTab === "requests" && `${allRequests?.length} requests`}
        </span>
      </div>

      {/* Content */}

      {/* <div className="flex flex-col items-center justify-center py-12 text-center">
        <Users size={48} className="text-base-content/30 mb-4" />
        <p className="text-base-content/60">No {activeTab} found</p>
        <p className="text-sm text-base-content/40 mt-1">
          {searchQuery ? "Try a different search term" : `You don't have any ${activeTab} yet`}
        </p>
      </div> */}

      <div className="flex flex-col gap-2 sm:gap-3 mt-4 sm:mt-6">
        {activeTab === "suggested" &&
          suggestedFriends &&
          suggestedFriends.map((user) => (
            <SuggestedFriendCard
              key={user.username}
              user={user}
              onFollow={() => {
                toggleUserFollow(user._id as string);
                user.requestSended = true;
              }}
              type="suggested"
              followed={user.requestSended}
            />
          ))}
        {activeTab === "requests" &&
          allRequests &&
          allRequests.map((request) => (
            <FriendRequestCard
              key={request.receiver.username}
              request={request}
              onCancelFollow={() => {
                toggleUserFollow(request.receiver._id as string);
                if (suggestedFriends) {
                  const idx = suggestedFriends.findIndex((m) => m._id === request.receiver._id);
                  if (idx !== -1) {
                    suggestedFriends[idx].requestSended = false;
                  }
                }
              }}
              onAcceptReq={acceptRequest}
              onRejectReq={() => {}}
            />
          ))}
        {activeTab === "friends" &&
          allFriends &&
          allFriends.map((friend) => (
            <FriendCard
              key={friend.follower.username + friend.following.username}
              friend={friend}
              onUnfollow={unfollowUser}
              toggleFollow={toggleUserFollow}
            />
          ))}
      </div>
    </div>
  );
}
