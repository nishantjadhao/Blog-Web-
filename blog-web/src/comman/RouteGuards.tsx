'use client';

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getToken } from "../lib/auth";
import type { ReactNode } from "react";

export function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    setReady(true);
  }, [router]);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}

export function PublicRoute({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();

    if (token) {
      router.replace("/home");
      return;
    }

    setReady(true);
  }, [router]);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}

export function useIsPublicPath() {
  const pathname = usePathname();

  return pathname === "/" || pathname === "/login" || pathname === "/signup";
}
