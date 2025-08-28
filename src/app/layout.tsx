import "./globals.css";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export const metadata: Metadata = {
  title: "Socially",
  description: "Socially social site",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ theme: dark }}>
      <html lang="en" data-theme="dark">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
