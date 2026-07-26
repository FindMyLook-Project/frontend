import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ITEM_STEPS = [
  { num: '01', label: 'Upload' },
  { num: '02', label: 'Select items' },
  { num: '03', label: 'Find it' },
];

const TOTAL_LOOK_STEPS = [
  { num: '01', label: 'Upload' },
  { num: '02', label: 'Find Look' },
];

const STAGE_HEIGHT_EMPTY = 140;
const STAGE_HEIGHT_ACTIVE = 'min(72vh, 680px)';

const Upload = () => {
  const [searchMode, setSearchMode] = useState('totalLook');
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

  const isTotalLook = searchMode === 'totalLook';
  const steps = isTotalLook ? TOTAL_LOOK_STEPS : ITEM_STEPS;
  const hasImage = Boolean(imgSrc);
  const activeStep = hasImage ? 1 : 0;

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

  const getUserId = () => {
    const userStorage = localStorage.getItem('user');
    if (!userStorage) return null;
    try {
      const user = JSON.parse(userStorage);
      return user._id || user.id || null;
    } catch {
      return null;
    }
  };

  const getCroppedImg = (image, cropRect) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = cropRect.width;
    canvas.height = cropRect.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      cropRect.x * scaleX, cropRect.y * scaleY,
      cropRect.width * scaleX, cropRect.height * scaleY,
      0, 0, cropRect.width, cropRect.height
    );
    return canvas.toDataURL('image/jpeg');
  };

  const onSelectFile = (acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onSelectFile,
    accept: { 'image/*': [] },
    multiple: false,
    disabled: hasImage,
    noClick: hasImage,
    noKeyboard: hasImage,
  });

  const resetAll = () => {
    setImgSrc('');
    setSavedCrops([]);
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  const switchMode = (mode) => {
    setSearchMode(mode);
    resetAll();
  };

  const addCropToList = () => {
    if (completedCrop && savedCrops.length < 3) {
      setSavedCrops([...savedCrops, { crop: completedCrop }]);
      setCrop(undefined);
    } else if (savedCrops.length >= 3) {
      alert('Maximum 3 items allowed per search.');
    }
  };

  const handleItemSearch = async () => {
    if (savedCrops.length === 0) {
      alert('Please select at least one item to search.');
      return;
    }
    setIsLoading(true);
    const croppedImagesBase64 = savedCrops.map(item => ({
      image: getCroppedImg(imgRef.current, item.crop),
    }));

    try {
      const response = await fetch(`${apiUrl}/api/search/visual-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: croppedImagesBase64,
          filters,
          userId: getUserId(),
        }),
      });
      const data = await response.json();
      if (data.success) {
        navigate('/results', {
          state: {
            mode: 'item',
            searchResults: data.data,
            originalItems: croppedImagesBase64,
            isPersonalized: data.isPersonalized,
            appliedStores: data.appliedStores,
          },
        });
      } else {
        alert('Search failed: ' + data.error);
      }
    } catch {
      alert('Make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTotalLookSearch = async () => {
    if (!imgSrc) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/search/total-look`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imgSrc,
          filters,
          userId: getUserId(),
        }),
      });
      const data = await response.json();
      if (data.success) {
        navigate('/results', {
          state: {
            mode: 'totalLook',
            sourceImage: imgSrc,
            totalLook: data.look,
            isPersonalized: data.isPersonalized,
            appliedStores: data.appliedStores,
          },
        });
      } else {
        alert('Search failed: ' + (data.error || 'Unknown error'));
      }
    } catch {
      alert('Make sure the backend and ML services are running.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadingButton = (label) => (
    <>
      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
      {label}
    </>
  );

  const dropzoneProps = hasImage ? {} : getRootProps();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8f6f3' }}>
      <Navbar />

      {/* Photo strip — full on empty, collapses after upload */}
      <div
        className="overflow-hidden transition-all duration-500 ease-out"
        style={{
          height: hasImage ? 0 : 180,
          opacity: hasImage ? 0 : 1,
          flexShrink: 0,
        }}
      >
        {bgImages.length > 0 ? (
          <div style={{ overflow: 'hidden', height: 180 }}>
            <div
              style={{
                display: 'flex',
                gap: '4px',
                width: 'max-content',
                animation: 'scroll-strip 40s linear infinite',
              }}
            >
              {[...bgImages, ...bgImages].map((product, i) => (
                <div key={i} style={{ height: '180px', width: '135px', flexShrink: 0, backgroundColor: '#e8e3dc' }}>
                  <img
                    src={product.images[0].url}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ height: 180, backgroundColor: '#e8e3dc' }} />
        )}
      </div>

      <div
        className={`w-full mx-auto px-6 transition-all duration-500 ease-out ${
          hasImage ? 'max-w-7xl py-6' : 'max-w-xl pt-4 pb-8'
        }`}
      >
        {/* Hero — only in empty state */}
        {!hasImage && (
          <div className="text-center mb-3 animate-[fadeIn_0.4s_ease-out]">
            <p className="text-xs text-gray-400 mb-1 font-light">
              Upload a photo to find similar styles
            </p>
            <h2 className="font-display text-2xl md:text-3xl text-[#1a1a1a] mb-3 leading-tight">
              Find Your Look
            </h2>
          </div>
        )}

        {/* Mode + steps */}
        <div className={`mb-4 ${hasImage ? 'max-w-xl' : 'w-full'}`}>
          <div className="flex border border-[#e5e0d8] mb-3 w-full">
            <button
              type="button"
              onClick={() => switchMode('totalLook')}
              className={`flex-1 py-2.5 text-[11px] uppercase tracking-[2px] transition-colors cursor-pointer ${
                isTotalLook ? 'bg-[#1a1a1a] text-white' : 'bg-white text-gray-400 hover:text-[#1a1a1a]'
              }`}
            >
              Find Total Look
            </button>
            <button
              type="button"
              onClick={() => switchMode('item')}
              className={`flex-1 py-2.5 text-[11px] uppercase tracking-[2px] border-l border-[#e5e0d8] transition-colors cursor-pointer ${
                !isTotalLook ? 'bg-[#1a1a1a] text-white' : 'bg-white text-gray-400 hover:text-[#1a1a1a]'
              }`}
            >
              Find Items
            </button>
          </div>

          <div className="w-full border border-[#e5e0d8] h-[58px]">
            <div className={`grid h-full ${isTotalLook ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {steps.map((step, i) => (
                <div
                  key={`${searchMode}-${step.num}`}
                  className={`px-4 py-2 text-left ${i < steps.length - 1 ? 'border-r border-[#e5e0d8]' : ''}`}
                >
                  <p className={`text-xs font-normal ${i === activeStep ? 'text-[#8B1A2B]' : 'text-gray-300'}`}>{step.num}</p>
                  <p className={`text-sm mt-0.5 ${i === activeStep ? 'text-[#1a1a1a]' : 'text-gray-300'}`}>{step.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Workspace */}
        <div className="flex flex-col lg:flex-row gap-6">
          {hasImage && (
            <div className="w-full lg:w-72 shrink-0 bg-white border border-[#e5e0d8] p-6 self-start upload-fade-in">
              <p className="text-[10px] uppercase tracking-[3px] text-gray-400 mb-6 pb-4 border-b border-[#e5e0d8]">
                Personalize
              </p>
              <div className="mb-7">
                <label className="block text-[10px] uppercase tracking-[2px] text-gray-400 mb-3">
                  Max price:{' '}
                  <span className="text-[#1a1a1a] font-normal">₪{filters.priceRange}</span>
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
                <label className="block text-[10px] uppercase tracking-[2px] text-gray-400 mb-3">Store type</label>
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
                <label className="block text-[10px] uppercase tracking-[2px] text-gray-400 mb-3">Preferred stores</label>
                {availableStores.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {availableStores.map((store) => (
                      <label key={store.key} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-3 h-3 border border-[#e5e0d8] accent-[#1a1a1a]"
                          checked={filters.preferredStores.includes(store.key)}
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
          )}

          <div className="flex-1 flex flex-col min-w-0">
            <div
              {...dropzoneProps}
              className={`relative w-full bg-white border transition-all duration-500 ease-out ${
                !hasImage && isDragActive ? 'border-[#1a1a1a]' : 'border-[#e5e0d8]'
              } ${!hasImage ? 'cursor-pointer overflow-hidden' : 'overflow-auto'}`}
              style={
                hasImage
                  ? { minHeight: 320, maxHeight: STAGE_HEIGHT_ACTIVE }
                  : { height: STAGE_HEIGHT_EMPTY, minHeight: STAGE_HEIGHT_EMPTY }
              }
            >
              {!hasImage && <input {...getInputProps()} />}

              {!hasImage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                  <p className="text-sm text-gray-500">Drop your outfit photo here</p>
                  <p className="text-xs text-gray-300 mt-1">or click to browse</p>
                </div>
              )}

              {hasImage && (
                <div className="flex items-center justify-center p-4 w-full">
                  {isTotalLook ? (
                    <img
                      src={imgSrc}
                      alt="Your outfit"
                      className="max-h-[min(68vh,640px)] max-w-full w-auto object-contain"
                    />
                  ) : (
                    <ReactCrop crop={crop} onChange={(c) => setCrop(c)} onComplete={(c) => setCompletedCrop(c)}>
                      <img
                        ref={imgRef}
                        src={imgSrc}
                        alt="Upload"
                        className="max-h-[min(68vh,640px)] w-auto max-w-full object-contain mx-auto block"
                      />
                    </ReactCrop>
                  )}
                </div>
              )}
            </div>

            {hasImage && (
              <div className="mt-4 bg-white border border-[#e5e0d8] p-5 upload-fade-in">
                {isTotalLook ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={resetAll}
                      className="text-[11px] uppercase tracking-[2px] text-gray-400 border border-[#e5e0d8] px-5 py-2.5 hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors cursor-pointer"
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleTotalLookSearch}
                      disabled={isLoading}
                      className="ml-auto px-10 py-2.5 bg-[#1a1a1a] text-white text-[11px] uppercase tracking-[2px] hover:bg-[#333] transition-colors cursor-pointer disabled:opacity-40 flex items-center gap-2"
                    >
                      {isLoading ? loadingButton('Analyzing outfit...') : 'Find Total Look'}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-[10px] uppercase tracking-[2px] text-gray-400">Items selected:</span>
                      <div className="flex gap-2">
                        {[1, 2, 3].map((num) => (
                          <div
                            key={num}
                            className={`w-7 h-7 flex items-center justify-center text-xs font-normal border transition-colors duration-300 ${
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
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={resetAll}
                        className="text-[11px] uppercase tracking-[2px] text-gray-400 border border-[#e5e0d8] px-5 py-2.5 cursor-pointer hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors"
                      >
                        Reset
                      </button>
                      <button
                        onClick={addCropToList}
                        disabled={!completedCrop || isLoading}
                        className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[11px] uppercase tracking-[2px] cursor-pointer disabled:opacity-40"
                      >
                        + Add
                      </button>
                      <button
                        onClick={handleItemSearch}
                        disabled={savedCrops.length === 0 || isLoading}
                        className="ml-auto px-10 py-2.5 bg-[#1a1a1a] text-white text-[11px] uppercase tracking-[2px] cursor-pointer disabled:opacity-40 flex items-center gap-2"
                      >
                        {isLoading ? loadingButton('Searching...') : `Find My Look (${savedCrops.length})`}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
