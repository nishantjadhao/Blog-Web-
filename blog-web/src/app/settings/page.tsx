"use client";

import { ProtectedRoute } from "../../comman/RouteGuards";
import { clearSession } from "../../lib/auth";
import { useRouter } from "next/navigation";

function SettingsContent() {
  const router = useRouter();

  const handleLogout = () => {
    clearSession();
    router.replace("/login");
  };

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/90 p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-500">
        Preferences
      </p>
      <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
        Settings
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Keep this page focused on the account actions that matter.
      </p>

      <button
        onClick={handleLogout}
        className="mt-8 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
      >
        Logout
      </button>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
