import { Home, FileText, User, HelpCircle, Plus } from 'lucide-react';

const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 md:hidden z-50 rounded-t-[30px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center relative">
        <button className="p-2 text-blue-600">
          <Home className="w-8 h-8 fill-current" />
        </button>
        
        <button className="p-2 text-blue-100 hover:text-blue-200">
          <FileText className="w-8 h-8" />
        </button>

        {/* Floating Action Button */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-12">
          <button className="bg-blue-600 text-white p-5 rounded-full shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
            <Plus className="w-8 h-8" />
          </button>
        </div>

        <button className="p-2 text-blue-100 hover:text-blue-200">
          <User className="w-8 h-8" />
        </button>
        
        <button className="p-2 text-blue-100 hover:text-blue-200">
          <HelpCircle className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
