import React, { useState } from "react";

export default function PostContent({ postContent }: { postContent: string }) {
  const [readmoreClicked, setReadmoreClicked] = useState(false);

  return (
    <div className="mb-1 p-3 overflow-y-auto" style={{ maxHeight: "33vh", height: "auto" }}>
      {postContent?.length > 100 && !readmoreClicked && (
        <span className="text-md whitespace-pre-wrap">{postContent.slice(0, 100)} ...</span>
      )}
      {(readmoreClicked || postContent?.length < 100) && (
        <span className="text-md whitespace-pre-wrap">{postContent}</span>
      )}
      {postContent?.length > 100 && !readmoreClicked && (
        <button
          className="block text-md text-blue-600 underline cursor-pointer"
          onClick={() => setReadmoreClicked(true)}
        >
          Readmore
        </button>
      )}
    </div>
  );
}
