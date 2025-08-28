"use client";
import { useMediaQuery } from "react-responsive";
import Dock from "./Dock";

export default function Navigation() {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return <>{isMobile && <Dock />}</>;
}
