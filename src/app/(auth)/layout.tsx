import AuthNavbar from "@/components/auth/AuthNavbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionId } = await auth();
  if (sessionId) {
    return redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <AuthNavbar />
      <main className="flex-grow flex items-center justify-center">
        {children}
      </main>
    </div>
  );
}
