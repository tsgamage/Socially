"use client";
import { getNotificationsCount } from "@/actions/notifications.action";
import { syncUser } from "@/actions/user.actions";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Bell, BellDot } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

export default function Navbar() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      syncUser();
    }
  }, [user]);

  const { data: notificationsCount, isLoading: isNotificationsCounting } = useQuery({
    queryKey: ["notifications", "count"],
    queryFn: getNotificationsCount,
  });

  return (
    <nav className="w-full h-16 flex justify-between items-center px-4 md:px-10 shadow-md">
      <Link href="/">
        <div className="text-2xl md:text-3xl font-bold text-primary">Socially</div>
      </Link>

      <div className="flex gap-4 items-center">
        {user && (
          <>
            <Link className="relative size-6 hover:text-primary" href="/notification">
              <Bell />
              {!isNotificationsCounting && !!notificationsCount && notificationsCount > 0 && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              )}
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
