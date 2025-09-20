"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Edit3, Bookmark, Heart, Grid3X3, Pencil } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getUserByUsername } from "@/actions/user.actions";
import { getPrivatePosts, getSavedPosts, getUserPosts } from "@/actions/post.actions";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { IFetchedPost } from "@/lib/types/modals.type";
import PostAndModal from "@/components/ui/PostAndModal";

export default function ProfilePage() {
  const { user } = useUser();
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "private">("posts");
  const [mapData, setMapData] = useState<IFetchedPost[] | undefined>([]);

  const { data: userData } = useQuery({
    queryKey: ["user", username],
    queryFn: async () => await getUserByUsername(username as string),
    enabled: !!username,
    initialData: null,
  });

  const { data: userPosts } = useQuery({
    queryKey: ["posts", username],
    queryFn: async () => await getUserPosts(userData?.data._id as string),
    enabled: !!userData,
  });
  const { data: savedPosts } = useQuery({
    queryKey: ["savedPosts", username],
    queryFn: getSavedPosts,
    enabled: activeTab === "saved",
  });
  const { data: privatePosts } = useQuery({
    queryKey: ["privatePosts", username],
    queryFn: getPrivatePosts,
    enabled: user?.id === userData?.data.clerkId && activeTab === "private",
  });

  useEffect(() => {
    switch (activeTab) {
      case "posts":
        setMapData(userPosts);
        return;
      case "private":
        setMapData(privatePosts);
        return;
      case "saved":
        setMapData(savedPosts);
        return;
    }
  }, [activeTab, setMapData, userPosts, privatePosts, savedPosts]);

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* Banner */}
      <div className="relative h-48 w-full rounded-t-lg overflow-hidden">
        <Image src={userData?.data.bannerPic || "/user/default/user.jpg"} alt="Banner" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
        {user?.id === userData?.data.clerkId && (
          <button className="absolute top-4 right-4 btn btn-sm btn-circle bg-base-100/80 backdrop-blur-sm">
            <Pencil size={16} />
          </button>
        )}
      </div>

      {/* Profile Content */}
      <div className="px-4 -mt-16 relative z-10">
        {/* Avatar with Discord-style status */}
        <div className="flex flex-col items-center ">
          <div className="relative mb-2">
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-base-100">
              <Image
                src={userData?.data.profilePic || "/user/default/user.jpg"}
                alt="Profile Photo"
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
            {/* Discord-style status indicator */}
            <div
              className={`absolute bottom-2 right-2 w-6 h-6 rounded-full ring-2 ring-base-100 border-5 bg-white ${userData?.data.status === "online" ? "border-green-500" : "border-gray-500"}`}
            ></div>
          </div>

          {/* Status text */}
          <div className="badge badge-md badge-ghost mb-2">{userData?.data.note}</div>
        </div>

        {/* Profile Info */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">{userData?.data.name || "User"}</h1>
          <p className="text-base-content/70">@{userData?.data.username || "username"}</p>
          {/* <p className="text-sm text-base-content/60 mb-2">
            Last online: {userData?.data.lastOnline.toString() || "Long time ago"}
          </p> */}

          <p className="mb-4 text-center max-w-md mx-auto">{userData?.data.bio}</p>

          {/* Stats */}
          <div className="flex justify-center space-x-6 mb-4">
            <div className="text-center">
              <div className="font-bold text-lg">{userData?.data.followersCount}</div>
              <div className="text-sm text-base-content/70">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{userData?.data.followingCount}</div>
              <div className="text-sm text-base-content/70">Following</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{userData?.data.postsCount}</div>
              <div className="text-sm text-base-content/70">Posts</div>
            </div>
          </div>

          {user?.id === userData?.data.clerkId && (
            <button className="btn btn-primary btn-sm gap-2">
              <Edit3 size={16} />
              Edit Profile
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="tabs tabs-boxed justify-evenly bg-base-200/50 backdrop-blur-sm mb-6">
          <a className={`tab gap-2 ${activeTab === "posts" ? "tab-active" : ""}`} onClick={() => setActiveTab("posts")}>
            <Grid3X3 size={18} />
            Posts
          </a>
          {user?.id === userData?.data.clerkId && (
            <>
              <a
                className={`tab gap-2 ${activeTab === "saved" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("saved")}
              >
                <Bookmark size={18} />
                Saved
              </a>
              <a
                className={`tab gap-2 ${activeTab === "private" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("private")}
              >
                <Heart size={18} />
                Private
              </a>
            </>
          )}
        </div>
      </div>
      {mapData && <PostAndModal postData={mapData} />}
    </div>
  );
}
