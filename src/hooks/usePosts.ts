import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { uploadPostImage } from "@/lib/supabase/storage";
import { Alert } from "react-native";

export function usePosts() {
  const { user } = useAuth();
  const createPost = async (imageUri: string, description: string) => {
    if (!user) throw new Error("Unauthenticated");
    try {
      const imageUrl = await uploadPostImage(user.id, imageUri);
      const now = new Date();
      const expires_at = new Date(now.getDate() + 24 * 1000 * 60 * 60);

      const { data, error } = await supabase
        .from("posts")
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          description: description ?? null,
          expires_at: expires_at.toISOString(),
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
    } catch (error) {
      Alert.alert("error", "Failed to create post");
      console.error("Failed to create post");
      throw error;
    }
  };
  return {
    createPost,
  };
}
