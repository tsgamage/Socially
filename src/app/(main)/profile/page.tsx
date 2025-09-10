"use client";
import Image from "next/image";
import { useState } from "react";
import { Edit3, Camera, Bookmark, Heart, Grid3X3 } from "lucide-react";

const dummyUserProfile = {
  banner: "https://picsum.photos/id/1047/1200/400",
  profilePhoto: "https://i.pravatar.cc/150?u=profileuser",
  name: "John Doe",
  username: "john_doe",
  bio: "Passionate photographer and nature lover. Exploring the world one click at a time. 📸🌲",
  status: "online", // Can be: online, idle, dnd, offline
  lastOnline: "2 hours ago",
  followers: 1234,
  following: 567,
  postsCount: 89,
  savedPostsCount: 42,
  likedPostsCount: 156,
};

// Reusing dummyExploreImages for content in tabs
const dummyExploreImages = Array.from({ length: 30 }).map((_, i) => ({
  src: `https://picsum.photos/id/${100 + i}/500/500`,
  alt: `Explore image ${i + 1}`,
  span: Math.random() > 0.8 ? "col-span-2 row-span-2" : "", // Randomly make some images larger
  user: {
    name: `User ${i + 1}`,
    avatar: `https://i.pravatar.cc/150?u=explore${i}`,
  },
  caption: `This is a beautiful place! #${i + 1}`,
}));

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "idle":
        return "bg-yellow-500";
      case "dnd":
        return "bg-red-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "Online";
      case "idle":
        return "Idle";
      case "dnd":
        return "Do Not Disturb";
      case "offline":
        return "Offline";
      default:
        return "Offline";
    }
  };

  const renderImageGrid = (images: typeof dummyExploreImages) => (
    <div className="grid grid-cols-3 gap-1 mt-4">
      {images.map((image, index) => (
        <div
          key={index}
          className={`relative aspect-square overflow-hidden cursor-pointer group ${image.span}`}
          onClick={() => handleImageClick(image.src)}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </div>
      ))}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "posts":
        return renderImageGrid(dummyExploreImages.filter((_, i) => i % 3 === 0));
      case "saved":
        return renderImageGrid(dummyExploreImages.filter((_, i) => i % 2 === 0));
      case "liked":
        return renderImageGrid(dummyExploreImages.filter((_, i) => i % 4 === 0));
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* Banner */}
      <div className="relative h-48 w-full rounded-t-lg overflow-hidden">
        <Image src={dummyUserProfile.banner} alt="Banner" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
        <button className="absolute top-4 right-4 btn btn-sm btn-circle bg-base-100/80 backdrop-blur-sm">
          <Camera size={16} />
        </button>
      </div>

      {/* Profile Content */}
      <div className="px-4 -mt-16 relative z-10">
        {/* Avatar with Discord-style status */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative mb-2">
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-base-100">
              <Image
                src={dummyUserProfile.profilePhoto}
                alt="Profile Photo"
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
            {/* Discord-style status indicator */}
            <div
              className={`absolute bottom-2 right-2 w-6 h-6 rounded-full ring-2 ring-base-100 ${getStatusColor(dummyUserProfile.status)}`}
            ></div>
          </div>

          {/* Status text */}
          <div className="badge badge-md badge-ghost mb-2">{getStatusText(dummyUserProfile.status)}</div>
        </div>

        {/* Profile Info */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">{dummyUserProfile.name}</h1>
          <p className="text-base-content/70">@{dummyUserProfile.username}</p>
          <p className="text-sm text-base-content/60 mb-2">Last online: {dummyUserProfile.lastOnline}</p>

          <p className="mb-4 text-center max-w-md mx-auto">{dummyUserProfile.bio}</p>

          {/* Stats */}
          <div className="flex justify-center space-x-6 mb-4">
            <div className="text-center">
              <div className="font-bold text-lg">{dummyUserProfile.followers.toLocaleString()}</div>
              <div className="text-sm text-base-content/70">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{dummyUserProfile.following.toLocaleString()}</div>
              <div className="text-sm text-base-content/70">Following</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{dummyUserProfile.postsCount}</div>
              <div className="text-sm text-base-content/70">Posts</div>
            </div>
          </div>

          <button className="btn btn-primary btn-sm gap-2">
            <Edit3 size={16} />
            Edit Profile
          </button>
        </div>

        {/* Tabs */}
        <div className="tabs tabs-boxed justify-center bg-base-200/50 backdrop-blur-sm mb-6">
          <a className={`tab gap-2 ${activeTab === "posts" ? "tab-active" : ""}`} onClick={() => setActiveTab("posts")}>
            <Grid3X3 size={18} />
            Posts
          </a>
          <a className={`tab gap-2 ${activeTab === "saved" ? "tab-active" : ""}`} onClick={() => setActiveTab("saved")}>
            <Bookmark size={18} />
            Saved
          </a>
          <a className={`tab gap-2 ${activeTab === "liked" ? "tab-active" : ""}`} onClick={() => setActiveTab("liked")}>
            <Heart size={18} />
            Liked
          </a>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>

      {selectedImage && <ImageModal src={selectedImage} alt="Full screen image" onClose={handleCloseModal} />}
    </div>
  );
}
