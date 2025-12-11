import React from 'react';
import type { Device } from '../../types';

interface DeviceCardProps {
  device: Device;
  onRemove: (id: string) => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onRemove }) => {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-3 hover:border-gray-300 transition-smooth">
      {/* Device Icon */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* Device Info */}
        <div>
          <h3 className="font-semibold text-gray-900">{device.name}</h3>
          <p className="text-sm text-gray-500">{device.location}</p>
          <p className="text-xs text-gray-400">{device.timestamp}</p>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(device.id)}
        className="text-red-500 hover:text-red-600 font-medium text-sm transition-smooth"
      >
        Remove
      </button>
    </div>
  );
};

export default DeviceCard;
