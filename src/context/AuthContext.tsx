import { supabase } from "@/lib/supabase/client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert } from "react-native";
type User = {
  email: string;
  id: string;
  username?: string;
  name?: string;
  profileImage?: string;
  onboardingCompleted?: boolean;
};

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
  fetchUserProfile: (userId: string) => void;
  refreshAuthUserProfile: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);
  const checkSession = async () => {
    try {
      setIsLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setUser(profile!!);
      } else setUser(null);
    } catch (error) {
      console.error(error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) {
        console.error("Error fetching profile: ", error);
        return null;
      }
      if (!data) {
        console.error("No profile found");
        return null;
      }
      const authUser = await supabase.auth.getUser();
      if (!authUser.data.user) {
        console.error("No user found");
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        username: data.username,
        email: authUser.data.user.email || "",
        profileImage: data.profile_image_url,
        onboardingCompleted: data.onboarding_completed,
      };
    } catch (error) {
      console.error("Error in fetching the user profile: ", error);
    }
  };

  const refreshAuthUserProfile = async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();
      if (error) {
        console.error("Error fetching profile: ", error);
        return;
      }
      if (!data) {
        console.error("No profile found");
        return;
      }
      const authUser = await supabase.auth.getUser();
      if (!authUser.data.user) {
        console.error("No user found");
        return;
      }

      setUser({
        id: data.id,
        name: data.name,
        username: data.username,
        email: authUser.data.user.email || "",
        profileImage: data.profile_image_url,
        onboardingCompleted: data.onboarding_completed,
      });
    } catch (error) {}
  };
  async function signUp(email: string, password: string) {
    // Replace this with your real authentication request.
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (data.user !== null) {
      const profile = await fetchUserProfile(data.user.id);
      if (profile) setUser(profile);
    }
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (data.user !== null) {
      const profile = await fetchUserProfile(data.user.id);
      if (profile) setUser(profile);
    }
  }
  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  async function updateUser(userData: Partial<User>) {
    if (!user) return;
    try {
      const updateData: any = {};
      if (userData.name !== undefined) updateData.name = userData.name;
      if (userData.username !== undefined)
        updateData.username = userData.username;
      if (userData.profileImage !== undefined)
        updateData.profile_image_url = userData.profileImage;
      if (userData.onboardingCompleted !== undefined)
        updateData.onboarding_completed = userData.onboardingCompleted;

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);
      if (error) throw error;
    } catch (error) {
      console.log("Error: ", error);
      Alert.alert("Error");
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signUp,
        signIn,
        signOut,
        updateUser,
        fetchUserProfile,
        refreshAuthUserProfile,
      }}
    >
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
