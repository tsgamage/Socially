"use client";
import SinglePostModal from "@/components/Home/SinglePostView/SinglePostModal";
import { redirect, useSearchParams } from "next/navigation";
import React from "react";

export default function SinglePost({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = React.use(params);
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const initialImage: number = searchParams.get("initialImage") as unknown as number;

  let content;
  if (view === "comments") {
    content = (
      <SinglePostModal postId={postId} onClose={() => redirect("/")} showCommens initialImageIndex={initialImage - 1} />
    );
  } else {
    content = <SinglePostModal postId={postId} onClose={() => redirect("/")} initialImageIndex={initialImage - 1} />;
  }

  return <div>{content}</div>;
}
