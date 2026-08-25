import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { uploadProfileImage } from "@/lib/supabase/storage";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function SignUpScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const { user, updateUser } = useAuth();
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
      setProfileImage(result.assets[0].uri);
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
      setProfileImage(result.assets[0].uri);
    }
  };
  const showImagePicker = () => {
    Alert.alert("Select Profile Image", "Choose an option", [
      { text: "Camera", onPress: () => takePhoto() },
      { text: "Photo Library", onPress: () => pickImage() },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleComplete = async () => {
    if (!user) throw new Error("User not authenticated");
    if (!fullname || !username) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (fullname.trim().length < 3 || username.trim().length < 3) {
      Alert.alert(
        "Error",
        "Full name and username must have atleast 3 characters",
      );
      return;
    }

    try {
      setIsLoading(true);
      // Check to see if another user with the same username exists
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .neq("id", user.id)
        .single();

      if (existingUser) {
        Alert.alert("Error", "An user with same username already exists");
        return;
      }

      // Upload profile image

      if (profileImage) {
        try {
          await uploadProfileImage(user.id, profileImage);
        } catch (error) {
          console.log("Error: ", error);
          Alert.alert("Error", "Failed to upload profile image");
        }
      }

      // Update profile
      await updateUser({
        name: fullname,
        username,
        profileImage,
        onboardingCompleted: true,
      });
      return router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", "Failed to complete onboarding");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            Add your information to get started
          </Text>
        </View>
        <View style={styles.form}>
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={showImagePicker}
          >
            {profileImage ? (
              <View>
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                />
              </View>
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>+</Text>
              </View>
            )}
            <View style={styles.editBadge}>
              <Text style={styles.editText}>Edit</Text>
            </View>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={fullname}
            onChangeText={(e) => setFullname(e)}
            placeholder="Full Name"
            autoCapitalize="words"
            placeholderTextColor={"#999"}
          />

          <TextInput
            style={styles.input}
            value={username}
            onChangeText={(e) => setUsername(e)}
            placeholder="Username"
            autoCapitalize="none"
            placeholderTextColor={"#999"}
          />

          <TouchableOpacity style={styles.button} onPress={handleComplete}>
            <Text style={styles.buttonText}>
              {isLoading ? (
                <ActivityIndicator size={24} color={"#fff"} />
              ) : (
                "Complete Setup"
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  form: {
    width: "100%",
    alignItems: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f5f5f5",
  },
  placeholderImage: {
    width: 120,
    height: 120,
    position: "relative",
    backgroundColor: "#f5f5f5",
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  placeholderText: {
    fontSize: 48,
    color: "#999",
  },
  imageContainer: {
    marginBottom: 32,
    position: "relative",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editText: {
    color: "#fff",
    fontWeight: "800",
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 32,
    color: "#666",
  },

  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    width: "100%",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#000",
    borderRadius: 12,
    textAlign: "center",
    padding: 10,
    alignItems: "center",
    width: "100%",
  },

  linkButton: {
    alignItems: "center",
  },
  linkButtonText: {
    color: "#666",
    fontSize: 14,
  },
  linkButtonTextBold: {
    color: "#000",
    fontWeight: "600",
    alignItems: "center",
  },
});
