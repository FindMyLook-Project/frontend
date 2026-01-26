import React from 'react';
import { Routes, Route } from 'react-router-dom';

//temporery pages
const UploadPage = () => <div className="p-10 text-center text-xl font-bold text-indigo-600">דף העלאת תמונה (כאן יהיה ה-Drag & Drop)</div>;
const ResultsPage = () => <div className="p-10 text-center text-xl font-bold text-slate-700">דף תוצאות החיפוש (כאן יוצגו הפריטים מרנואר)</div>;

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UploadPage />} />
      <Route path="/results" element={<ResultsPage />} />
    </Routes>
  );
};

export default AppRoutes;