import Image from "next/image";

interface ImageModalProps {
  src: string | null;
  alt: string;
  onClose: () => void;
}

export default function ImageModal({ src, alt, onClose }: ImageModalProps) {
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="relative max-w-screen-lg max-h-screen-lg" onClick={(e) => e.stopPropagation()}>
        <Image src={src} alt={alt} width={1000} height={800} objectFit="contain" />
        <button
          className="absolute top-4 right-4 text-white text-3xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
}
