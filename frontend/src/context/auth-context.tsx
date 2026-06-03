"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { decodeJwt } from '../lib/jwt';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  role: 'user' | 'admin';
  created_at?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isReady: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AUTH_TOKEN_KEY = 'aperture_auth_token';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const storedToken = window.localStorage.getItem(AUTH_TOKEN_KEY);
      if (storedToken) {
        const decoded = decodeJwt(storedToken);
        if (decoded) {
          setToken(storedToken);
          setUser(decoded);
        } else {
          window.localStorage.removeItem(AUTH_TOKEN_KEY);
        }
      }
    } finally {
      setIsReady(true);
    }
  }, []);

  const login = useCallback((nextToken: string) => {
    const decoded = decodeJwt(nextToken);
    if (!decoded) {
      return;
    }

    window.localStorage.setItem(AUTH_TOKEN_KEY, nextToken);
    setToken(nextToken);
    setUser(decoded);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    isReady,
    login,
    logout,
  }), [user, token, isReady]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
