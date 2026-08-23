import React from 'react';

/**
 * ImageStrip Component
 * Displays a continuous scrolling strip of product images for the authentication screens.
 * Uses a CSS animation ('scroll-strip') defined in index.css to create an infinite loop effect.
 * 
 * @param {Array} images - Array of product objects containing image URLs.
 */
const ImageStrip = ({ images }) => {
  if (!images || images.length === 0) return null;

  return (
    <div style={{ overflow: 'hidden', flexShrink: 0 }}>
      <div style={{
        display: 'flex',
        gap: '4px',
        width: 'max-content',
        animation: 'scroll-strip 40s linear infinite',
      }}>
        {/* Duplicating the images array to create a seamless infinite scroll effect */}
        {[...images, ...images].map((product, i) => (
          <div key={i} style={{ height: '180px', width: '135px', flexShrink: 0 }}>
            <img
              src={product.images[0].url}
              alt="Fashion item"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageStrip;