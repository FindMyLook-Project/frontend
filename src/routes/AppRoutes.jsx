import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import SingUp from '../pages/SingUp';
import Upload from '../pages/Upload';
import Results from '../pages/Results';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SingUp />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  );
};

export default AppRoutes;