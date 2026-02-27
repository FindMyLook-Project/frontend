import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    //**********add backend logic -confirm email + password**********
    e.preventDefault();
    console.log("Logging in with:", email, password);
    navigate('/upload'); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-red-800">Find My Look</h2>
          <p className="text-gray-500 mt-2">Login to find your style</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              required 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              required 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-center mt-6  ">
            <Button to="/upload" className="cursor-pointer" > Login</Button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm border-t pt-6 border-gray-100">
          <span className="text-gray-600">Don't have an account? </span>
          <button 
            onClick={() => navigate('/signup')} 
            className="text-[#800020] font-bold hover:underline cursor-pointer hover:text-[#6 00018] transition-colors"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;