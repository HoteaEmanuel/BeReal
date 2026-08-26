import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FAQS = [
  {
    question: "How do I change my profile photo, name, or username?",
    answer:
      "Go to Profile > Edit Profile. Tap your photo to replace it, update your name or username, then tap Save.",
  },
  {
    question: "How do I delete my account?",
    answer:
      "Go to Profile > Delete Account. This permanently removes your profile and posts and cannot be undone.",
  },
  {
    question: "Why can't I upload a photo?",
    answer:
      "Make sure the app has camera and photo library permissions enabled in your device settings, and that you have a working internet connection.",
  },
  {
    question: "How do I sign out?",
    answer: "Go to Profile and tap Sign out at the bottom of the screen.",
  },
];

export default function HelpSupportScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Help & Support</Text>
        <Text style={styles.subtitle}>
          Answers to common questions. Can't find what you need? Reach out
          below.
        </Text>

        {FAQS.map((faq) => (
          <View key={faq.question} style={styles.section}>
            <Text style={styles.sectionTitle}>{faq.question}</Text>
            <Text style={styles.sectionBody}>{faq.answer}</Text>
          </View>
        ))}

        <View style={styles.contactBox}>
          <Text style={styles.contactTitle}>Still need help?</Text>
          <Text style={styles.sectionBody}>
            Contact support at support@berealclone.app
          </Text>
        </View>
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
  subtitle: {
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
  contactBox: {
    marginTop: 8,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 6,
  },
});
