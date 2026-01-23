import { Menu } from "lucide-react";
// import Sidebar from "./components/Sidebar";
import BalanceCard from "@/shared/components/billings&credit/BalanceCard";
import CreditPackages from "@/shared/components/billings&credit/CreditPackages";
import TransactionHistory from "@/shared/components/billings&credit/TransactionHistory";
import BottomNav from "@/shared/components/billings&credit/BottomNav";
import { PageWrapper } from "@/shared/components/layout/PageWrapper";

function BillingAndCredit() {
  return (
    <PageWrapper isScrollable={true}>
      {/* <div className="min-h-screen bg-gray-50 flex font-['Inter']"> */}
      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden relative'>
        {/* Desktop Blue Header Background */}
        {/* <div className='hidden md:block absolute top-0 left-0 right-0 h-64 bg-blue-600 z-0'></div> */}

        {/* Mobile Header */}
        {/* <header className='bg-blue-600 text-white p-6 flex justify-between items-center md:hidden z-40 relative shadow-md'>
          <button className='p-2'>
            <Menu className='w-8 h-8' />
          </button>
          <h1 className='text-2xl font-bold'>Billing & Credits</h1>
          {/* Placeholder for balance width 
          <div className='w-10'></div>
        </header> */}

        {/* Scrollable Content Area */}
        {/* overflow-y-auto */}
        <main
          className='flex-1 
         z-10 relative'
        >
          <div className='pb-12 md:pb-12 max-w-7xl mx-auto space-y-4 md:space-y-6'>
            {/* Balance Section */}
            <section
            // className='mt-4 md:mt-8'
            >
              <BalanceCard />
            </section>

            {/* Content Stack */}
            <div className='space-y-4 md:space-y-6'>
              <section>
                <CreditPackages />
              </section>
              <section>
                <TransactionHistory />
              </section>
            </div>
          </div>
        </main>

        {/* Bottom Nav - Mobile Only */}
        {/* <BottomNav /> */}
      </div>
      {/* </div> */}
    </PageWrapper>
  );
}

export default BillingAndCredit;
