import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  const initial = user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U';

  return (
    <div className="relative inline-block text-left z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 cursor-pointer select-none group"
      >
        <div className="w-7 h-7 bg-[#1a1a1a] text-white flex items-center justify-center text-xs font-normal">
          {initial}
        </div>
        <span className="text-xs uppercase tracking-[1.5px] text-[#1a1a1a] group-hover:text-gray-500 transition-colors">
          {user.firstName || 'Account'}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 h-screen w-screen" onClick={() => setIsOpen(false)} />

          <div className="absolute right-0 mt-3 w-52 bg-white border border-[#e5e0d8] shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#e5e0d8]">
              <p className="text-[9px] uppercase tracking-[2px] text-gray-400 mb-1">Signed in as</p>
              <p className="text-sm font-normal text-[#1a1a1a] truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-xs uppercase tracking-[1.5px] text-gray-600 hover:bg-[#f8f6f3] hover:text-[#1a1a1a] transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
