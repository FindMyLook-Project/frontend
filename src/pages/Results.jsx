import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchResults = location.state?.searchResults || [];
  const originalItems = location.state?.originalItems || [];

  const formatCategory = (category) => {
    if (!category) return 'Item';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f6f3' }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex justify-between items-end mb-12 pb-6 border-b border-[#e5e0d8]">
          <div>
            <p className="text-[10px] uppercase tracking-[3px] text-gray-400 mb-2">Your search</p>
            <h1
              className="text-4xl text-[#1a1a1a]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Search Results
            </h1>
          </div>
          <button
            onClick={() => navigate('/upload')}
            className="text-[11px] uppercase tracking-[2px] text-[#1a1a1a] border border-[#e5e0d8] px-6 py-3 hover:border-[#1a1a1a] transition-colors cursor-pointer"
          >
            New Search
          </button>
        </div>

        {/* Result groups */}
        {searchResults.map((searchData, index) => {
          const originalItem = originalItems[searchData.itemIndex];
          const products = searchData.results;

          return (
            <div key={index} className="mb-16">

              {/* Section label */}
              <div className="flex items-center gap-4 mb-6">
                {originalItem?.image && (
                  <div className="w-12 h-12 border border-[#e5e0d8] overflow-hidden shrink-0">
                    <img
                      src={originalItem.image}
                      alt="Your selection"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="text-[9px] uppercase tracking-[3px] text-[#8B1A2B]">
                    {formatCategory(originalItem?.category)}
                  </p>
                  <p className="text-sm text-[#1a1a1a] mt-0.5">
                    {products.length} match{products.length !== 1 ? 'es' : ''} found
                  </p>
                </div>
              </div>

              {/* Product grid */}
              {products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {products.map((product, pIndex) => (
                    <a
                      key={pIndex}
                      href={product.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block border border-[#e5e0d8] overflow-hidden bg-white hover:border-[#1a1a1a] transition-colors"
                    >
                      <div className="aspect-[3/4] overflow-hidden relative" style={{ backgroundColor: '#f0ece6' }}>
                        <img
                          src={product.images?.[0]?.url || product.images?.[0]}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <div className="absolute top-2 left-2 bg-white border border-[#e5e0d8] px-2 py-0.5">
                          <span className="text-[9px] uppercase tracking-[1px] text-[#1a1a1a]">
                            {Math.round(product.searchScore * 100)}%
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-white">
                        <p className="text-[9px] uppercase tracking-[2px] text-[#8B1A2B] mb-1">
                          {product.storeName || product.brand}
                        </p>
                        <p className="text-xs text-[#1a1a1a] line-clamp-2 leading-snug text-right" dir="rtl">
                          {product.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">₪{product.price}</p>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="border border-[#e5e0d8] bg-white py-12 text-center">
                  <p className="text-xs uppercase tracking-[2px] text-gray-400">
                    No matches found — try adjusting your filters
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {searchResults.length === 0 && (
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
