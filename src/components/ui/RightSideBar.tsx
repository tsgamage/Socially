"use client";
import Image from "next/image";
import { useState } from "react";
import { UserPlus, ChevronRight } from "lucide-react";

const dummyUsers = [
  {
    username: "john_doe",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    mutualFriends: 12,
  },
  {
    username: "jane_doe",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    mutualFriends: 8,
  },
  {
    username: "peter_jones",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    mutualFriends: 3,
  },
  {
    username: "susan_smith",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    mutualFriends: 5,
  },
  {
    username: "william_brown",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026707d",
    mutualFriends: 7,
  },
];

export default function RightSideBar() {
  const [searchQuery, setSearchQuery] = useState("");

  // Close sidebar when clicking outside on mobile

  const filteredUsers = dummyUsers.filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase()));

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
              <span className="badge badge-primary badge-sm">{filteredUsers.length}</span>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="text-center py-4 text-base-content/60">
                <p>No suggestions found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredUsers.map((user, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-base-200 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="w-10 h-10 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
                          <Image
                            src={user.avatar}
                            alt={user.username}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{user.username}</span>
                        <span className="text-xs text-base-content/60">{user.mutualFriends} mutual friends</span>
                      </div>
                    </div>
                    <button className="btn btn-primary btn-xs rounded-full">Follow</button>
                  </div>
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

        {/* Footer */}
        <div className="p-4 border-t border-base-content/10">
          <button className="btn btn-ghost w-full justify-between text-xs">
            See more suggestions
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </>
  );
}
