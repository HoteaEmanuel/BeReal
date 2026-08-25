import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const handleSignUp = async () => {
    setLoading(true);
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password.trim().length < 8) {
      Alert.alert("Error", "The password needs to have atleast 8 characters");
      return;
    }
    try {
      await signUp(email, password);
    } catch (error) {
      Alert.alert("Error", "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };
  const { user } = useAuth();
  useEffect(() => {
    router.push("/(auth)/onboarding");
  }, [user]);
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign Up To Get Started</Text>
        <View style={styles.form}>
          <TextInput
            placeholder="Email"
            placeholderTextColor={"#999"}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            value={email}
            onChangeText={(e) => setEmail(e)}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor={"#999"}
            autoCapitalize="none"
            secureTextEntry
            value={password}
            onChangeText={(e) => setPassword(e)}
            autoComplete="password"
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>
              {loading ? (
                <ActivityIndicator size={24} color={"#fff"} />
              ) : (
                "Sign up"
              )}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text style={styles.linkButtonText}>
              Already have an account?
              <Text style={styles.linkButtonTextBold}> Login</Text>
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
