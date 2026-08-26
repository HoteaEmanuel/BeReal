import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SECTIONS = [
  {
    title: "Acceptance of Terms",
    body: "By creating an account and using this app, you agree to these Terms of Service. If you do not agree, please do not use the app.",
  },
  {
    title: "Your Account",
    body: "You are responsible for the information you post and for keeping your login credentials secure. You must be old enough to legally use this app in your country.",
  },
  {
    title: "Content You Post",
    body: "You keep ownership of the photos you post. By posting, you grant us permission to store and display that content to other users within the app.",
  },
  {
    title: "Acceptable Use",
    body: "Do not use the app to post illegal, abusive, or harassing content, or to impersonate another person. We may remove content or suspend accounts that violate these terms.",
  },
  {
    title: "Account Deletion",
    body: "You can delete your account at any time from Profile > Delete Account. This permanently removes your profile and posts.",
  },
  {
    title: "Changes to These Terms",
    body: "We may update these terms from time to time. Continued use of the app after a change means you accept the updated terms.",
  },
];

export default function TermsOfServiceScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.updated}>Last updated: August 26, 2026</Text>

        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  content: {
    padding: 24,
    paddingTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  updated: {
    fontSize: 14,
    color: "#999",
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 6,
  },
  sectionBody: {
    fontSize: 14,
    lineHeight: 20,
    color: "#444",
  },
});
