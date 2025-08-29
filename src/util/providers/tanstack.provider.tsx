"use client";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(new QueryClient());
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
