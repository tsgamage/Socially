import React from "react";

export default function PostContent({ postContent }: { postContent: string }) {
  return (
    <div className="p-4 flex-shrink-0">
      <span className="text-sm">{postContent}</span>
    </div>
  );
}
