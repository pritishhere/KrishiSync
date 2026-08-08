import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => authService.getStoredAuth());

  const requestOtp = async (phone) => {
    return await authService.requestOtp(phone);
  };

  const verifyOtp = async (phone, otp) => {
    const result = await authService.verifyOtp(phone, otp);
    setAuthState({
      token: result.token,
      user: result.user,
      isAuthenticated: true,
    });
    return result;
  };

  const login = (userData, token) => {
    if (userData && token) {
      localStorage.setItem('krishi_sync_demo_auth_token', token);
      localStorage.setItem('krishi_sync_demo_user', JSON.stringify(userData));
    }
    localStorage.setItem('krishi_sync_demo_auth', 'true');
    setAuthState({
      token: token || 'demo_token',
      user: userData || { phone: 'Demo User' },
      isAuthenticated: true,
    });
  };

  const logout = () => {
    authService.logout();
    setAuthState({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
        token: authState.token,
        requestOtp,
        verifyOtp,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};