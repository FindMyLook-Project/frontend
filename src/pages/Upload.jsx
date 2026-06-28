import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const STEPS = [
  { num: '01', label: 'Upload' },
  { num: '02', label: 'Select item' },
  { num: '03', label: 'Find it' },
];

const Upload = () => {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [savedCrops, setSavedCrops] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const imgRef = useRef(null);
  const navigate = useNavigate();
  const [availableStores, setAvailableStores] = useState([]);
  const [bgImages, setBgImages] = useState([]);

  const [filters, setFilters] = useState({
    priceRange: 1000,
    storeType: { online: true, physical: true },
    preferredStores: [],
  });

  useEffect(() => {
    fetch(`${apiUrl}/api/search/stores`)
      .then(r => r.json())
      .then(d => { if (d.success) setAvailableStores(d.data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${apiUrl}/api/products/random?limit=20`)
      .then(r => r.json())
      .then(d => { if (d.success) setBgImages(d.data.filter(p => p.images?.[0]?.url)); })
      .catch(() => {});
  }, []);

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, crop.width, crop.height);
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
    multiple: false,
  });

  const addCropToList = () => {
    if (completedCrop && savedCrops.length < 3) {
      setSavedCrops([...savedCrops, { crop: completedCrop }]);
      setCrop(undefined);
    } else if (savedCrops.length >= 3) {
      alert('Maximum 3 items allowed per search.');
    }
  };

  const handleSearch = async () => {
    if (savedCrops.length === 0) {
      alert('Please select at least one item to search.');
      return;
    }
    setIsLoading(true);
    
    const croppedImagesBase64 = savedCrops.map(item => ({
      image: getCroppedImg(imgRef.current, item.crop),
    }));

    let currentUserId = null;
    const userStorage = localStorage.getItem('user');
    if (userStorage) {
      try {
        const loggedInUser = JSON.parse(userStorage);
        currentUserId = loggedInUser._id || loggedInUser.id;
      } catch (e) {
        console.error("Error parsing user data");
      }
    }

    try {
      const response = await fetch(`${apiUrl}/api/search/visual-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: croppedImagesBase64, 
          filters,
          userId: currentUserId 
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        navigate('/results', { 
          state: { 
            searchResults: data.data, 
            originalItems: croppedImagesBase64,
            isPersonalized: data.isPersonalized, 
            appliedStores: data.appliedStores   
          } 
        });
      } else {
        alert('Search failed: ' + data.error);
      }
    } catch (error) {
      alert('Make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAll = () => {
    setImgSrc('');
    setSavedCrops([]);
    setCrop(undefined);
  };

  const activeStep = imgSrc ? 1 : 0;

  /* ─── Pre-upload view ─────────────────────────────────────── */
  if (!imgSrc) {
    return (
      <div style={{ backgroundColor: '#f8f6f3', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Navbar />

        {/* Hero: 5-column portrait grid — fills all space not taken by upload section */}
        <div style={{ display: 'flex', width: '100%', margin: 0, padding: 0, flex: '1 1 0', minHeight: 0, overflow: 'hidden' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ flex: 1, overflow: 'hidden', backgroundColor: '#e8e3dc' }}>
              {bgImages[i] && (
                <img
                  src={bgImages[i].images[0].url}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Upload section — sized by its content; hero fills the rest */}
        <div className="max-w-xl mx-auto px-6 py-6 text-center" style={{ flexShrink: 0 }}>
          <p className="text-[10px] uppercase tracking-[3px] text-gray-400 mb-2">Upload your look</p>
          <h2
            className="text-3xl md:text-4xl text-[#1a1a1a] mb-2 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Find what you're<br />wearing
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Upload a photo and we'll find every item for you to shop
          </p>

          {/* Steps */}
          <div className="grid grid-cols-3 border border-[#e5e0d8] mb-4">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className={`px-4 py-3 text-left ${i < 2 ? 'border-r border-[#e5e0d8]' : ''}`}
              >
                <p className={`text-xs font-semibold ${i === activeStep ? 'text-[#8B1A2B]' : 'text-gray-300'}`}>
                  {step.num}
                </p>
                <p className={`text-sm mt-0.5 ${i === activeStep ? 'text-[#1a1a1a]' : 'text-gray-300'}`}>
                  {step.label}
                </p>
              </div>
            ))}
          </div>

          {/* Drop zone */}
          <div
            {...getRootProps()}
            className={`w-full py-7 border border-[#e5e0d8] bg-white cursor-pointer transition-colors ${
              isDragActive ? 'border-[#1a1a1a] bg-[#f8f6f3]' : 'hover:border-[#1a1a1a]'
            }`}
          >
            <input {...getInputProps()} />
            <svg className="w-7 h-7 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm text-gray-500">Drop your outfit photo here</p>
            <p className="text-xs text-gray-300 mt-1">or click to browse</p>
          </div>
        </div>

      </div>
    );
  }

  /* ─── Post-upload / crop view ─────────────────────────────── */
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f6f3' }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Steps — step 02 active */}
        <div className="grid grid-cols-3 border border-[#e5e0d8] mb-8 max-w-xl">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={`px-4 py-3 text-left ${i < 2 ? 'border-r border-[#e5e0d8]' : ''}`}
            >
              <p className={`text-xs font-semibold ${i === 1 ? 'text-[#8B1A2B]' : 'text-gray-300'}`}>
                {step.num}
              </p>
              <p className={`text-sm mt-0.5 ${i === 1 ? 'text-[#1a1a1a]' : 'text-gray-300'}`}>
                {step.label}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left: Personalize filters */}
          <div className="w-full lg:w-72 bg-white border border-[#e5e0d8] p-6 self-start shrink-0">
            <p className="text-[10px] uppercase tracking-[3px] text-gray-400 mb-6 pb-4 border-b border-[#e5e0d8]">
              Personalize
            </p>

            <div className="mb-7">
              <label className="block text-[10px] uppercase tracking-[2px] text-gray-400 mb-3">
                Max price:{' '}
                <span className="text-[#1a1a1a] font-medium">₪{filters.priceRange}</span>
              </label>
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                className="w-full h-px bg-[#e5e0d8] appearance-none cursor-pointer accent-[#1a1a1a]"
              />
            </div>

            <div className="mb-7">
              <label className="block text-[10px] uppercase tracking-[2px] text-gray-400 mb-3">
                Store type
              </label>
              <div className="flex gap-4">
                {['online', 'physical'].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.storeType[type]}
                      onChange={() =>
                        setFilters({
                          ...filters,
                          storeType: { ...filters.storeType, [type]: !filters.storeType[type] },
                        })
                      }
                      className="w-3 h-3 border border-[#e5e0d8] accent-[#1a1a1a]"
                    />
                    <span className="capitalize text-xs text-gray-500">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[2px] text-gray-400 mb-3">
                Preferred stores
              </label>
              {availableStores.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {availableStores.map((store) => (
                    <label key={store.key} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-3 h-3 border border-[#e5e0d8] accent-[#1a1a1a]"
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...filters.preferredStores, store.key]
                            : filters.preferredStores.filter((s) => s !== store.key);
                          setFilters({ ...filters, preferredStores: updated });
                        }}
                      />
                      <span className="text-xs text-gray-500 group-hover:text-[#1a1a1a] transition-colors">
                        {store.name}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-300 italic">Loading stores...</p>
              )}
            </div>
          </div>

          {/* Right: image + controls */}
          <div className="flex-1 flex flex-col">

            {/* Crop area */}
            <div className="bg-white border border-[#e5e0d8] w-full flex justify-center overflow-hidden p-4">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
              >
                <img
                  ref={imgRef}
                  src={imgSrc}
                  alt="Upload"
                  className="max-h-[30vh] w-auto object-contain mx-auto"
                />
              </ReactCrop>
            </div>

            {/* Controls */}
            <div className="mt-6 bg-white border border-[#e5e0d8] p-6">

              {/* Item counter */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[10px] uppercase tracking-[2px] text-gray-400">Items selected:</span>
                <div className="flex gap-2">
                  {[1, 2, 3].map((num) => (
                    <div
                      key={num}
                      className={`w-7 h-7 flex items-center justify-center text-xs font-medium border transition-all duration-200 ${
                        savedCrops.length >= num
                          ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white'
                          : 'border-[#e5e0d8] text-gray-300'
                      }`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons row */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={resetAll}
                  className="text-[11px] uppercase tracking-[2px] text-gray-400 border border-[#e5e0d8] px-5 py-2.5 hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors cursor-pointer"
                >
                  Reset
                </button>

                <button
                  onClick={addCropToList}
                  disabled={!completedCrop || isLoading}
                  className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[11px] uppercase tracking-[2px] hover:bg-[#333] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  + Add
                </button>

                {/* Search */}
                <button
                  onClick={handleSearch}
                  disabled={savedCrops.length === 0 || isLoading}
                  className="ml-auto px-10 py-2.5 bg-[#1a1a1a] text-white text-[11px] uppercase tracking-[2px] hover:bg-[#333] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                      Searching...
                    </>
                  ) : (
                    `Find My Look (${savedCrops.length})`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;