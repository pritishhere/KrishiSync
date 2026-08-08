import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Login from './pages/Login';
import MainContentLayout from './components/layout/MainContentLayout';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import Mandi from './pages/Mandi';
import AgriPool from './pages/Agripool';
import BotGuide from './pages/Botguide';

// Route Guard Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAppContext();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Layout Wrapper for React Router v7 Nested Routes
const ProtectedLayoutWrapper = () => (
  <ProtectedRoute>
    <MainContentLayout>
      <Outlet />
    </MainContentLayout>
  </ProtectedRoute>
);

// Application Routes Structure
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Authentication Route */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected Layout Routes */}
      <Route element={<ProtectedLayoutWrapper />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="scanner" element={<Scanner />} />
        <Route path="mandi" element={<Mandi />} />
        <Route path="agri-pool" element={<AgriPool />} />
        <Route path="bot-guide" element={<BotGuide />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
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