import React from 'react';
import { useNavigate } from 'react-router-dom';

const Button = ({ children, to, onClick, type = "button", className = "", disabled = false }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (disabled) return;

    if (onClick) {
      onClick(e);
    } 
    else if (to) {
      navigate(to);
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`
        bg-[#800020] hover:bg-[#600018] 
        text-white font-medium 
        py-2 px-8 
        rounded-full 
        shadow-md transition-all duration-200
        active:scale-95
        ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;