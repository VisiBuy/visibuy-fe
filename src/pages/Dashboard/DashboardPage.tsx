import React from 'react';
import { useAppSelector } from '../../app/hooks';

export default function DashboardPage() {
  const user = useAppSelector(s => s.auth.user);

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Visibuy Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, {user?.email || 'Guest'}
        </p>
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
