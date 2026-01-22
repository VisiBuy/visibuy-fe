const BalanceCard = () => {
  return (
    <div className='bg-black text-white rounded-[30px] p-8 md:p-10 shadow-2xl relative overflow-hidden'>
      {/* Background glow effects */}
      <div className='absolute top-0 right-0 w-96 h-96 bg-gray-800 rounded-full blur-3xl opacity-20 -mr-20 -mt-20 pointer-events-none'></div>

      <div className='relative z-10'>
        <div className='flex justify-between items-start mb-4'>
          <h2 className='text-sm font-medium text-gray-300'>Current Balance</h2>
        </div>

        <div className='flex items-baseline gap-4 mb-8'>
          <span className='text-5xl font-bold tracking-tighter'>85,000</span>
          <span className='text-gray-400 text-md font-medium'>
            credits remaining
          </span>
        </div>

        <div className='relative h-3 bg-gray-800/50 rounded-full mb-5 overflow-hidden backdrop-blur-sm'>
          {/* Progress bar fill */}
          <div
            className='absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-1000 ease-out'
            style={{ width: "65%" }}
          ></div>
        </div>

        <div className='flex flex-col md:flex-row justify-between items-start md:items-center text-sm text-gray-500 gap-2'>
          <p>You started with 10 free credits</p>
          <div className='hidden md:block w-px h-4 bg-gray-800'></div>
          <p>Next renewal: Nov 1, 2025</p>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
