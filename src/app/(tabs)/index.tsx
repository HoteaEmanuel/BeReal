import { useAuth } from "@/context/AuthContext";
import { Post, usePosts } from "@/hooks/usePosts";
import { formatTimeAgo, formatTimeRemaining } from "@/lib/date-helper";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface PostCardProps {
  post: Post;
  currentUserId?: string;
}
const PostCard = ({ post, currentUserId }: PostCardProps) => {
  const postUser = post.profiles;
  const isOwnPost = post.user_id == currentUserId;
  return (
    <View>
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          {postUser?.profile_image_url ? (
            <Image source={{ uri: postUser.profile_image_url }} />
          ) : (
            <View>
              <Text style={styles.avatarText}>
                {postUser?.name?.[0].toUpperCase() || "U"}
              </Text>
            </View>
          )}
          <View>
            <Text>{isOwnPost ? "You" : `@${postUser?.username}`}</Text>
            <Text style={styles.timeAgo}>{formatTimeAgo(post.created_at)}</Text>
          </View>
        </View>

        {/*  Content */}
        <View style={styles.timeRemainingBadge}>
          <Text style={styles.timeRemainingText}>
            {formatTimeRemaining(post.expires_at)}
          </Text>
        </View>
      </View>

      <Image
        source={{ uri: post.image_url }}
        style={styles.postImage}
        contentFit="cover"
      />

      <View style={styles.postFooter}>
        {post.description && (
          <>
            <Text style={styles.postDescription}>{post.description}</Text>
            <Text>
              {isOwnPost ? "Your post" : `${postUser?.name} post`} - Expires in{" "}
              {formatTimeRemaining(post.expires_at)}
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const { createPost, posts, refreshPosts } = usePosts();

  const userActivePost = posts?.find(
    (post) =>
      post.user_id === user?.id &&
      post.is_active &&
      new Date(post.expires_at) > new Date(),
  );

  const hasActivePost = !!userActivePost;
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        " We need camera roll permissions to select a profile image",
        "Permision needed",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPreviewImage(result.assets[0].uri);
      setShowPreview(true);
      setDescription("");
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        " We need access to your camera to take a photo",
        "Permision needed",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPreviewImage(result.assets[0].uri);
      setShowPreview(true);
      setDescription("");
    }
  };
  const showImagePicker = () => {
    Alert.alert("Select Profile Image", "Choose an option", [
      { text: "Camera", onPress: () => takePhoto() },
      { text: "Photo Library", onPress: () => pickImage() },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleAddPost = async () => {
    try {
      if (!previewImage) {
        Alert.alert("Error", "An image is required");
        return;
      }
      setIsLoading(true);
      await createPost(previewImage, description);
      setPreviewImage("");
      setDescription("");
      setShowPreview(false);
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", "Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshPosts();
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderPost = ({ item }: { item: Post }) => {
    return <PostCard post={item} currentUserId={user?.id ?? undefined} />;
  };
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          posts.length === 0 ? styles.emptyContent : styles.content
        }
        ListEmptyComponent={<Text>No Posts Found</Text>}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <TouchableOpacity style={styles.fab} onPress={showImagePicker}>
        <Text style={styles.fabText}>{hasActivePost ? "↻" : "+"}</Text>
      </TouchableOpacity>

      <Modal visible={showPreview} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {hasActivePost ? "Replace your post" : "Preview your Post"}
            </Text>
            {previewImage && (
              <Image
                style={styles.previewImage}
                source={{ uri: previewImage }}
                contentFit="cover"
              />
            )}

            <TextInput
              value={description}
              onChangeText={(e) => setDescription(e)}
              autoCapitalize="sentences"
              placeholder="Add a descrtiption (optional)"
              placeholderTextColor={"#999"}
              multiline
              maxLength={2000}
              textAlignVertical="top"
              style={styles.descriptionInput}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                disabled={isLoading}
              >
                <Text
                  style={styles.cancelButtonText}
                  onPress={() => {
                    setShowPreview(false);
                    setPreviewImage("");
                    setDescription("");
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.postButton]}
                onPress={handleAddPost}
                disabled={isLoading}
              >
                <Text style={styles.postButtonText}>
                  {isLoading ? (
                    <ActivityIndicator size={"small"} />
                  ) : hasActivePost ? (
                    "Replace"
                  ) : (
                    "Post"
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "300",
    lineHeight: 32,
  },
  headerTitle: {
    color: "blue",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBlock: 20,
    textAlign: "center",
  },
  previewImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 16,
  },
  descriptionInput: {
    width: "100%",
    minHeight: 80,
    maxHeight: 120,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    color: "#000",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  cancelButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  postButton: {
    backgroundColor: "#000",
  },
  postButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  postContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  timeAgo: { fontSize: 12, color: "#666" },
  timeRemainingBadge: {
    backgroundColor: "#000",
    fontSize: 12,
    fontWeight: "600",
    padding: 6,
    borderRadius: 12,
  },
  timeRemainingText: {
    color: "#fff",
  },
  postImage: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
  },
  postFooter: {
    padding: 16,
  },
  postDescription: {
    fontSize: 16,
    color: "#666",
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});
