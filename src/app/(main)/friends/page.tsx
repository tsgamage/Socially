"use client";
import { useState } from "react";
import FriendCard, { UserData } from "@/components/Friends/FriendCard";
import { Users, UserPlus, UserCheck, UserX, Search } from "lucide-react";

const suggestedFriends: UserData[] = [
  {
    name: "Alice Johnson",
    username: "alice_w",
    avatar: "https://i.pravatar.cc/150?u=alice",
    followers: 1200,
    mutualFriends: 15,
    type: "suggested",
  },
  {
    name: "Bob Smith",
    username: "bob_s",
    avatar: "https://i.pravatar.cc/150?u=bob",
    followers: 850,
    mutualFriends: 8,
    type: "suggested",
  },
  {
    name: "Charlie Brown",
    username: "charlie_m",
    avatar: "https://i.pravatar.cc/150?u=charlie",
    followers: 2100,
    mutualFriends: 23,
    type: "suggested",
  },
  {
    name: "Diana Prince",
    username: "diana_p",
    avatar: "https://i.pravatar.cc/150?u=diana",
    followers: 500,
    mutualFriends: 3,
    type: "suggested",
  },
];

const myFriends: UserData[] = [
  {
    name: "Eve Adams",
    username: "eve_a",
    avatar: "https://i.pravatar.cc/150?u=eve",
    followers: 3000,
    onlineStatus: true,
    lastSeen: "2 min ago",
    type: "friend",
  },
  {
    name: "Frank Lewis",
    username: "frank_l",
    avatar: "https://i.pravatar.cc/150?u=frank",
    followers: 1500,
    onlineStatus: false,
    lastSeen: "5 hours ago",
    type: "friend",
  },
  {
    name: "Grace Hopper",
    username: "grace_h",
    avatar: "https://i.pravatar.cc/150?u=grace",
    followers: 900,
    onlineStatus: true,
    lastSeen: "Online now",
    type: "friend",
  },
];

const requests: UserData[] = [
  {
    name: "Harry Kim",
    username: "harry_k",
    avatar: "https://i.pravatar.cc/150?u=harry",
    followers: 700,
    mutualFriends: 2,
    type: "pending",
  },
  {
    name: "Ivy Jones",
    username: "ivy_j",
    avatar: "https://i.pravatar.cc/150?u=ivy",
    followers: 1100,
    mutualFriends: 7,
    type: "sent",
  },
];

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState("suggested");
  const [searchQuery, setSearchQuery] = useState("");

  const renderContent = () => {
    let data = [];
    
    switch (activeTab) {
      case "suggested":
        data = suggestedFriends;
        break;
      case "friends":
        data = myFriends;
        break;
      case "requests":
        data = requests;
        break;
      default:
        data = [];
    }
    
    // Filter based on search query
    const filteredData = data.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Users size={48} className="text-base-content/30 mb-4" />
          <p className="text-base-content/60">No {activeTab} found</p>
          <p className="text-sm text-base-content/40 mt-1">
            {searchQuery ? "Try a different search term" : `You don't have any ${activeTab} yet`}
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3 mt-6">
        {filteredData.map((user) => (
          <FriendCard key={user.username} user={user} />
        ))}
      </div>
    );
  };

  const getTabIcon = (tabName: string) => {
    switch (tabName) {
      case "suggested":
        return <UserPlus size={18} />;
      case "friends":
        return <Users size={18} />;
      case "requests":
        return <UserCheck size={18} />;
      default:
        return <Users size={18} />;
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Friends</h1>
        <p className="text-base-content/60">Connect and manage your friends</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={20} className="text-base-content/40" />
        </div>
        <input
          type="text"
          placeholder="Search friends..."
          className="input input-bordered w-full pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <button
          className={`btn justify-start sm:justify-center flex-1 ${activeTab === "suggested" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setActiveTab("suggested")}
        >
          {getTabIcon("suggested")}
          <span className="ml-2">Suggested</span>
          {activeTab === "suggested" && (
            <span className="badge badge-sm badge-primary ml-2">
              {suggestedFriends.length}
            </span>
          )}
        </button>
        
        <button
          className={`btn justify-start sm:justify-center flex-1 ${activeTab === "friends" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setActiveTab("friends")}
        >
          {getTabIcon("friends")}
          <span className="ml-2">Friends</span>
          {activeTab === "friends" && (
            <span className="badge badge-sm badge-primary ml-2">
              {myFriends.length}
            </span>
          )}
        </button>
        
        <button
          className={`btn justify-start sm:justify-center flex-1 ${activeTab === "requests" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setActiveTab("requests")}
        >
          {getTabIcon("requests")}
          <span className="ml-2">Requests</span>
          {activeTab === "requests" && (
            <span className="badge badge-sm badge-primary ml-2">
              {requests.length}
            </span>
          )}
        </button>
      </div>

      {/* Active Tab Label */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold capitalize">
          {activeTab === "suggested" && "People You May Know"}
          {activeTab === "friends" && "Your Friends"}
          {activeTab === "requests" && "Friend Requests"}
        </h2>
        <span className="text-sm text-base-content/60">
          {activeTab === "suggested" && `${suggestedFriends.length} suggestions`}
          {activeTab === "friends" && `${myFriends.length} friends`}
          {activeTab === "requests" && `${requests.length} requests`}
        </span>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}