import "../globals.css";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/ui/Navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import LeftSideBar from "@/components/ui/LeftSideBar";
import RightSideBar from "@/components/ui/RightSideBar";
import Dock from "@/components/ui/Dock";

export const metadata: Metadata = {
  title: "Socially",
  description: "Socially social site",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { sessionId } = await auth();
  if (!sessionId) {
    return redirect("/login");
  }
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`antialiased`}>
          <Navbar />
          <div className="flex">
            <LeftSideBar />
            <main className="flex-1 p-4">
              {children}
            </main>
            <RightSideBar />
          </div>
          <div className="md:hidden">
            <Dock />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
