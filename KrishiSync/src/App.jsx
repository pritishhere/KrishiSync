import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Layout
import MainContentLayout from './components/layout/MainContentLayout';

// Pages
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
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Authenticated Routes wrapped in Shell Layout */}
          <Route path="/*" element={
            <MainContentLayout>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/scanner" element={<ScannerPage />} />
                <Route path="/mandi" element={<MandiPage />} />
                <Route path="/agri-pool" element={<AgriPoolPage />} />
                <Route path="/bot-guide" element={<BotGuidePage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </MainContentLayout>
          } />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}


