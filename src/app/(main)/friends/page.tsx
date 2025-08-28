"use client";
import { useState } from "react";
import FriendCard from "@/components/Friends/FriendCard";

const suggestedFriends = [
  {
    name: "Alice",
    username: "alice_w",
    avatar: "https://i.pravatar.cc/150?u=alice",
    followers: 1200,
    type: "suggested",
  },
  {
    name: "Bob",
    username: "bob_s",
    avatar: "https://i.pravatar.cc/150?u=bob",
    followers: 850,
    type: "suggested",
  },
  {
    name: "Charlie",
    username: "charlie_m",
    avatar: "https://i.pravatar.cc/150?u=charlie",
    followers: 2100,
    type: "suggested",
  },
  {
    name: "Diana",
    username: "diana_p",
    avatar: "https://i.pravatar.cc/150?u=diana",
    followers: 500,
    type: "suggested",
  },
];

const myFriends = [
  {
    name: "Eve",
    username: "eve_a",
    avatar: "https://i.pravatar.cc/150?u=eve",
    followers: 3000,
    onlineStatus: true,
    type: "friend",
  },
  {
    name: "Frank",
    username: "frank_l",
    avatar: "https://i.pravatar.cc/150?u=frank",
    followers: 1500,
    onlineStatus: false,
    type: "friend",
  },
  {
    name: "Grace",
    username: "grace_h",
    avatar: "https://i.pravatar.cc/150?u=grace",
    followers: 900,
    onlineStatus: true,
    type: "friend",
  },
];

const requests = [
  {
    name: "Harry",
    username: "harry_k",
    avatar: "https://i.pravatar.cc/150?u=harry",
    followers: 700,
    type: "pending",
  },
  {
    name: "Ivy",
    username: "ivy_j",
    avatar: "https://i.pravatar.cc/150?u=ivy",
    followers: 1100,
    type: "sent",
  },
];

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState("suggested");

  const renderContent = () => {
    switch (activeTab) {
      case "suggested":
        return (
          <div className="grid grid-cols-1 gap-4 mt-4">
            {suggestedFriends.map((user) => (
              <FriendCard key={user.username} user={user} />
            ))}
          </div>
        );
      case "friends":
        return (
          <div className="grid grid-cols-1 gap-4 mt-4">
            {myFriends.map((user) => (
              <FriendCard key={user.username} user={user} />
            ))}
          </div>
        );
      case "requests":
        return (
          <div className="grid grid-cols-1 gap-4 mt-4">
            {requests.map((user) => (
              <FriendCard key={user.username} user={user} />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <div className="flex w-full justify-center mb-4">
        <a
          className={`btn btn-ghost btn-lg font-bold ${activeTab === "suggested" ? "btn-active" : ""}`}
          onClick={() => setActiveTab("suggested")}
        >
          Suggested
        </a>
        <a
          className={`btn btn-ghost btn-lg font-bold ${activeTab === "friends" ? "btn-active" : ""}`}
          onClick={() => setActiveTab("friends")}
        >
          Your Friend
        </a>
        <a
          className={`btn btn-ghost btn-lg font-bold ${activeTab === "requests" ? "btn-active" : ""}`}
          onClick={() => setActiveTab("requests")}
        >
          Requests
        </a>
      </div>

      {renderContent()}
    </div>
  );
}
