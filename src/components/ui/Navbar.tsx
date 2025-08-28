"use client";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { Bell, MessageSquare } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  const { user } = useUser();
  console.log(user);
  return (
    <nav className="w-full h-12 flex justify-between items-center px-10">
      <Link href="/">
        <div className="text-3xl font-bold">Socially</div>
      </Link>
      <div className="flex gap-4 items-center">
        <Link className="size-5" href={"/messages"}>
          <MessageSquare />
        </Link>
        <Link className="size-5" href="/notification">
          <Bell />
          {/* <BellDot/> */}
        </Link>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
