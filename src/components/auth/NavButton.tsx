"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavButton() {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  return (
    <Link href={isLogin ? "/signup" : "/login"} className="bg-black text-white px-4 py-2 rounded-3xl">
      {isLogin ? "Sign Up" : "Sign In"}
    </Link>
  );
}
