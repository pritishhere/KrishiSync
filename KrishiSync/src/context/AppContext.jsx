import React, { useState, createContext, useContext } from 'react';

export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (phone) => {
    // Simulated login for Member 1 frontend work
    setUser({ phone, name: 'Kisan Kumar', lang: 'en' });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ user, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};
