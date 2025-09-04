"use client";
import { getPostById } from "@/actions/post.actions";
import SinglePostModal from "@/components/Home/SinglePostView/SinglePostModal";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";

import React from "react";

export default function SinglePost({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = React.use(params);
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const initialImage: number = searchParams.get("initialImage") as unknown as number;

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostById(postId),
  });

  let content;
  if (view === "comments") {
    content = (
      <SinglePostModal post={post} onClose={() => redirect("/")} showCommens initialImageIndex={initialImage - 1} />
    );
  } else {
    content = <SinglePostModal post={post} onClose={() => redirect("/")} initialImageIndex={initialImage - 1} />;
  }

  return (
    <div>
      {isLoading && (
        <div className="flex flex-col items-center justify-center mt-10">
          <Loader2Icon className="animate-spin mb-2" />
          <p>Loading...</p>
        </div>
      )}

      {post && content}
    </div>
  );
}
