import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { uploadPostImage } from "@/lib/supabase/storage";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export interface PostUser {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
}

export interface Post {
  id: string;
  description?: string;
  user_id: string;
  image_url: string;
  created_at: string;
  expires_at: string;
  is_active: string;
  profiles?: PostUser;
}

export function usePosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    loadPosts();
  }, [user]);

  const loadPosts = async () => {
    if (!user) return;
    try {
      setIsLoading(true);

      const { data: postsData, error } = await supabase
        .from("posts")
        .select(
          `*,
          profiles(id, name, username, profile_image_url)`,
        )
        .eq("is_active", true)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false });
      if (error) throw error;
      console.log("POSTS:", postsData);
      if (!postsData || postsData.length === 0) {
        setPosts([]);
        return;
      }

      const postsWithProfiles = postsData.map((post) => ({
        ...post,
        profiles: post.profiles || null,
      }));
      setPosts(postsWithProfiles);
    } catch (error) {
      console.error("Failed to fetch the posts: ", error);
    } finally {
      setIsLoading(false);
    }
  };
  const createPost = async (imageUri: string, description: string) => {
    if (!user) throw new Error("Unauthenticated");
    try {
      const imageUrl = await uploadPostImage(user.id, imageUri);
      const now = new Date();
      const expires_at = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const { error: deactivateError } = await supabase
        .from("posts")
        .update({ is_active: false })
        .eq("user_id", user.id)
        .eq("is_active", true);
      if (deactivateError) throw deactivateError;

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

      await loadPosts();
    } catch (error) {
      Alert.alert("error", "Failed to create post");
      console.error("Failed to create post");
      throw error;
    }
  };

  const refreshPosts = async () => {
    await loadPosts();
  };

  return {
    createPost,
    posts,
    refreshPosts,
  };
}
