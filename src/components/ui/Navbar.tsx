import { syncUser } from "@/actions/user.actions";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Bell } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function Navbar() {
  const user = await currentUser();
  if (user) {
    syncUser();
  }

  return (
    <nav className="w-full h-16 flex justify-between items-center px-4 md:px-10 shadow-md">
      <Link href="/">
        <div className="text-2xl md:text-3xl font-bold text-primary">Socially</div>
      </Link>

      <div className="flex gap-4 items-center">
        {user && (
          <>
            <Link className="size-6 hover:text-primary" href="/notification">
              <Bell />
              {/* <BellDot/> */}
            </Link>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </>
        )}
        {!user && (
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/login">Login</Link>
            </li>
            <li>
              <Link href="/signup">Sign Up</Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}
