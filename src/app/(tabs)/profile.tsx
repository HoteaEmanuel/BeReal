import { useAuth } from "@/context/AuthContext";

import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { supabase } from "@/lib/supabase/client";
import { uploadProfileImage } from "@/lib/supabase/storage";
import { router } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { user, refreshAuthUserProfile, updateUser, signOut } = useAuth();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "default",
        onPress: async () => {
          await signOut();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const uploadUserProfileImage = async (profileImage: string) => {
    if (!user) return;
    try {
      const url = await uploadProfileImage(user.id, profileImage);
      await updateUser({ profileImage: url });
      await refreshAuthUserProfile();
      console.log("USER UPDATED: ", user);
    } catch (error) {
      console.log("Error: ", error);
      Alert.alert("Error", "Failed to upload profile image");
      throw error;
    }
  };

  const pickImage = async () => {
    if (!user) return;
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
      try {
        await uploadUserProfileImage(result.assets[0].uri);
      } catch (error) {
        console.log("Error: ", error);
        Alert.alert("Error", "Failed to upload profile image");
      }
    }
  };

  const takePhoto = async () => {
    if (!user) return;
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
      try {
        await uploadUserProfileImage(result.assets[0].uri);
      } catch (error) {
        console.log("Error: ", error);
        Alert.alert("Error", "Failed to upload profile image");
      }
    }
  };
  const showImagePicker = () => {
    Alert.alert("Select Profile Image", "Choose an option", [
      { text: "Camera", onPress: () => takePhoto() },
      { text: "Photo Library", onPress: () => pickImage() },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  async function handleDeleteAccount() {
    if (!user) return;
    try {
      setIsLoading(true);

      const { error } = await supabase.functions.invoke("delete-account");
      if (error) throw error;

      await signOut();
      router.replace("/(auth)/login");
    } catch (error) {
      console.log("Error: ", error);
      Alert.alert("Error", "Failed to delete account");
    } finally {
      setIsLoading(false);
      setDeleteModalOpen(false);
    }
  }

  // const handleComplete = async () => {
  //   if (!user) throw new Error("User not authenticated");
  //   if (!fullname || !username) {
  //     Alert.alert("Error", "Please fill in all fields");
  //     return;
  //   }
  //   if (fullname.trim().length < 3 || username.trim().length < 3) {
  //     Alert.alert(
  //       "Error",
  //       "Full name and username must have atleast 3 characters",
  //     );
  //     return;
  //   }

  //   try {
  //     setIsLoading(true);
  //     // Check to see if another user with the same username exists
  //     const { data: existingUser } = await supabase
  //       .from("profiles")
  //       .select("id")
  //       .eq("username", username)
  //       .neq("id", user.id)
  //       .single();

  //     if (existingUser) {
  //       Alert.alert("Error", "An user with same username already exists");
  //       return;
  //     }

  //     // Upload profile image

  //     if (profileImage) {
  //       try {
  //         await uploadProfileImage(user.id, profileImage);
  //       } catch (error) {
  //         console.log("Error: ", error);
  //         Alert.alert("Error", "Failed to upload profile image");
  //       }
  //     }

  //     // Update profile
  //     await updateUser({
  //       name: fullname,
  //       username,
  //       profileImage,
  //       onboardingCompleted: true,
  //     });
  //     return router.replace("/(tabs)");
  //   } catch (error) {
  //     Alert.alert("Error", "Failed to complete onboarding");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={showImagePicker}>
            <View style={styles.avatarWrap}>
              {user?.profileImage ? (
                <Image
                  source={{ uri: user.profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <View
                  style={[styles.profileImage, styles.profileImagePlaceholder]}
                >
                  <Text style={styles.profileImageText}>
                    {user?.name?.[0].toUpperCase() || "U"}
                  </Text>
                </View>
              )}

              <View style={styles.editBadge}>
                <Text style={styles.editBadgeText}>Edit</Text>
              </View>
            </View>
          </TouchableOpacity>

          <Text style={styles.name}>{user?.name || "No name"} </Text>
          <Text style={styles.username}>
            @{user?.username || "No username"}{" "}
          </Text>
          <Text style={styles.email}>{user?.email || "No email"} </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push("/edit-profile")}
          >
            <Text style={styles.settingLabel}>Edit Profile</Text>
            <Text style={styles.settingValue}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push("/notifications")}
          >
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.settingValue}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push("/privacy")}
          >
            <Text style={styles.settingLabel}>Privacy</Text>
            <Text style={styles.settingValue}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push("/help-support")}
          >
            <Text style={styles.settingLabel}>Help & Support</Text>
            <Text style={styles.settingValue}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push("/terms-of-service")}
          >
            <Text style={styles.settingLabel}>Terms of Service</Text>
            <Text style={styles.settingValue}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push("/privacy-policy")}
          >
            <Text style={styles.settingLabel}>Privacy Policy</Text>
            <Text style={styles.settingValue}>→</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.settingItem, styles.signOutButton]}
            onPress={handleSignOut}
          >
            <Text>Sign out</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, styles.deleteButton]}
            onPress={() => setDeleteModalOpen(true)}
          >
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={deleteModalOpen} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Are you sure that you want to delete this account?
              </Text>
              <Text style={styles.alertText}>This action is irreversible!</Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  disabled={isLoading}
                >
                  <Text
                    style={styles.cancelButtonText}
                    onPress={() => {
                      setDeleteModalOpen(false);
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.deleteButton]}
                  onPress={handleDeleteAccount}
                  disabled={isLoading}
                >
                  <Text style={styles.deleteButtonText}>
                    {isLoading ? (
                      <ActivityIndicator size={"small"} />
                    ) : (
                      "Delete"
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {},
  profileSection: {
    alignItems: "center",
    marginBottom: 32,
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileImageText: {
    fontSize: 40,
    fontWeight: "600",
    color: "#666",
  },
  profileImagePlaceholder: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarWrap: {},
  editBadge: {
    position: "absolute",
    bottom: 10,
    left: "50%",
    transform: [{ translateX: -22 }],
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  editBadgeText: {
    fontSize: 12,
    color: "#fff",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#000",
  },
  username: {
    fontSize: 16,
    fontWeight: "semibold",
    color: "#666",
  },
  email: {
    fontSize: 14,
    color: "#999",
  },
  section: {
    marginBottom: 32,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#000",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 18,
    color: "#999",
  },
  settingValue: {
    fontSize: 18,
    color: "#999",
  },
  signOutButton: {
    backgroundColor: "#f5f5f5",
    marginBottom: 8,
  },
  signOutText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  deleteButton: {
    backgroundColor: "#9f0901",
    borderWidth: 1,
  },
  deleteText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  alertText: {
    fontSize: 20,
    fontWeight: "semibold",
    color: "red",
    textAlign: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    gap: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBlock: 20,
    textAlign: "center",
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

  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});
