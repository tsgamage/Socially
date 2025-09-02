"use client";
import { createPost, PostFormState } from "@/actions/post.actions";
import Image from "next/image";
import React, { useActionState, useRef, useState } from "react";
import { ImageIcon, X } from "lucide-react";
import UserAvatar from "./UserAvatar";
import { QueryClient, useMutation } from "@tanstack/react-query";

export default function CreatePost() {
  const input = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>([]);
  const [textareaValue, setTextareaValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleAddImages(event: React.FormEvent<HTMLInputElement>) {
    const files = event.currentTarget.files;
    if (!files) return;

    if (images.length + files.length > 4) {
      alert(`You can only upload a maximum of 4 images. You have already selected ${images.length}.`);
      return;
    }

    // Process each selected file
    for (const file of Array.from(files)) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (typeof fileReader.result === "string") {
          setImages((prevImages) => [...prevImages, fileReader.result as string]);
        }
      };
      fileReader.readAsDataURL(file);
    }
  }

  function removeImage(index: number) {
    setImages(images.filter((_, i) => i !== index));
  }

  const queryClient = new QueryClient();

  const { mutate } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setImages([]);
      setTextareaValue("");
      setIsExpanded(false);
    },
  });

  const createPostAction = async (preState: PostFormState, formData: FormData) => {
    await mutate(formData);
    return {
      success: false,
      message: "",
      content: "",
    };
  };

  const [formState, formAction] = useActionState(createPostAction, {
    success: false,
    message: "",
    content: "",
  });

  const handleTextareaFocus = () => {
    setIsExpanded(true);
  };

  const handleTextareaBlur = () => {
    // Only collapse if there's no content and no images
    if (!textareaRef.current?.value && images.length === 0) {
      setIsExpanded(false);
    }
  };

  // Function to render images based on count
  const renderImagePreview = () => {
    if (images.length === 0) return null;

    if (images.length === 1) {
      return (
        <div className="relative w-full h-80 rounded-lg overflow-hidden">
          <Image src={images[0]} alt="Preview 1" fill className="object-cover" />
          <button
            title="remove image"
            type="button"
            onClick={() => removeImage(0)}
            className="absolute top-2 right-2 btn btn-circle btn-sm bg-base-100/80 hover:bg-base-100"
          >
            <X size={16} />
          </button>
        </div>
      );
    }

    if (images.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-2 w-full h-80">
          {images.map((img, index) => (
            <div key={index} className="relative rounded-lg overflow-hidden">
              <Image src={img} alt={`Preview ${index + 1}`} fill className="object-cover" />
              <button
                title="remove image"
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 btn btn-circle btn-sm bg-base-100/80 hover:bg-base-100"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      );
    }

    if (images.length >= 3) {
      return (
        <div className="grid grid-cols-2 grid-rows-2 gap-2 w-full h-80">
          {/* First image takes full width of first row */}
          <div className="relative col-span-2 row-span-1 rounded-lg overflow-hidden">
            <Image src={images[0]} alt="Preview 1" fill className="object-cover" />
            <button
              title="remove image"
              type="button"
              onClick={() => removeImage(0)}
              className="absolute top-2 right-2 btn btn-circle btn-sm bg-base-100/80 hover:bg-base-100"
            >
              <X size={16} />
            </button>
          </div>

          {/* Second and third images in second row */}
          <div className="relative rounded-lg overflow-hidden">
            <Image src={images[1]} alt="Preview 2" fill className="object-cover" />
            <button
              title="remove image"
              type="button"
              onClick={() => removeImage(1)}
              className="absolute top-2 right-2 btn btn-circle btn-sm bg-base-100/80 hover:bg-base-100"
            >
              <X size={16} />
            </button>
          </div>

          <div className="relative rounded-lg overflow-hidden">
            <Image src={images[2]} alt="Preview 3" fill className="object-cover" />
            <button
              title="remove image"
              type="button"
              onClick={() => removeImage(2)}
              className="absolute top-2 right-2 btn btn-circle btn-sm bg-base-100/80 hover:bg-base-100"
            >
              <X size={16} />
            </button>

            {/* Show +X overlay if there are more than 3 images */}
            {images.length > 3 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-bold text-lg ml-1">+{images.length - 3}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="card mx-auto xl:w-10/12 bg-base-100 shadow-xl border border-base-content/10 mb-4 p-4">
      <div className="card-body p-0">
        <form action={formAction}>
          <div className="flex items-start gap-3 mb-4">
            {/* User avatar - hidden when expanded */}
            {!isExpanded && <UserAvatar />}

            <textarea
              ref={textareaRef}
              className="textarea textarea-ghost flex-grow resize-none px-4 py-3 rounded-2xl bg-base-200/50 focus:bg-base-200 transition-all"
              name="content"
              placeholder="What's on your mind?"
              defaultValue={formState.content}
              onFocus={handleTextareaFocus}
              onBlur={handleTextareaBlur}
              rows={isExpanded ? 3 : 1}
              onChange={(e) => setTextareaValue(e.target.value)}
            />
          </div>

          {/* Image preview */}
          {images.length > 0 && <div className="mb-4">{renderImagePreview()}</div>}

          <div className="flex justify-between items-center pt-3 border-t border-base-content/10">
            <input
              ref={input}
              type="file"
              className="hidden"
              title="image"
              multiple
              min={1}
              max={4}
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleAddImages}
            />

            <button
              title="add image"
              type="button"
              data-tip="Add image"
              className="btn tooltip tooltip-info btn-ghost btn-circle md:btn-md btn-sm"
              onClick={() => input.current?.click()}
            >
              <ImageIcon size={20} />
            </button>

            <button type="submit" className="btn btn-primary px-6" disabled={textareaValue.length < 5}>
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
