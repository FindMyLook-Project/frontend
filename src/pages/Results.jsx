import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button'; 

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchResults = location.state?.searchResults || [];
  const originalItems = location.state?.originalItems || [];

  const formatCategoryName = (category) => {
    if (!category) return "Item";
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-[#800020]">Search Results</h1>
          <Button onClick={() => navigate('/upload')} className="bg-gray-500 hover:bg-gray-600 px-6 py-2 text-white rounded-full font-medium">
            New Search
          </Button>
        </div>

        {searchResults.map((searchData, index) => {
          const originalItem = originalItems[searchData.itemIndex];
          const products = searchData.results;

          return (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10 animate-fadeIn">
              
              <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-6">
                
                <div className="w-20 h-20 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  {originalItem?.image ? (
                    <img
                      src={originalItem.image}
                      alt="Your crop"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">👗</span> 
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {originalItem ? `${formatCategoryName(originalItem.category)} Matches` : 'Top Matches Found'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Showing the best results based on your selection
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {products.length > 0 ? (
                  products.map((product, pIndex) => (
                    <div key={pIndex} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group">
                      
                      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                        <img
                          src={product.images?.[0]?.url || product.images?.[0] || 'placeholder.jpg'}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute bottom-2 left-2 bg-[#800020] text-white text-xs font-bold px-2 py-1 rounded">
                          {Math.round(product.searchScore * 100)}% Match
                        </div>
                        <div className="absolute top-2 right-2 bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded shadow-sm">
                          ₪{product.price}
                        </div>
                      </div>

                      <div className="p-3 flex flex-col flex-1">
                        <h3 className="text-sm font-bold text-gray-800 line-clamp-1 text-right" dir="rtl">{product.title}</h3>
                        <p className="text-xs text-gray-500 mb-3 text-right" dir="rtl">{product.storeName || product.brand}</p>
                        <a
                          href={product.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-auto block text-center w-full border border-[#800020] text-[#800020] hover:bg-[#800020] hover:text-white transition-colors py-1.5 rounded-full text-xs font-bold"
                        >
                          Buy Product
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-10 text-center text-gray-500 font-medium">
                    No exact matching products found for this item. Try adjusting the filters.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Results;