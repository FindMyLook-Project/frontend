import React from 'react';
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';

const Navbar = () => {
  return (
    <nav
      className="w-full bg-white border-b border-[#e5e0d8] px-8 flex justify-between items-center sticky top-0 z-50"
      style={{ height: '56px' }}
    >
      <div className="flex-1" />

      <h1
        className="text-[#8B1A2B] text-4xl uppercase select-none tracking-[6px]"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        FIND MY LOOK
      </h1>

      <div className="flex-1 flex justify-end items-center gap-5">
        <Link
          to="/saved"
          className="text-gray-400 hover:text-[#1a1a1a] transition-colors"
          title="Saved Items"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </Link>
        <UserMenu />
      </div>
    </nav>
  );
};

export default Navbar;
