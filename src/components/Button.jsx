import React from 'react';
import { useNavigate } from 'react-router-dom';

const Button = ({ children, to, onClick, type = "button", className = "", disabled = false }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (disabled) return;
    if (onClick) onClick(e);
    else if (to) navigate(to);
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`
        bg-[#1a1a1a] hover:bg-[#333]
        text-white text-[11px] font-normal
        py-3 px-8
        uppercase tracking-[2.5px]
        transition-colors duration-200
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
