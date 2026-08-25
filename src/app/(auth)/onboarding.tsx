import { useAuth } from "@/context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function SignUpScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const handleComplete = () => {};
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

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            Add your information to get started
          </Text>
          <Text>{profileImage}</Text>
        </View>
        <View style={styles.form}>
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            {profileImage ? (
              <View>
                <Image source={{ uri: profileImage }} />
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
            value={fullname}
            onChangeText={(e) => setFullname(e)}
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
