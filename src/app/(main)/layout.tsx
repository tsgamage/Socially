import "../globals.css";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/ui/Navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navigation from "@/components/ui/Navigation";

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
          <main className="grid grid-cols-12">
            <div className="hidden lg:grid lg:col-span-2 border-2">SideBar Left</div>
            <div className="col-span-12 lg:col-span-8 border-2">{children}</div>
            <div className="hidden lg:grid lg:col-span-2 border-2">SideBar Right</div>
          </main>
          <Navigation />
        </body>
      </html>
    </ClerkProvider>
  );
}
