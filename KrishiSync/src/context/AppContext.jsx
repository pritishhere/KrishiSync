import React, { createContext, useContext } from 'react';
import { AuthProvider, useAuth } from './AuthContext';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <AppProviderContent>{children}</AppProviderContent>
    </AuthProvider>
  );
};

const AppProviderContent = ({ children }) => {
  const auth = useAuth();
  
  return (
    <AppContext.Provider value={{ ...auth }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};