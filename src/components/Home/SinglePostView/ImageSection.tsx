import { IPost } from "@/lib/types/modals.type";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type Props = {
  post: IPost;
  initialImageIndex: number;
  isMobile: boolean;
};

export default function ImageSection({ post, isMobile, initialImageIndex }: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialImageIndex);

  const images = post.images ?? [];

  // keep index valid if images change
  useEffect(() => {
    setCurrentImageIndex((i) => Math.min(Math.max(i, 0), Math.max(images.length - 1, 0)));
  }, [images.length, setCurrentImageIndex]);

  const handlePrevImage = useCallback(() => {
    if (!images.length) return;
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length, setCurrentImageIndex]);

  const handleNextImage = useCallback(() => {
    if (!images.length) return;
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length, setCurrentImageIndex]);

  return (
    <div
      className={`relative bg-black flex items-center justify-center ${
        isMobile ? "h-80 flex-shrink-0" : "w-1/2 flex-shrink-0"
      }`}
    >
      {images.length > 0 && (
        <div className="relative w-full h-full">
          {/* using key to force remount when src changes (avoids stuck image) */}
          <Image
            key={images[currentImageIndex]}
            src={images[currentImageIndex]}
            alt={`Post image ${currentImageIndex + 1}`}
            fill
            draggable={false}
            className="object-contain select-none"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                title="Previous Image"
                className="btn btn-circle absolute left-2 top-1/2 -translate-y-1/2 z-40 bg-base-100/30 hover:bg-base-100 border-0"
                onClick={handlePrevImage}
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                title="Next Image"
                className="btn btn-circle absolute right-2 top-1/2 -translate-y-1/2 z-40 bg-base-100/30 hover:bg-base-100 border-0"
                onClick={handleNextImage}
              >
                <ChevronRight size={20} />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-30">
                {images.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${i === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
