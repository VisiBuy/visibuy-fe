import React, { useState } from 'react';

const TwoFactorAuth: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const handleToggle = () => {
    setIsEnabled(!isEnabled);
    console.log('2FA toggled:', !isEnabled);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 ">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Two-Factor Authentication</h2>
      
      <div className="flex items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">
            {isEnabled ? 'Enabled' : 'Not Enabled'}
          </p>
          <p className="text-xs text-gray-500">
            Add an extra layer of security to your account with 2FA
          </p>
        </div>

        <button
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-smooth ${
            isEnabled ? 'bg-black' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-smooth ${
              isEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default TwoFactorAuth;
