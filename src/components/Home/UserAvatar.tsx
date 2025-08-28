"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export default function UserAvatar() {
  const { user } = useUser();
  return (
    <div className="avatar flex-shrink-0">
      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
        {user?.imageUrl && <Image src={user?.imageUrl} alt="User Avatar" width={48} height={48} />}
      </div>
    </div>
  );
}
