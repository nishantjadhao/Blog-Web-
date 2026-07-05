"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "../../comman/RouteGuards";
import { getStoredUser } from "../../lib/auth";
import { apiFetch } from "../../lib/api";

function ProfileContent() {
  const [user, setUser] = useState<any>(getStoredUser());

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await apiFetch("/auth/me", { auth: true });
        const data = await response.json();

        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadProfile();
  }, []);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/90 p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-500">
        Account
      </p>
      <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
        Profile
      </h1>
      <p className="mt-3 text-slate-600">
        Your signed-in user information.
      </p>

      <div className="mt-8 grid gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-6 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-slate-500">Full Name</p>
          <p className="mt-1 text-lg font-bold text-slate-950">
            {user?.fullName || "Not available"}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500">Email</p>
          <p className="mt-1 text-lg font-bold text-slate-950">
            {user?.email || "Not available"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
