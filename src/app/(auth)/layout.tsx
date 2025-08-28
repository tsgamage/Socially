import { auth } from "@clerk/nextjs/server";
import React from "react";
import Navbar from "@/components/auth/AuthNavbar";
import { redirect } from "next/navigation";

export default async function layout({ children }: { children: React.ReactNode }) {
  const { sessionId } = await auth();
  if (sessionId) {
    return redirect("/");
  }
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
