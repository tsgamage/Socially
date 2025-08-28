"use client";
import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function ProfilePage() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-xl font-bold mb-5">ProfilePage</div>
      <UserProfile appearance={{ theme: dark }} />
    </div>
  );
}
