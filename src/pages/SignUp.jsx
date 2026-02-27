import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const SingUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    //send the parameters to the server and create an account 
    console.log("Signing up with:", formData);
    navigate('/login'); // after the account was created, move to the login page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-[#800020]">Find My Look</h2>
          <p className="text-gray-500 mt-3">Create your account</p>
        </div>
        
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">First Name</label>
              <input 
                name="firstName"
                type="text" 
                required 
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Last Name</label>
              <input 
                name="lastName"
                type="text" 
                required 
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700">Email</label>
            <input 
              name="email"
              type="email" 
              required 
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input 
              name="password"
              type="password" 
              required 
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-center mt-8">
            <Button type="submit" className="w-full sm:w-auto cursor-pointer">Create Account</Button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm border-t pt-6 border-gray-100">
          <span className="text-gray-600">Already have an account? </span>
          <button 
            onClick={() => navigate('/login')} 
            className="text-[#800020] font-bold hover:underline cursor-pointer transition-all"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingUp;