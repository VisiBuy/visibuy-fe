import React from "react";
import { useAppSelector } from "../../app/hooks";
import { useLogoutMutation } from "../../features/auth/authApi";

export default function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const [logout] = useLogoutMutation();

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl">Visibuy Dashboard</h1>
        <div>
          <span className="mr-4">Hello, {user?.email || "Guest"}</span>
          <button className="px-3 py-1 border" onClick={() => logout()}>
            Logout
          </button>
        </div>
      </header>
      <main>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-gray-700 dark:text-gray-300">
            Welcome to the starter dashboard. Build your features here.
          </p>
        </div>
      </main>
    </div>
  );
}
