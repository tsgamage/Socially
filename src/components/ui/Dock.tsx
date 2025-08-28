"use client";
import { Home, Search, UserCircle, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Dock() {
  const pathname = usePathname();
  return (
    <div className="dock dock-sm">
      <Link className={pathname === "/" ? "dock-active" : ""} href={"/"}>
        <Home />
      </Link>

      <Link className={pathname === "/explore" ? "dock-active" : ""}  href={"/explore"}>
        <Search />
      </Link>

      <Link className={pathname === "/friends" ? "dock-active" : ""}  href={"/friends"}>
        <Users />
      </Link>

      <Link className={pathname === "/profile" ? "dock-active" : ""}  href={"/profile"}>
        <UserCircle />
      </Link>
    </div>
  );
}
