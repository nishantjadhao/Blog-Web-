'use client';

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  PlusCircle,
  ListChecks,
  UserCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { clearSession } from "../lib/auth";

const items = [
  { href: "/home", label: "Dashboard", icon: LayoutDashboard },
  { href: "/create-blog", label: "Create Blog", icon: PlusCircle },
  { href: "/manage-posts", label: "Manage Posts", icon: ListChecks },
  { href: "/profile", label: "Profile", icon: UserCircle },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearSession();
    router.replace("/login");
  };

  return (
    <aside className="flex h-full flex-col bg-white/95 px-4 py-6">
      <div className="mb-6 rounded-3xl bg-slate-950 px-4 py-5 text-white">
        <p className="text-lg font-bold">Blog Admin</p>
      </div>

      <nav className="flex-1 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                active
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-orange-400 hover:text-orange-500"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
