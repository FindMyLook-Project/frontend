import React from 'react';
import Button from '../components/Button';

const mockResults = [
  {
    originalItem: "https://via.placeholder.com/150", 
    category: "Shirt",
    items: [
      { id: 1, name: "Cotton T-Shirt", price: 89, store: "ZARA", type: "Both", url: "#", image: "https://via.placeholder.com/200" },
      { id: 2, name: "Slim Fit Shirt", price: 120, store: "H&M", type: "Online", url: "#", image: "https://via.placeholder.com/200" },
    ]
  },
  {
    originalItem: "https://via.placeholder.com/150",
    category: "Pants",
    items: [] 
  }
];

const Results = () => {
  const searchGroups = [
    {
      id: 1,
      title: "Shirt",
      originalImage: "https://via.placeholder.com/150",
      results: [
        { id: 101, name: "Casual White Shirt", price: 99, store: "ZARA", type: "Both", link: "https://zara.com", img: "https://via.placeholder.com/200" },
        { id: 102, name: "Classic Button Down", price: 150, store: "H&M", type: "Online", link: "https://hm.com", img: "https://via.placeholder.com/200" },
        { id: 103, name: "Linen Summer Shirt", price: 180, store: "Castro", type: "Physical", link: "https://castro.co.il", img: "https://via.placeholder.com/200" },
      ]
    },
    {
      id: 2,
      title: "Pants",
      originalImage: "https://via.placeholder.com/150",
      results: [] 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-[#800020]">Search Results</h1>
          <Button to="/upload" className="bg-gray-500 text-sm">New Search</Button>
        </div>

        {searchGroups.map((group) => (
          <div key={group.id} className="mb-16 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-6 mb-8 border-b pb-6">
              <div className="text-center">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">You searched for:</p>
                <img src={group.originalImage} alt="Original" className="w-24 h-24 object-cover rounded-xl border-2 border-[#800020]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Results for {group.title}</h2>
                <p className="text-gray-500 text-sm">Based on your visual search and personal filters</p>
              </div>
            </div>

            {group.results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {group.results.map((product) => (
                  <div key={product.id} className="group bg-gray-50 rounded-2xl p-4 transition-all hover:shadow-md border border-transparent hover:border-gray-200">
                    <div className="relative mb-4 overflow-hidden rounded-xl aspect-[3/4]">
                      <img src={product.img} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-[#800020]">
                        {product.price} ₪
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-gray-800 truncate">{product.name}</h3>
                    <div className="flex justify-between items-center mt-1 mb-4">
                      <span className="text-sm text-gray-500 font-medium">{product.store}</span>
                      <span className="text-[10px] bg-gray-200 px-2 py-0.5 rounded text-gray-600 uppercase">{product.type}</span>
                    </div>

                    <a 
                      href={product.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-center w-full py-2 bg-white border border-[#800020] text-[#800020] rounded-full text-sm font-bold hover:bg-[#800020] hover:text-white transition-colors"
                    >
                      View Product
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <span className="text-4xl mb-4">🔍</span>
                <p className="text-gray-600 font-medium">לא נמצאה תוצאה דומה לפריט שחיפשת במאגר</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or selection</p>
              </div>
            )}
            
            {group.results.length >= 5 && (
              <div className="mt-8 text-center">
                <button className="text-[#800020] font-bold hover:underline transition-all">
                  Show More Results +
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;