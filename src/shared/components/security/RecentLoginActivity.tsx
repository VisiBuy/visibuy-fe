import React, { useState } from 'react';
import DeviceCard from './DeviceCard';
import type { Device } from '../../types';

const initialDevices: Device[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    location: 'Istanbul, Turkey',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    name: 'iPhone 15 Pro',
    location: 'Istanbul, Turkey',
    timestamp: '5 hours ago',
  },
  {
    id: '3',
    name: 'iPhone 15 Pro',
    location: 'Istanbul, Turkey',
    timestamp: '1 day ago',
  },
];

const RecentLoginActivity: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>(initialDevices);

  const handleRemove = (id: string) => {
    setDevices(devices.filter((device) => device.id !== id));
  };

  const handleAddNew = () => {
    console.log('Add new device');
  };

  const handleSignOutAll = () => {
    setDevices([]);
    console.log('Signed out all devices');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Login Activity</h2>
        <button
          onClick={handleAddNew}
          className="bg-black text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-800 transition-smooth"
        >
          + Add New
        </button>
      </div>

      {/* Device List */}
      <div className="mb-4">
        {devices.map((device) => (
          <DeviceCard key={device.id} device={device} onRemove={handleRemove} />
        ))}
      </div>

      {/* Sign Out All Button */}
      {devices.length > 0 && (
        <button
          onClick={handleSignOutAll}
          className="w-full border-2 border-red-500 text-red-500 font-semibold py-3 rounded-lg hover:bg-red-50 transition-smooth"
        >
          Sign Out All Other Devices
        </button>
      )}
    </div>
  );
};

export default RecentLoginActivity;
