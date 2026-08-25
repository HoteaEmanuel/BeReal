import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function LoginScreen() {
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
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor={"#999"}
            autoCapitalize="none"
            secureTextEntry
            autoComplete="password"
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign in</Text>
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
