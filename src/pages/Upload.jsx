import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Button from '../components/Button';
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [savedCrops, setSavedCrops] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const imgRef = useRef(null);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('top');
  const [filters, setFilters] = useState({
    priceRange: 1000,
    storeType: { online: true, physical: true },
    preferredStores: []
  });

  const availableStores = ["ZARA", "H&M", "ASOS", "Terminal X", "Castro"];

  // פונקציה שהופכת חיתוך (Crop) לתמונת Base64 ממשית
  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return canvas.toDataURL('image/jpeg');
  };

  const onSelectFile = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onSelectFile,
    accept: { 'image/*': [] },
    multiple: false
  });

  const addCropToList = () => {
    if (completedCrop && savedCrops.length < 3) {
      setSavedCrops([...savedCrops, { crop: completedCrop, category: selectedCategory }]);
      setCrop(undefined);
      alert(`Item ${savedCrops.length + 1} added successfully!`);
    } else if (savedCrops.length >= 3) {
      alert("Maximum 3 items allowed per search.");
    }
  };

  const handleSearch = async () => {
    if (savedCrops.length === 0) {
      alert("Please select at least one item to search.");
      return;
    }

    setIsLoading(true);

    // הפיכת כל החיתוכים השמורים לתמונות Base64 עבור השרת
    const croppedImagesBase64 = savedCrops.map(item => ({
      image: getCroppedImg(imgRef.current, item.crop),
      category: item.category
    }));

    try {
      const response = await fetch(`${apiUrl}/api/search/visual-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: croppedImagesBase64,
          filters: filters
        }),
      });

      const data = await response.json();
      if (data.success) {
        navigate('/results', { state: { searchResults: data.data } });
      } else {
        alert("Search failed: " + data.error);
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("Make sure Backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetAll = () => {
    setImgSrc('');
    setSavedCrops([]);
    setCrop(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      {/* Header */}
      <div className="max-w-3xl w-full text-center mb-12">
        <h1 className="text-4xl font-extrabold text-[#800020] mb-2">Find Your Look</h1>
        <p className="text-gray-600 italic">Step 1: Upload. Step 2: Personalize & Select. Step 3: Find!</p>
      </div>

      {!imgSrc ? (
        /* Dropzone area */
        <div 
          {...getRootProps()} 
          className={`w-full max-w-xl p-20 border-4 border-dashed rounded-3xl cursor-pointer transition-all
            ${isDragActive ? 'border-[#800020] bg-red-50' : 'border-gray-300 bg-white hover:border-[#800020]'}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            <span className="text-6xl mb-4">🖼️</span>
            <p className="text-xl font-medium text-gray-700">Drop your outfit photo here</p>
          </div>
        </div>
      ) : (
        /* Main Workspace */
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl animate-fadeIn">
          
          {/* Sidebar: Filters */}
          <div className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 self-start">
            <h2 className="text-xl font-bold text-[#800020] mb-6 border-b pb-2">Personalize</h2>

            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Max Price: <span className="text-[#800020]">{filters.priceRange} ILS</span>
              </label>
              <input 
                type="range" 
                min="0" 
                max="2000" 
                step="50"
                value={filters.priceRange}
                onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#800020]"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-3">Store Type</label>
              <div className="flex gap-4">
                {['online', 'physical'].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={filters.storeType[type]}
                      onChange={() => setFilters({
                        ...filters, 
                        storeType: {...filters.storeType, [type]: !filters.storeType[type]}
                      })}
                      className="w-4 h-4 rounded border-gray-300 text-[#800020]"
                    />
                    <span className="capitalize text-sm text-gray-600 font-medium">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-2">
              <label className="block text-sm font-bold text-gray-700 mb-3">Preferred Stores</label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar text-left">
                {availableStores.map((store) => (
                  <label key={store} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-[#800020]"
                      onChange={(e) => {
                        const updated = e.target.checked 
                          ? [...filters.preferredStores, store]
                          : filters.preferredStores.filter(s => s !== store);
                        setFilters({...filters, preferredStores: updated});
                      }}
                    />
                    <span className="text-sm text-gray-600 group-hover:text-[#800020] transition-colors">{store}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Main Cropper Area */}
          <div className="flex-1 flex flex-col items-center">
            <div className="bg-white p-4 rounded-2xl shadow-2xl border border-gray-100 w-full flex justify-center overflow-hidden">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
              >
                <img 
                  ref={imgRef}
                  src={imgSrc} 
                  alt="Upload" 
                  className="max-h-[60vh] rounded-lg"
                />
              </ReactCrop>
            </div>

            {/* Action Bar */}
            <div className="mt-8 w-full max-w-2xl bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-black uppercase tracking-widest text-gray-400">Items Selected:</span>
                <div className="flex gap-2">
                  {[1, 2, 3].map((num) => (
                    <div 
                      key={num}
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300
                        ${savedCrops.length >= num ? 'bg-[#800020] border-[#800020] text-white shadow-md' : 'border-gray-100 text-gray-200'}`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>

              {/* הכפתורים והבחירה */}
              <div className="flex flex-wrap justify-center items-center gap-4 w-full">
                <Button onClick={resetAll} className="bg-gray-400 hover:bg-gray-500 px-6 py-2 text-sm">
                  Reset
                </Button>
                
                <div className="flex items-center gap-2 border-2 border-gray-200 rounded-lg pr-1 bg-white">
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 text-sm bg-transparent outline-none text-gray-700 font-medium cursor-pointer"
                  >
                    <option value="top">Top (Shirt/Jacket)</option>
                    <option value="bottom">Bottom (Pants/Skirt)</option>
                    <option value="shoes">Shoes</option>
                  </select>
                  <Button 
                    onClick={addCropToList} 
                    className="px-6 py-1.5 text-sm h-full rounded-md"
                    disabled={!completedCrop || isLoading}
                  >
                    + Add
                  </Button>
                </div>

                <Button 
                  onClick={handleSearch} 
                  disabled={savedCrops.length === 0 || isLoading}
                  className={`${savedCrops.length === 0 ? 'opacity-50 grayscale' : ''} px-10 py-2 text-sm shadow-lg bg-[#800020] text-white font-bold ml-auto`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Searching AI...
                    </div>
                  ) : (
                    `Find My Look (${savedCrops.length})`
                  )}
                </Button>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Upload;