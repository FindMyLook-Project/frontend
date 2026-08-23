import React from 'react';

/**
 * ProductCard Component
 * Represents a single fashion item/product returned from the ML search or saved items list.
 * Handles user interactions such as clicking on the product, saving, and providing feedback.
 * 
 * @param {Object} product - The product data object from the backend.
 * @param {boolean} isSaved - Indicates if the user has already saved this item.
 * @param {Function} onSave - Callback triggered when the save (bookmark) button is clicked.
 * @param {Function} onClick - Callback triggered when the product card itself is clicked (analytics).
 * @param {Function} onFeedback - Callback for 'like'/'dislike' interactions (optional, used in results).
 * @param {boolean} showFeedback - Flag to determine whether to render feedback buttons.
 */
const ProductCard = ({ 
  product, 
  isSaved, 
  onSave, 
  onClick, 
  onFeedback, 
  showFeedback = false 
}) => {
  return (
    <a
      href={product.productUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onClick && onClick(product)}
      className="group block border border-[#e5e0d8] overflow-hidden bg-white hover:border-[#1a1a1a] transition-colors flex flex-col h-full"
    >
      {/* Product Image Container */}
      <div className="aspect-[3/4] overflow-hidden relative" style={{ backgroundColor: '#f0ece6' }}>
        <img
          src={product.images?.[0]?.url || product.images?.[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        {/* Personalization Badge - Shown if ML model boosted this item based on user prefs */}
        {product.personalizationBoost > 0 && (
          <div className="absolute top-2 right-2 bg-[#8B1A2B] px-2 py-0.5 shadow-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out pointer-events-none">
            <span className="text-[9px] uppercase tracking-[1px] text-white">✨ Top Pick</span>
          </div>
        )}
      </div>

      {/* Product Details & Actions */}
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

        <div className={`mt-4 pt-3 border-t border-gray-100 flex ${showFeedback ? 'justify-between' : 'justify-end'} items-center`}>
          {/* Save/Unsave Button */}
          <button
            onClick={(e) => onSave(e, product)}
            className={`rounded-full p-1.5 transition-all ${
              isSaved
                ? 'text-[#8B1A2B] hover:bg-red-50'
                : 'text-gray-400 hover:text-[#1a1a1a] hover:bg-gray-100'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save item'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>

          {/* Feedback Buttons (Only in Results View) */}
          {showFeedback && (
            <div className="flex gap-3">
              <button
                onClick={(e) => onFeedback(e, product, 'dislike')}
                className="text-gray-400 hover:text-[#1a1a1a] hover:bg-gray-100 rounded-full p-1.5 transition-all"
                title="Show less of this style"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
                </svg>
              </button>
              <button
                onClick={(e) => onFeedback(e, product, 'like')}
                className="text-gray-400 hover:text-[#8B1A2B] hover:bg-red-50 rounded-full p-1.5 transition-all"
                title="Show more of this style"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </a>
  );
};

export default ProductCard;