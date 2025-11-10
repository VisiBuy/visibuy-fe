import React, { useState, useMemo } from 'react';
import { useGetVerificationsQuery } from '@/features'
import { VerificationDto } from '@/types/api';
import ProductCard from '@/shared/components/verification/ProductCard';

const VERIFICATION_STATUSES = ['all', 'approved', 'rejected', 'pending', 'expired'];



export default function VerificationsListPage() {
  const [activeTab, setActiveTab] = useState('all');
  const { data: allVerifications, isLoading } = useGetVerificationsQuery();
  
  console.log(allVerifications)
  const filteredVerifications = useMemo(() => {
    if (!Array.isArray(allVerifications)) {
        return [];
    }

    if (activeTab === 'all') {
      return allVerifications;
    }
    // Filter the list to match the current active tab
    return allVerifications.filter(v => v.status === activeTab);
  }, [activeTab, allVerifications]);

  const handleTabClick = (status: string) => {
    setActiveTab(status);
  };

  const hasVerifications = Array.isArray(filteredVerifications) && filteredVerifications.length > 0;

  return (
    <section className='border rounded-lg text-white w-full'>
      <div className='p-5 md:p-10'>
          <div className='md:flex items-center justify-between mb-4'>
            <h2 className='text-[16.22px] font-bold mb-5 hidden md:inline-block'>Recent Verifications</h2>
            <div className='flex items-center gap-5 flex-wrap'>
              {VERIFICATION_STATUSES.map((status) => {
                const isActive = activeTab === status;
                const buttonClasses = ` gap-5 px-4 py-1 border border-[#D9D9D9] rounded-lg transition-colors text-[10px] ${
                  isActive ? 'bg-blue-600' : ' '
                }`;
                return (
                  <button
                    key={status}
                    className={buttonClasses}
                    onClick={() => handleTabClick(status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>
            {isLoading ? (
              <div className='flex items-center justify-center h-[80vh]'>
                <p className='text-[20px] font-semibold'>Loading data</p>
              </div>
            ): (
              <div className='mt-6'>
                {!hasVerifications ? (
                  <div className='flex items-center justify-center h-[80vh]'>
                    <p className='text-[20px] font-semibold'>No {activeTab} verifications found.</p>
                  </div>
                ) : (
                  <div className='space-y-2'>
                    {filteredVerifications.map((verification: VerificationDto) => (
                      <ProductCard key={verification.id} verification={verification}/>
                    ))}
                  </div>
                )}
              </div>
            )}
      </div>
    </section>
  );
}
