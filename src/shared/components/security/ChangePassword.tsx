import { useChangePasswordMutation } from '@/features/security/passwordApi';
import React, { useState } from 'react';

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // RTK Query mutation hook
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  // Enforcing strong password
  const validatePasswordStrength = (password: string): string | null => {
    if (password.length < 8) return "At least 8 characters";
    if (!/[A-Z]/.test(password)) return "Must include an uppercase letter";
    if (!/[a-z]/.test(password)) return "Must include a lowercase letter";
    if (!/\d/.test(password)) return "Must include a number";
    if (!/[!@#$%^&*]/.test(password)) return "Must include a symbol (!@#$%^&*)";
    return null; // valid
  };

  const passwordStrengthError = validatePasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Required fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    // Password match
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    // Strength check
    if (passwordStrengthError) {
      setError("New password is too weak: " + passwordStrengthError);
      return;
    }

    
      try {
        setLoading(true)
      // Call RTK Query mutation
      const res = await changePassword({
        currentPassword,
        newPassword,
      }).unwrap();

      if (res.success) {
        setSuccess("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(res.message || "Failed to change password.");
      }
    } catch (err: any) {
      setError(err?.data?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        <div>
          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
            placeholder="Enter current password"
            required
          />
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
            placeholder="Enter new password"
            
          />
          <p className="mt-2 text-xs text-gray-500">
            Must be at least 8 characters with uppercase, lowercase, and numbers
          </p>
        </div>

        {/* Password strength indicator */}
      {newPassword && (
        <p
          style={{
            color: passwordStrengthError ? "red" : "green",
            margin: "4px 0",
          }}
        >
          {passwordStrengthError
            ? "Weak: " + passwordStrengthError
            : "Strong password ✓"}
        </p>
      )}

        {/* Confirm New Password */}
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
            placeholder="Re-enter new password"
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-smooth mt-6"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
