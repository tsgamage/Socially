"use client";
import { createPost } from "@/actions/post.actions";
import Image from "next/image";
import React, { useActionState } from "react";

export default function CreatePost() {
  const [formState, formAction] = useActionState(createPost, {
    success: false,
    message: "",
    content: "",
  });

  return (
    <div className="card bg-base-200 shadow-xl border border-base-content/20 mb-4">
      <div className="card-body">
        <form action={formAction}>
          <div className="flex items-center mb-4">
            <div className="avatar mr-4">
              <div className="w-12 rounded-full">
                <Image
                  src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                  alt="User Avatar"
                  width={48}
                  height={48}
                />
              </div>
            </div>
            <textarea
              className="textarea textarea-bordered flex-grow"
              name="content"
              placeholder="What's on your mind?"
              defaultValue={formState.content}
            ></textarea>
          </div>
          {/* Image preview area */}
          <div className="grid grid-cols-2 gap-2 mb-4">{/* Placeholder for image previews */}</div>
          <div className="card-actions justify-between items-center mt-4">
            <input
              type="file"
              className="file-input file-input-bordered w-full max-w-xs"
              title="Image Input"
            />
            <button type="submit" className="btn btn-primary">
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
