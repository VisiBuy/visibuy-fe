import { useChangePasswordMutation } from '@/features/security/passwordApi';
import React, { useState, useEffect } from 'react';
import eyeOn from '../../.././assets/icons/eye.svg'
import eyeOff from '../../.././assets/icons/eye-off.svg'

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [windowWidth , setWindowWidth] = useState(window.innerWidth)



  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
  
    window.addEventListener("resize", handleResize);
  
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentPasswordPlaceholder = windowWidth < 425 ? "Current Password" : "Enter Current Password"
  const newPasswordPlaceholder = windowWidth < 425 ? "New Password" : "Enter New Password"
  const confirmNewPassword = windowWidth < 425 ? "Confirm Password" : "Re-enter New Password"

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

  const toggleCurrent = () => setShowCurrent(prev => !prev);
  const toggleNew = () => setShowNew(prev => !prev);
  const toggleConfirm = () => setShowConfirm(prev => !prev);
  

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
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 w-full">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        {/* Current Password */}
        <div className='relative' >
          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <input
            id="current-password"
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-3 border  border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
            placeholder={currentPasswordPlaceholder}
            required
          />
          <img src={showCurrent ? eyeOn : eyeOff } alt="toggle-shown" 
          onClick={toggleCurrent}
          className='absolute right-3 top-10 cursor-pointer' />
        </div>

        {/* New Password */}
        <div className='relative'>
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            id="new-password"
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
            placeholder={newPasswordPlaceholder}
            
          />
          <img src={showNew ? eyeOn : eyeOff } alt="toggle-shown" 
          onClick={toggleNew}
          className='absolute right-3 top-10 cursor-pointe' />
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
        <div className='relative'>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <input
            id="confirm-password"
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
            placeholder={confirmNewPassword}
          />
          <img src={showConfirm ? eyeOn : eyeOff } alt="toggle-shown" 
          onClick={toggleConfirm}
          className='absolute right-3 top-10 cursor-pointe' />
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
