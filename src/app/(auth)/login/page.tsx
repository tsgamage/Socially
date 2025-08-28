import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <>
      <main className="w-full h-screen flex justify-center items-center">
        <SignIn />
      </main>
    </>
  );
}
