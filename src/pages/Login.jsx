import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sideImage, setSideImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${apiUrl}/api/search/random?limit=3`)
      .then(r => r.json())
      .then(d => { if (d.success && d.data.length > 0) setSideImage(d.data[0]); })
      .catch(() => {});
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed. Please check your credentials.');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/upload');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f8f6f3' }}>

      {/* Left: product image */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden" style={{ backgroundColor: '#e5e0d8' }}>
        {sideImage && (
          <img
            src={sideImage.images[0].url}
            alt="Fashion"
            className="w-full h-full object-cover object-top"
          />
        )}
        <div className="absolute bottom-10 left-10">
          <p
            className="text-white text-2xl leading-snug"
            style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}
          >
            Discover your<br />perfect look
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-10 md:px-20 xl:px-28">
        <div className="mb-12">
          <span
            className="text-[#8B1A2B] text-xs uppercase tracking-[4px]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            FIND MY LOOK
          </span>
        </div>

        <h2
          className="text-3xl text-[#1a1a1a] mb-2 leading-snug"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Welcome back
        </h2>
        <p className="text-[10px] text-gray-400 uppercase tracking-[2px] mb-10">Sign in to continue</p>

        <form onSubmit={handleLogin} className="space-y-7">
          <div>
            <label className="block text-[10px] uppercase tracking-[2px] text-gray-400 mb-2">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              className="w-full border-0 border-b border-[#e5e0d8] bg-transparent pb-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[2px] text-gray-400 mb-2">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              className="w-full border-0 border-b border-[#e5e0d8] bg-transparent pb-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-[11px] text-red-600 tracking-wide">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1a1a1a] hover:bg-[#333] text-white text-[11px] uppercase tracking-[2.5px] py-4 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-xs text-gray-400">
          New here?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-[#1a1a1a] underline underline-offset-4 cursor-pointer hover:text-gray-500 transition-colors"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
