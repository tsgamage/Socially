"use client";
import { useUser } from "@clerk/nextjs";
import { Home, Search, UserCircle, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Dock() {
  const pathname = usePathname();
  const { user } = useUser();
  return (
    <div className="dock dock-sm">
      <Link className={pathname === "/" ? "dock-active" : ""} href={"/"}>
        <Home />
      </Link>

      <Link className={pathname === "/explore" ? "dock-active" : ""} href={"/explore"}>
        <Search />
      </Link>

      <Link className={pathname === "/friends" ? "dock-active" : ""} href={"/friends"}>
        <Users />
      </Link>

      <Link
        className={pathname === `/profile/${user?.username}` ? "dock-active" : ""}
        href={`/profile/${user?.username}`}
      >
        <UserCircle />
      </Link>
    </div>
  );
}
