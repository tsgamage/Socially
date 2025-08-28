import Link from "next/link";
import NavButton from "./NavButton";

export default function AuthNavbar() {
  return (
    <nav className="width-full h-12 flex justify-between items-center px-10">
      <div className="text-3xl font-bold">
        <Link href={"/login"}>Socially</Link>
      </div>
      <NavButton />
    </nav>
  );
}
