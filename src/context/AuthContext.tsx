import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

import type { User } from "../types/auth";
import {
  getUser,
  removeToken,
  removeUser,
  saveToken,
  saveUser,
} from "../utils/storage";

interface AuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => getUser() as User | null);

  function login(token: string, userData: User) {
    saveToken(token);
    saveUser(userData);
    setUser(userData);
  }

  function logout() {
    removeToken();
    removeUser();
    setUser(null);
  }

  const value: AuthContextValue = {
    user,
    isLoggedIn: Boolean(user),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}