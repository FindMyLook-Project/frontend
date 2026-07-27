import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

function formatDetectedSummary(detected) {
  if (!detected?.color) return 'unknown';
  const parts = [detected.color.replace(/_/g, ' ')];
  if (detected.isStripe) parts.push('striped');
  const detail = detected.topStyle || detected.skirtLength || detected.shoeStyle;
  if (detail) parts.push(detail.replace(/_/g, ' '));
  return parts.join(' · ');
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const mode = location.state?.mode || 'item';
  const isTotalLook = mode === 'totalLook';
  const searchResults = location.state?.searchResults || [];
  const originalItems = location.state?.originalItems || [];
  const sourceImage = location.state?.sourceImage || '';
  const totalLook = location.state?.totalLook || null;
  const totalLookSlots = totalLook?.slots || [];

  const [savedIds, setSavedIds] = useState(new Set());

  useEffect(() => {
    const userStorage = localStorage.getItem('user');
    if (!userStorage) return;
    const loggedInUser = JSON.parse(userStorage);
    const userId = loggedInUser._id || loggedInUser.id;
    if (!userId) return;

    fetch(`${apiUrl}/api/profile/saved/${userId}`)
      .then(r => r.json())
      .then(d => { if (d.success) setSavedIds(new Set(d.data.map(p => p._id))); })
      .catch(() => {});
  }, []);

  const handleProductClick = async (product) => {
    try {
      const userStorage = localStorage.getItem('user');
      if (!userStorage) return;
      const loggedInUser = JSON.parse(userStorage);
      const realUserId = loggedInUser._id || loggedInUser.id;
      if (!realUserId) return;

      await fetch(`${apiUrl}/api/profile/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: realUserId,
          eventType: 'click',
          productId: product._id,
          metadata: {
            price: product.price,
            store: product.storeName || product.brand,
            color: product.colors?.[0] || 'other',
          },
        }),
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  };

  const handleFeedback = async (e, product, type) => {
    e.preventDefault();
    e.stopPropagation();
    const userStorage = localStorage.getItem('user');
    if (!userStorage) {
      alert('Please log in to save your style preferences!');
      return;
    }
    const loggedInUser = JSON.parse(userStorage);
    const realUserId = loggedInUser._id || loggedInUser.id;
    try {
      await fetch(`${apiUrl}/api/profile/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: realUserId,
          storeName: product.storeName || product.brand,
          feedbackType: type,
        }),
      });
      alert(type === 'like' ? 'We will show you more like this!' : 'Got it! We will show less of this.');
    } catch (error) {
      console.error('Failed to send feedback:', error);
    }
  };

  const handleSave = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const userStorage = localStorage.getItem('user');
    if (!userStorage) {
      alert('Please log in to save items!');
      return;
    }
    const loggedInUser = JSON.parse(userStorage);
    const userId = loggedInUser._id || loggedInUser.id;
    const productId = product._id;

    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId); else next.add(productId);
      return next;
    });

    try {
      await fetch(`${apiUrl}/api/profile/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId }),
      });
    } catch (error) {
      setSavedIds(prev => {
        const next = new Set(prev);
        if (next.has(productId)) next.delete(productId); else next.add(productId);
        return next;
      });
    }
  };

  const renderProductGrid = (products) => {
    if (!products?.length) {
      return (
        <div className="border border-[#e5e0d8] bg-white py-12 text-center">
          <p className="text-xs uppercase tracking-[2px] text-gray-400">
            No matches found — try adjusting your filters
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 items-start">
        {products.map((product, pIndex) => (
          <a
            key={product._id || pIndex}
            href={product.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleProductClick(product)}
            className="group block border border-[#e5e0d8] overflow-hidden bg-white hover:border-[#1a1a1a] transition-colors flex flex-col"
          >
            <div className="aspect-[3/4] overflow-hidden relative" style={{ backgroundColor: '#f0ece6' }}>
              <img
                src={product.images?.[0]?.url || product.images?.[0]}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="absolute top-2 left-2 bg-white border border-[#e5e0d8] px-2 py-0.5 z-10 shadow-sm">
                <span className="text-[9px] uppercase tracking-[1px] text-[#1a1a1a]">
                  {Math.round((product.searchScore || 0) * 100)}%
                </span>
              </div>
              {product.personalizationBoost > 0 && (
                <div className="absolute top-2 right-2 bg-[#8B1A2B] px-2 py-0.5 shadow-sm z-10">
                  <span className="text-[9px] uppercase tracking-[1px] text-white">✨ Top Pick</span>
                </div>
              )}
            </div>
            <div className="p-3 bg-white flex flex-col">
              <div>
                <p className="text-[9px] uppercase tracking-[2px] text-[#8B1A2B] mb-1">
                  {product.storeName || product.brand}
                </p>
                <p className="text-xs text-[#1a1a1a] line-clamp-2 leading-snug text-right" dir="rtl">
                  {product.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">₪{product.price}</p>
              </div>
              <div className="flex justify-between items-center mt-2.5 pt-2.5 border-t border-gray-100">
                <button
                  onClick={(e) => handleSave(e, product)}
                  className={`rounded-full p-1.5 transition-all ${
                    savedIds.has(product._id)
                      ? 'text-[#8B1A2B] hover:bg-red-50'
                      : 'text-gray-400 hover:text-[#1a1a1a] hover:bg-gray-100'
                  }`}
                  title={savedIds.has(product._id) ? 'Remove from saved' : 'Save item'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill={savedIds.has(product._id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={(e) => handleFeedback(e, product, 'dislike')}
                    className="text-gray-400 hover:text-[#1a1a1a] hover:bg-gray-100 rounded-full p-1.5 transition-all"
                    title="Show less of this style"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 14V2" />
                      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => handleFeedback(e, product, 'like')}
                    className="text-gray-400 hover:text-[#8B1A2B] hover:bg-red-50 rounded-full p-1.5 transition-all"
                    title="Show more of this style"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 10v12" />
                      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    );
  };

  const hasResults = isTotalLook ? totalLookSlots.length > 0 : searchResults.length > 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f6f3' }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-end mb-12 pb-6 border-b border-[#e5e0d8]">
          <div>
            <p className="text-[10px] uppercase tracking-[3px] text-gray-400 mb-2">Your search</p>
            <h1 className="text-4xl text-[#1a1a1a]" style={{ fontFamily: "'Playfair Display', serif" }}>
              {isTotalLook ? 'Total Look Results' : 'Search Results'}
            </h1>
          </div>
          <button
            onClick={() => navigate('/upload')}
            className="text-[11px] uppercase tracking-[2px] text-[#1a1a1a] border border-[#e5e0d8] px-6 py-3 hover:border-[#1a1a1a] transition-colors cursor-pointer"
          >
            New Search
          </button>
        </div>

        {isTotalLook && sourceImage && (
          <div className="flex flex-col md:flex-row gap-6 mb-12 p-6 bg-white border border-[#e5e0d8]">
            <img src={sourceImage} alt="Your outfit" className="max-h-72 object-contain mx-auto md:mx-0" />
            <div className="flex flex-col justify-center">
              <p className="text-[10px] uppercase tracking-[3px] text-[#8B1A2B] mb-2">We detected</p>
              <p className="text-2xl text-[#1a1a1a]" style={{ fontFamily: "'Playfair Display', serif" }}>
                {totalLook?.summary?.garmentCount || 0} items in your look
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {totalLook?.summary?.totalMatches || 0} matching products found
              </p>
            </div>
          </div>
        )}

        {isTotalLook && totalLookSlots.map((slot) => (
          <div key={slot.slotId} className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              {slot.detected?.cropImage && (
                <div className="w-14 h-14 border border-[#e5e0d8] overflow-hidden shrink-0">
                  <img src={slot.detected.cropImage} alt={slot.labelHe} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <p className="text-[9px] uppercase tracking-[3px] text-[#8B1A2B]">{slot.labelHe || slot.label}</p>
                <p className="text-sm text-[#1a1a1a] mt-0.5">
                  {formatDetectedSummary(slot.detected)} · {slot.matchCount} match{slot.matchCount !== 1 ? 'es' : ''}
                </p>
              </div>
            </div>
            {renderProductGrid(slot.results)}
          </div>
        ))}

        {!isTotalLook && searchResults.map((searchData, index) => {
          const originalItem = originalItems[searchData.itemIndex ?? index];
          return (
            <div key={index} className="mb-16">
              <div className="flex items-center gap-4 mb-6">
                {originalItem?.image && (
                  <div className="w-12 h-12 border border-[#e5e0d8] overflow-hidden shrink-0">
                    <img src={originalItem.image} alt="Your selection" className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <p className="text-[9px] uppercase tracking-[3px] text-[#8B1A2B]">Item {index + 1}</p>
                  <p className="text-sm text-[#1a1a1a] mt-0.5">
                    {searchData.results?.length || 0} matches found
                  </p>
                </div>
              </div>
              {renderProductGrid(searchData.results)}
            </div>
          );
        })}

        {!hasResults && (
          <div className="text-center py-24">
            <p className="text-xs uppercase tracking-[3px] text-gray-400 mb-6">No results</p>
            <button
              onClick={() => navigate('/upload')}
              className="bg-[#1a1a1a] text-white text-[11px] uppercase tracking-[2.5px] py-3 px-10 hover:bg-[#333] transition-colors cursor-pointer"
            >
              Start a new search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
