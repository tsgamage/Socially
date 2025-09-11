"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Users, User } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function LeftSideBar() {
  const pathname = usePathname();
  const { user } = useUser();

  const links = [
    { name: "Home", href: "/", icon: Home },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "Friends", href: "/friends", icon: Users },
    { name: "Profile", href: `/profile/${user?.username}`, icon: User },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 p-4 border-r border-base-300 overflow-y-auto flex-shrink-0">
      <div className="flex flex-col space-y-2">
        {links.map((link) => {
          const LinkIcon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                isActive ? "bg-primary text-primary-content font-semibold" : "hover:bg-base-200"
              }`}
            >
              <LinkIcon className="w-6 h-6" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
