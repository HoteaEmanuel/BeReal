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
    title: "Information We Collect",
    body: "When you create an account we collect your email address, and the profile information you choose to add: name, username, and profile photo. When you post, we collect the photo you capture and the time it was taken.",
  },
  {
    title: "How We Use Your Information",
    body: "We use your information to operate your account, display your posts and profile to other users, and to power basic app functionality such as sign-in and notifications.",
  },
  {
    title: "Camera & Photo Library Access",
    body: "The app requests camera and photo library permissions only to let you take or select a photo for a post or your profile. Images are uploaded only when you choose to share them.",
  },
  {
    title: "Data Storage",
    body: "Your account data, posts, and images are stored with our backend provider, Supabase. Data in transit is encrypted.",
  },
  {
    title: "Your Rights",
    body: "You can edit your profile information at any time from the Edit Profile screen. You can permanently delete your account and associated data from Profile > Delete Account.",
  },
  {
    title: "Contact",
    body: "Questions about this policy can be directed to the app's support contact.",
  },
];

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Privacy Policy</Text>
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
