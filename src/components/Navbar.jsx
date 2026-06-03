import React from 'react';
import UserMenu from './UserMenu';

const Navbar = () => {
  return (
    <nav className="w-full bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
      
      <div className="flex items-center">
        <h1 className="text-2xl font-black tracking-wider text-[#800020] select-none">
          FIND MY LOOK
        </h1>
      </div>

      <div className="hidden sm:flex items-center justify-center text-gray-300">
        <div className="w-8 h-8 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-xs">
          +
        </div>
      </div>

      <div className="flex items-center">
        <UserMenu />
      </div>

    </nav>
  );
};

export default Navbar;