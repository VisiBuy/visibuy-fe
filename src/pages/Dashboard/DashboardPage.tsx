import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { useLogoutMutation } from '../../features/auth/authApi';

export default function DashboardPage() {
  const user = useAppSelector(s => s.auth.user);
  const [logout] = useLogoutMutation();

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl">Visibuy Dashboard</h1>
        <div>
          <span className="mr-4">Hello, {user?.email || 'Guest'}</span>
          <button className="px-3 py-1 border" onClick={() => logout()}>Logout</button>
        </div>
      </header>
      <nav className="mb-6">
        <Link to="/users" className="mr-4">Users</Link>
      </nav>
      <main>
        <p>Welcome to the starter dashboard. Build your features here.</p>
      </main>
    </div>
  );
}
