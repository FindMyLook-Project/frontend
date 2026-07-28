import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const SavedItems = () => {
  const [savedProducts, setSavedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const getUserId = () => {
    const userStorage = localStorage.getItem('user');
    if (!userStorage) return null;
    const user = JSON.parse(userStorage);
    return user._id || user.id;
  };

  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      navigate('/login');
      return;
    }

    fetch(`${apiUrl}/api/profile/saved/${userId}`)
      .then(r => r.json())
      .then(d => { if (d.success) setSavedProducts(d.data); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleUnsave = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    const userId = getUserId();
    if (!userId) return;

    // Optimistic remove
    setSavedProducts(prev => prev.filter(p => p._id !== productId));

    try {
      await fetch(`${apiUrl}/api/profile/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId }),
      });
    } catch (error) {
      // Re-fetch to restore correct state
      fetch(`${apiUrl}/api/profile/saved/${userId}`)
        .then(r => r.json())
        .then(d => { if (d.success) setSavedProducts(d.data); })
        .catch(() => {});
      console.error("Failed to unsave item:", error);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f6f3' }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="flex justify-between items-end mb-12 pb-6 border-b border-[#e5e0d8]">
          <div>
            <p className="text-[10px] uppercase tracking-[3px] text-gray-400 mb-2">Your collection</p>
            <h1 className="font-display text-4xl text-[#1a1a1a]">
              Saved Items
            </h1>
          </div>
          <button
            onClick={() => navigate('/upload')}
            className="text-[11px] uppercase tracking-[2px] text-[#1a1a1a] border border-[#e5e0d8] px-6 py-3 hover:border-[#1a1a1a] transition-colors cursor-pointer"
          >
            New Search
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-24">
            <p className="text-xs uppercase tracking-[3px] text-gray-400">Loading...</p>
          </div>
        ) : savedProducts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-xs uppercase tracking-[3px] text-gray-400 mb-6">No saved items yet</p>
            <button
              onClick={() => navigate('/upload')}
              className="bg-[#1a1a1a] text-white text-[11px] uppercase tracking-[2.5px] py-3 px-10 hover:bg-[#333] transition-colors cursor-pointer"
            >
              Start a search
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-6">
              {savedProducts.length} saved item{savedProducts.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {savedProducts.map((product, i) => (
                <a
                  key={i}
                  href={product.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block border border-[#e5e0d8] overflow-hidden bg-white hover:border-[#1a1a1a] transition-colors flex flex-col"
                >
                  <div className="aspect-[3/4] overflow-hidden" style={{ backgroundColor: '#f0ece6' }}>
                    <img
                      src={product.images?.[0]?.url || product.images?.[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>

                  <div className="p-3 bg-white flex flex-col flex-1 justify-between">
                    <div>
                      <p className="text-[9px] uppercase tracking-[2px] text-[#8B1A2B] mb-1">
                        {product.storeName || product.brand}
                      </p>
                      <p className="text-xs text-[#1a1a1a] line-clamp-2 leading-snug text-right" dir="rtl">
                        {product.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">₪{product.price}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                      <button
                        onClick={(e) => handleUnsave(e, product._id)}
                        className="text-[#8B1A2B] hover:bg-red-50 rounded-full p-1.5 transition-all"
                        title="Remove from saved"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SavedItems;
