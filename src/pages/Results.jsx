import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // משיכת הנתונים מה-state - שימי לב לשם searchResults
  const resultsFromSearch = location.state?.searchResults || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-[#800020]">Search Results</h1>
          <Button onClick={() => navigate('/upload')} className="bg-gray-500 text-sm">
            New Search
          </Button>
        </div>

        {resultsFromSearch.length > 0 ? (
          resultsFromSearch.map((group, idx) => (
            <div key={idx} className="mb-16 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-6 mb-8 border-b pb-6">
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">Item #{idx + 1}:</p>
                  <div className="w-24 h-24 bg-[#800020]/10 rounded-xl border-2 border-[#800020] flex items-center justify-center">
                    <span className="text-3xl">👕</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Top Matches Found</h2>
                  <p className="text-gray-500 text-sm">Showing the best results based on your selection</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {group.results.map((product) => (
                  <div key={product._id} className="group bg-gray-50 rounded-2xl p-4 transition-all hover:shadow-md border border-transparent hover:border-gray-200">
                    <div className="relative mb-4 overflow-hidden rounded-xl aspect-[3/4]">
                      <img 
                        src={product.images?.[0]?.url || "https://via.placeholder.com/300"} 
                        alt={product.title} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                      />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-[#800020]">
                        {product.price} ₪
                      </div>
                      <div className="absolute bottom-2 left-2 bg-[#800020]/90 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                        {Math.round(product.searchScore * 100)}% Match
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-gray-800 truncate">{product.title}</h3>
                    <div className="flex justify-between items-center mt-1 mb-4">
                      <span className="text-sm text-gray-500 font-medium">{product.storeName}</span>
                    </div>

                    <a 
                      href={product.productUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-center w-full py-2 bg-white border border-[#800020] text-[#800020] rounded-full text-sm font-bold hover:bg-[#800020] hover:text-white transition-colors"
                    >
                      Buy Product
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <span className="text-6xl mb-6">🔍</span>
            <h2 className="text-2xl font-bold text-gray-800">No Results Found</h2>
            <p className="text-gray-500 mt-2">Try adjusting your crop area or filters and search again.</p>
            <Button onClick={() => navigate('/upload')} className="mt-8 px-10">Back to Upload</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;