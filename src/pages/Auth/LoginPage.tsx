import React from 'react';
import { useLoginMutation } from '../../features/auth/authApi';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    try {
      await login({ email, password }).unwrap();
      navigate('/');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="p-6 border rounded-md w-96">
        <h2 className="text-xl mb-4">Sign in</h2>
        <input name="email" placeholder="Email" className="w-full p-2 mb-2 border" />
        <input name="password" type="password" placeholder="Password" className="w-full p-2 mb-4 border" />
        <button className="w-full p-2 bg-blue-600 text-white" disabled={isLoading}>{isLoading ? 'Signing in...' : 'Sign in'}</button>
      </form>
    </div>
  );
}
