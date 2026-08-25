import { supabse } from "@/lib/supabase/client";
import { createContext, ReactNode, useContext, useState } from "react";
type User = {
  email: string;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading] = useState(false);

  async function signUp(email: string, password: string) {
    // Replace this with your real authentication request.
    const { data, error } = await supabse.auth.signUp({ email, password });
    if (error) throw error;
    if (data.user) setUser(user);
  }

  function signOut() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
