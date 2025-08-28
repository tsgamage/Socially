"use client";
import Image from "next/image";
import { useState } from "react";
import ImageModal from "@/components/main/ImageModal";

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

export default function ExplorePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="input input-bordered input-lg w-full"
        />
      </div>

      <div className="grid grid-cols-3 gap-1">
        {dummyExploreImages.map((image, index) => (
          <div
            key={index}
            className={`relative aspect-square overflow-hidden cursor-pointer group ${image.span}`}
            onClick={() => handleImageClick(image.src)}
          >
            <Image src={image.src} alt={image.alt} layout="fill" objectFit="cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
              <div className="flex items-center mb-2">
                <div className="avatar mr-2">
                  <div className="w-8 h-8 rounded-full">
                    <Image src={image.user.avatar} alt={image.user.name} width={32} height={32} />
                  </div>
                </div>
                <span className="font-semibold">{image.user.name}</span>
              </div>
              <p className="text-sm line-clamp-2">{image.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <ImageModal
          src={selectedImage}
          alt="Full screen image"
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

