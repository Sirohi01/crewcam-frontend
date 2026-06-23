import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  _id?: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
  tenantId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  tenantId: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, tenantId?: string) => void;
  logout: () => void;
  setTenantId: (tenantId: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      tenantId: null,
      isAuthenticated: false,
      setAuth: (user, tenantId) => {
        if (typeof window !== 'undefined') {
          if (tenantId) localStorage.setItem('tenant_id', tenantId);
          document.cookie = "has_session=true; path=/; max-age=86400; samesite=lax";
        }
        set({ user, tenantId: tenantId || null, isAuthenticated: true });
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('tenant_id');
          document.cookie = "has_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        set({ user: null, token: null, tenantId: null, isAuthenticated: false });
      },
      setTenantId: (tenantId) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('tenant_id', tenantId);
        }
        set({ tenantId });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        tenantId: state.tenantId,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
