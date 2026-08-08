import React, { createContext, useState, useContext } from 'react';
import { authService } from '../services/authService';
import { setSession } from '../services/apiConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => authService.getStoredAuth());

  const requestOtp = (phone) => authService.requestOtp(phone);

  const verifyOtp = async (phone, otp) => {
    const result = await authService.verifyOtp(phone, otp);
    if (result && result.success) {
      setAuthState({
        token: result.token,
        user: result.user,
        isAuthenticated: true,
      });
    }
    return result;
  };

  const login = (userData, token) => {
    if (userData && token) {
      setSession({ token, user: userData });
    }
    setAuthState({
      token: token || null,
      user: userData || null,
      isAuthenticated: Boolean(token),
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
