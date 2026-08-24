import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { clearAdminPassword, isAdminAuthenticated, loginAdmin } from '../utils/adminApi';

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  login: (password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminAuthenticated);

  const value = useMemo(
    () => ({
      isAuthenticated,
      login: async (password: string) => {
        await loginAdmin(password);
        setIsAuthenticated(true);
      },
      logout: () => {
        clearAdminPassword();
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
