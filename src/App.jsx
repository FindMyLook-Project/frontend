import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        {/* Navbar קבוע עם Tailwind */}
        <nav className="flex justify-between items-center p-6 bg-white shadow-sm border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">👗</span>
            <h1 className="text-2xl font-black tracking-tight text-indigo-600">FindMyLook</h1>
          </div>
          <div className="space-x-8 font-semibold text-slate-600">
            <Link to="/" className="hover:text-indigo-500 transition-colors">Upload</Link>
            <Link to="/results" className="hover:text-indigo-500 transition-colors">Results</Link>
          </div>
        </nav>

        {/* כאן יוצג התוכן של כל Route */}
        <main className="container mx-auto mt-10 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 min-h-[400px]">
            <AppRoutes />
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;