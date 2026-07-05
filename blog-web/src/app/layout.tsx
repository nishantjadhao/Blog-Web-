'use client';

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "./globals.css";
import Navbar from "../comman/Navbar";
import Sidebar from "../comman/Sidebar-menu";
import { getToken } from "../lib/auth";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAuthed, setIsAuthed] = useState(false);

  const isPublicRoute =
    pathname === "/" || pathname === "/login" || pathname === "/signup";

  useEffect(() => {
    const syncAuth = () => {
      setIsAuthed(Boolean(getToken()));
    };

    syncAuth();
    window.addEventListener("storage", syncAuth);

    return () => window.removeEventListener("storage", syncAuth);
  }, [pathname]);

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-screen bg-[radial-gradient(circle_at_top,_#1f2937,_#0f172a_45%,_#020617_100%)] text-slate-900">
        {isPublicRoute || !isAuthed ? (
          <main>{children}</main>
        ) : (
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex flex-1">
              <aside className="hidden w-72 border-r border-slate-200 bg-white/95 backdrop-blur md:block">
                <Sidebar />
              </aside>
              <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                <div className="mx-auto max-w-7xl">{children}</div>
              </main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
