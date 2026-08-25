import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
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
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password.trim().length < 8) {
      Alert.alert("Error", "The password needs to have atleast 8 characters");
      return;
    }
    try {
      setIsLoading(true);
      await signIn(email, password);
      router.push("/(tabs)");
    } catch (error) {
      Alert.alert("Error", "Failed to login up");
      console.error(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in To Continue</Text>
        <View style={styles.form}>
          <TextInput
            placeholder="Email"
            placeholderTextColor={"#999"}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            style={styles.input}
            value={email}
            onChangeText={(e) => setEmail(e)}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor={"#999"}
            autoCapitalize="none"
            secureTextEntry
            autoComplete="password"
            style={styles.input}
            value={password}
            onChangeText={(e) => setPassword(e)}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>
            {isLoading ? (
              <ActivityIndicator size={"small"} color={"#fff"} />
            ) : (
              "Sign in"
            )}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => router.push("/(auth)/signup")}
        >
          <Text style={styles.linkButtonText}>
            Don't have an accout?{" "}
            <Text style={styles.linkButtonTextBold}> Sign up</Text>
          </Text>
        </TouchableOpacity>
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
  form: {
    width: "100%",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
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
    marginBottom: 10,
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
function signIn(email: string, password: string) {
  throw new Error("Function not implemented.");
}
