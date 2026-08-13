import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Role } from "./mock-data";

type Session = { role: Role; name: string; org?: string | undefined } | null;

type AuthValue = {
  session: Session;
  signIn: (role: Role, name?: string, org?: string) => void;
  signOut: () => void;
};

const KEY = "lt_supercom_session";
const AuthContext = createContext<AuthValue>({ session: null, signIn: () => {}, signOut: () => {} });

const defaults: Record<Role, { name: string; org?: string }> = {
  candidate: { name: "Aarav Mehta" },
  employer: { name: "Rhea Kapoor", org: "Northwind Systems" },
  college: { name: "Dr. Anil Menon", org: "Sristi Institute of Technology" },
  admin: { name: "Platform Admin" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setSession(JSON.parse(raw) as Session);
    } catch {
      /* mock session only */
    }
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      session,
      signIn: (role, name, org) => {
        const next = {
          role,
          name: name || defaults[role].name,
          org: org ?? defaults[role].org,
        };
        setSession(next);
        try {
          window.localStorage.setItem(KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
      },
      signOut: () => {
        setSession(null);
        try {
          window.localStorage.removeItem(KEY);
        } catch {
          /* ignore */
        }
      },
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
