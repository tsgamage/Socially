"use client";

import { UserPlus, Users, UserCheck } from "lucide-react";

type Props = {
  active: "suggested" | "friends" | "requests";
  counts: { suggested?: number; friends?: number; requests?: number };
  onChange: (tab: "suggested" | "friends" | "requests") => void;
};

export default function FriendsTabs({ active, counts, onChange }: Props) {
  const tabButton = (
    key: Props["active"],
    label: string,
    Icon: any,
    count?: number
  ) => (
    <button
      className={`btn flex-1 justify-center ${active === key ? "btn-primary" : "btn-ghost"}`}
      onClick={() => onChange(key)}
    >
      <Icon size={18} />
      <span className="ml-2 hidden xs:inline">{label}</span>
      {typeof count === "number" && count > 0 && (
        <span className="badge badge-sm badge-primary ml-2">{count}</span>
      )}
    </button>
  );

  return (
    <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-row sm:gap-2 mb-4 sm:mb-6">
      {tabButton("suggested", "Suggested", UserPlus, counts.suggested)}
      {tabButton("friends", "Friends", Users, counts.friends)}
      {tabButton("requests", "Requests", UserCheck, counts.requests)}
    </div>
  );
}



