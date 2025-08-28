import Link from "next/link";

export default function AuthNavbar() {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          Socially
        </Link>
      </div>
      <div className="flex-none"></div>
    </div>
  );
}
