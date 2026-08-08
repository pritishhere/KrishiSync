import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Login from './pages/Login';
import MainContentLayout from './components/layout/MainContentLayout';

// Mock components for scaffolding the layout
const Dashboard = () => <div className="p-4 text-[16px] text-gray-800">Dashboard Content</div>;
const Scanner = () => <div className="p-4 text-[16px] text-gray-800">Scanner Content</div>;
const Mandi = () => <div className="p-4 text-[16px] text-gray-800">Mandi Content</div>;
const AgriPool = () => <div className="p-4 text-[16px] text-gray-800">Agri-Pool Content</div>;

// Route Guard Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAppContext();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Application Routes Structure
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Authentication Route */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected Layout Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainContentLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="scanner" element={<Scanner />} />
        <Route path="mandi" element={<Mandi />} />
        <Route path="agri-pool" element={<AgriPool />} />
      </Route>
    </Routes>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}