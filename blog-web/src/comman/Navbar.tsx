'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Home,
  PenSquare,
  ListChecks,
  UserCircle,
  LogOut,
} from "lucide-react";
import { clearSession } from "../lib/auth";

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/create-blog", label: "Create Blog", icon: PenSquare },
  { href: "/manage-posts", label: "Manage Posts", icon: ListChecks },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    clearSession();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/home" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-orange-500/15 ring-1 ring-orange-400/40" ></div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
              Blog Portal
            </p>
            <h1 className="text-xl font-black tracking-tight text-white">
              Blog<span className="text-orange-500">-web</span>
            </h1>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-300 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-orange-400"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:border-orange-400 hover:text-orange-400"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        <button
          className="rounded-xl border border-slate-700 p-2 text-slate-200 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-800 bg-slate-950 md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6 lg:px-8">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-900"
                >
                  <Icon size={18} className="text-orange-400" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-200 hover:bg-slate-900"
            >
              <LogOut size={18} className="text-orange-400" />
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
