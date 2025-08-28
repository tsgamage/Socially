import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <>
      <main className="w-full h-screen flex justify-center items-center">
        <SignUp />
      </main>
    </>
  );
}
