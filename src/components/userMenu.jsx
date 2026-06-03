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
        className="flex items-center gap-3 bg-white pl-4 pr-3 py-2 rounded-full shadow-sm hover:shadow-md border border-gray-200/80 transition-all duration-200 cursor-pointer group select-none"
      >
        <div className="w-7 h-7 rounded-full bg-[#800020] text-white flex items-center justify-center text-xs font-bold shadow-sm group-hover:scale-105 transition-transform">
          {initial}
        </div>
        <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
          {user.firstName ? `Hi, ${user.firstName}` : 'User'}
        </span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={2} 
          stroke="currentColor" 
          className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 h-screen w-screen" onClick={() => setIsOpen(false)}></div>
          
          <div className="absolute right-0 mt-2.5 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 origin-top-right animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50/60 border-b border-gray-100 text-left">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Account</p>
              <p className="text-sm font-bold text-gray-700 truncate mt-0.5">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
            </div>
            
            <div className="p-1">
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50/80 rounded-xl flex items-center justify-between transition-all duration-150 font-semibold cursor-pointer group"
              >
                <span className="group-hover:translate-x-0.5 transition-transform">Log Out</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={2} 
                  stroke="currentColor" 
                  className="w-4 h-4 text-red-500/80 group-hover:translate-x-0.5 transition-transform"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;