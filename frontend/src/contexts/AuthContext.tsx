import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface AuthContextType {
  user: UserData | null;
  login: (userData: UserData, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);

  // Function to refresh auth state from localStorage
  const refreshAuth = () => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // Initial auth check
    refreshAuth();

    // Listen for storage changes (logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'user') {
        refreshAuth();
      }
    };

    // Listen for custom logout events from other components
    const handleCustomLogout = () => {
      refreshAuth();
    };

    // Listen for custom login events from other components
    const handleCustomLogin = () => {
      refreshAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('customLogout', handleCustomLogout);
    window.addEventListener('customLogin', handleCustomLogin);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('customLogout', handleCustomLogout);
      window.removeEventListener('customLogin', handleCustomLogin);
    };
  }, []);

  const login = (userData: UserData, token: string) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    // Dispatch custom event to sync all components
    window.dispatchEvent(new Event('customLogin'));
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    // Dispatch custom event to sync all components
    window.dispatchEvent(new Event('customLogout'));
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated,
      refreshAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};