import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';

// Page Imports
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import ScannerPage from './pages/Scanner';
import MandiPage from './pages/Mandi';
import AgriPoolPage from './pages/AgriPool';
import BotGuidePage from './pages/BotGuide';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/scanner" element={<ScannerPage />} />
            <Route path="/mandi" element={<MandiPage />} />
            <Route path="/agri-pool" element={<AgriPoolPage />} />
            <Route path="/bot-guide" element={<BotGuidePage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}
