"use client";
import Image from "next/image";
import { useState } from "react";
import ImageModal from "@/components/main/ImageModal"; // Corrected import path

const dummyUserProfile = {
  banner: "https://picsum.photos/id/1047/1200/300",
  profilePhoto: "https://i.pravatar.cc/150?u=profileuser",
  name: "John Doe",
  username: "john_doe",
  bio: "Passionate photographer and nature lover. Exploring the world one click at a time. 📸🌲",
  status: "Chilling 😌",
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

  const renderImageGrid = (images: typeof dummyExploreImages) => (
    <div className="grid grid-cols-3 gap-1 mt-4">
      {images.map((image, index) => (
        <div
          key={index}
          className={`relative aspect-square overflow-hidden cursor-pointer ${image.span}`}
          onClick={() => handleImageClick(image.src)}
        >
          <Image src={image.src} alt={image.alt} layout="fill" objectFit="cover" />
          {/* Optional: Add hover overlay for profile page if needed */}
        </div>
      ))}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "posts":
        // Filter some images for posts
        return renderImageGrid(dummyExploreImages.filter((_, i) => i % 3 === 0));
      case "saved":
        // Filter some images for saved
        return renderImageGrid(dummyExploreImages.filter((_, i) => i % 2 === 0));
      case "liked":
        // Filter some images for liked
        return renderImageGrid(dummyExploreImages.filter((_, i) => i % 4 === 0));
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        {" "}
        {/* Removed card styling */}
        <figure className="relative h-48 w-full">
          <Image src={dummyUserProfile.banner} alt="Banner" layout="fill" objectFit="cover" />
        </figure>
        <div className="card-body -mt-20 items-center text-center">
          <div className="avatar relative mb-4">
            <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <Image
                src={dummyUserProfile.profilePhoto}
                alt="Profile Photo"
                width={128}
                height={128}
              />
            </div>
            {/* Status below avatar */}
            <div className="badge badge-lg badge-primary text-white p-2 mt-2">
              {dummyUserProfile.status}
            </div>
          </div>

          <h2 className="card-title text-2xl font-bold">{dummyUserProfile.name}</h2>
          <p className="text-base-content/70">@{dummyUserProfile.username}</p>
          <p className="text-sm text-base-content/60 mb-4">
            Last online: {dummyUserProfile.lastOnline}
          </p>

          <p className="mb-4 text-center max-w-md">{dummyUserProfile.bio}</p>

          <div className="flex justify-center space-x-8 mb-4">
            <div className="text-center">
              <div className="stat-value text-lg">{dummyUserProfile.followers}</div>
              <div className="stat-title">Followers</div>
            </div>
            <div className="text-center">
              <div className="stat-value text-lg">{dummyUserProfile.following}</div>
              <div className="stat-title">Following</div>
            </div>
            <div className="text-center">
              <div className="stat-value text-lg">{dummyUserProfile.postsCount}</div>
              <div className="stat-title">Posts</div>
            </div>
            <div className="text-center">
              <div className="stat-value text-lg">{dummyUserProfile.savedPostsCount}</div>
              <div className="stat-title">Saved</div>
            </div>
            <div className="text-center">
              <div className="stat-value text-lg">{dummyUserProfile.likedPostsCount}</div>
              <div className="stat-title">Liked</div>
            </div>
          </div>

          <div className="card-actions">
            <button className="btn btn-primary">Edit Profile</button>
          </div>
        </div>
      </div>

      {/* Tabs for Posts, Saved, Liked */}
      <div className="flex w-full justify-center mt-8">
        <a
          className={`btn btn-ghost btn-lg font-bold ${activeTab === "posts" ? "btn-active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </a>
        <a
          className={`btn btn-ghost btn-lg font-bold ${activeTab === "saved" ? "btn-active" : ""}`}
          onClick={() => setActiveTab("saved")}
        >
          Saved
        </a>
        <a
          className={`btn btn-ghost btn-lg font-bold ${activeTab === "liked" ? "btn-active" : ""}`}
          onClick={() => setActiveTab("liked")}
        >
          Liked
        </a>
      </div>

      {renderTabContent()}

      {selectedImage && (
        <ImageModal src={selectedImage} alt="Full screen image" onClose={handleCloseModal} />
      )}
    </div>
  );
}
