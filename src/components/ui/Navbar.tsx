"use client";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { Bell, MessageSquare, Search } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  const { user } = useUser();
  console.log(user);
  return (
    <nav className="w-full h-16 flex justify-between items-center px-4 md:px-10 shadow-md">
      <Link href="/">
        <div className="text-2xl md:text-3xl font-bold text-primary">Socially</div>
      </Link>
      <div className="hidden md:flex items-center bg-base-200 rounded-full px-4 py-2">
        <Search className="text-base-content/50" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent focus:outline-none ml-2"
        />
      </div>
      <div className="flex gap-4 items-center">
        <Link className="size-6 hover:text-primary" href={"/messages"}>
          <MessageSquare />
        </Link>
        <Link className="size-6 hover:text-primary" href="/notification">
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
