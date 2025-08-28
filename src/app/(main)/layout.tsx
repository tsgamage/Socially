import "../globals.css";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/ui/Navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Footer from "@/components/ui/Footer";

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
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
