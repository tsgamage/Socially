"use client";
import { getAllPosts } from "@/actions/post.actions";
import CreatePost from "@/components/Home/CreatePost";
import PostAndModal from "@/components/ui/PostAndModal";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });

  return (
    <div className="max-w-2xl mx-auto">
      <CreatePost />
      {isLoading && (
        <div className="flex flex-col items-center justify-center mt-10">
          <Loader2Icon className="animate-spin mb-2" />
          <p className="animate-bounce drop-shadow-[3px_5px_0px_rgba(0,0,0)]">Loading...</p>
        </div>
      )}
      {!isLoading && <PostAndModal postData={data} />}
    </div>
  );
}
