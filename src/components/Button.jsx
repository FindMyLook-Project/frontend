import React from 'react';
import { useNavigate } from 'react-router-dom';

const Button = ({ children, to, type = "button", className = "" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      className={`
        bg-[#800020] hover:bg-[#600018] 
        text-white font-medium 
        py-2 px-8 
        rounded-full 
        shadow-md transition-all duration-200
        active:scale-95
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;