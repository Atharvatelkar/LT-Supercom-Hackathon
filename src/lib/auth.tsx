import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Role } from "./mock-data";
import { getSessionFn, loginFn, logoutFn } from "@/api/auth";

export type Session = {
  role: Role;
  name: string;
  email?: string;
  org?: string | undefined;
  organizationId?: string | undefined;
  candidateId?: string | undefined;
} | null;

type AuthValue = {
  session: Session;
  isLoading: boolean;
  signIn: (role: Role, name?: string, org?: string) => Promise<void>;
  loginWithCredentials: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const KEY = "lt_supercom_session";
const AuthContext = createContext<AuthValue>({
  session: null,
  isLoading: false,
  signIn: async () => {},
  loginWithCredentials: async () => ({ success: false }),
  signOut: async () => {},
  refreshSession: async () => {},
});

const defaults: Record<Role, { email: string; name: string; org?: string }> = {
  candidate: { email: "aarav@mail.com", name: "Aarav Mehta" },
  employer: { email: "rhea@northwind.io", name: "Rhea Kapoor", org: "Northwind Systems" },
  college: { email: "placements@sristi.edu", name: "Dr. Anil Menon", org: "Sristi Institute of Technology" },
  admin: { email: "admin@ltsupercom.com", name: "Platform Admin" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = async () => {
    try {
      const res = await getSessionFn();
      if (res && res.success && res.session) {
        const next: Session = {
          role: res.session.user.role as Role,
          name: res.session.user.name,
          email: res.session.user.email,
          org: res.session.organization?.name,
          organizationId: res.session.organization?.id,
          candidateId: res.session.candidateId || undefined,
        };
        setSession(next);
        try {
          window.localStorage.setItem(KEY, JSON.stringify(next));
        } catch {}
        return;
      }
    } catch {
      // Server function fallback to local session if network error
    }

    // Fallback to local storage in offline dev
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setSession(JSON.parse(raw) as Session);
    } catch {}
    setIsLoading(false);
  };

  useEffect(() => {
    refreshSession().finally(() => setIsLoading(false));
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      session,
      isLoading,
      signIn: async (role, name, org) => {
        const fallbackEmail = defaults[role].email;
        try {
          const res = await loginFn({
            data: {
              email: fallbackEmail,
              password: "password123",
            },
          });
          if (res && res.success && res.user) {
            const next: Session = {
              role: res.user.role as Role,
              name: res.user.name,
              email: res.user.email,
              org: res.organization?.name || org,
              organizationId: res.organization?.id,
              candidateId: res.candidateId || undefined,
            };
            setSession(next);
            try {
              window.localStorage.setItem(KEY, JSON.stringify(next));
            } catch {}
            return;
          }
        } catch {
          // fallback
        }

        const next: Session = {
          role,
          name: name || defaults[role].name,
          email: fallbackEmail,
          org: org ?? defaults[role].org,
        };
        setSession(next);
        try {
          window.localStorage.setItem(KEY, JSON.stringify(next));
        } catch {}
      },
      loginWithCredentials: async (email, password) => {
        try {
          const res = await loginFn({ data: { email, password } });
          if (res && res.success && res.user) {
            const next: Session = {
              role: res.user.role as Role,
              name: res.user.name,
              email: res.user.email,
              org: res.organization?.name,
              organizationId: res.organization?.id,
              candidateId: res.candidateId || undefined,
            };
            setSession(next);
            try {
              window.localStorage.setItem(KEY, JSON.stringify(next));
            } catch {}
            return { success: true };
          }
          return { success: false, error: (res as any)?.error?.message || "Invalid credentials." };
        } catch (e: any) {
          return { success: false, error: e.message || "Login failed." };
        }
      },
      signOut: async () => {
        try {
          await logoutFn();
        } catch {}
        setSession(null);
        try {
          window.localStorage.removeItem(KEY);
        } catch {}
      },
      refreshSession,
    }),
    [session, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
