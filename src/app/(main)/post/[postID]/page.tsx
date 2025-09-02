"use client";
import { getPostById } from "@/actions/post.actions";
import SinglePostModal from "@/components/main/SinglePostModal";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";

// Reusing dummyPosts for content
const dummyPosts = [
  {
    _id: "68b06482da6cda4e4e360d97",
    user: "68b03eeaef03cebcdbfc5cbe",
    content: "Princessssssssssssssssss 🤍",
    images: [
      "https://i.pinimg.com/736x/f7/25/17/f7251743d24deb52f2aec3173bf58923.jpg",
      "https://www.pinterest.com/pin/3729612268517871/",
    ],
    commentsCount: 0,
    votesCount: 0,
    visibility: "public",
    createdAt: "2025-08-28T14:15:30.479Z",
    updatedAt: "2025-08-28T14:15:30.479Z",
    __v: 0,
  },
];

import React from "react";

export default function SinglePost({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = React.use(params);
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const initialImage: number = searchParams.get("initialImage") as unknown as number;
  console.log("view", view);
  console.log("initialImage", initialImage);

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
