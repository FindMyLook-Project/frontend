import React from 'react';
import UserMenu from './UserMenu';

const Navbar = () => {
  return (
    <nav
      className="w-full bg-white border-b border-[#e5e0d8] px-8 flex justify-between items-center sticky top-0 z-50"
      style={{ height: '56px' }}
    >
      <div className="flex-1" />

      <h1
        className="text-[#8B1A2B] text-sm uppercase select-none tracking-[4px]"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        FIND MY LOOK
      </h1>

      <div className="flex-1 flex justify-end">
        <UserMenu />
      </div>
    </nav>
  );
};

export default Navbar;
