import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { DEMO_ADMIN } from "../mock/data";
import type { AdminUser } from "../types";

interface AuthState {
  user: AdminUser | null;
  /** Kept so pages can render their "checking session" state. Always false here. */
  loading: boolean;
  /** Accepts anything — there is no backend to check against. */
  signIn: () => void;
  signOut: () => void;
  /** Applies a profile edit locally, so the topbar and avatar update. */
  updateUser: (changes: Partial<AdminUser>) => void;
}

const AuthContext = createContext<AuthState | null>(null);

/**
 * Design-mode session.
 *
 * The dashboard starts signed in as the demo admin so every screen is one
 * click away — no credentials, no token, no network. Sign out to see the
 * login design; signing back in accepts any input.
 *
 * When a real backend arrives, this is the only file that changes: restore a
 * token check on boot, and point `signIn` at your login endpoint.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(DEMO_ADMIN);

  const signIn = useCallback(() => setUser(DEMO_ADMIN), []);
  const signOut = useCallback(() => setUser(null), []);

  const updateUser = useCallback((changes: Partial<AdminUser>) => {
    setUser((current) => (current ? { ...current, ...changes } : current));
  }, []);

  const value = useMemo(
    () => ({ user, loading: false, signIn, signOut, updateUser }),
    [user, signIn, signOut, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>.");
  return context;
}
