import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TOGGLES = [
  {
    key: "privateAccount",
    label: "Private Account",
    description: "Only people you've accepted can see your posts.",
    defaultValue: false,
  },
  {
    key: "activityStatus",
    label: "Show Activity Status",
    description: "Let others see when you were last active in the app.",
    defaultValue: true,
  },
  {
    key: "discoverable",
    label: "Findable by Email",
    description: "Allow people who have your email to find your account.",
    defaultValue: true,
  },
] as const;

export default function PrivacyScreen() {
  const [values, setValues] = useState<Record<string, boolean>>(
    Object.fromEntries(TOGGLES.map((t) => [t.key, t.defaultValue])),
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Privacy</Text>
        <Text style={styles.subtitle}>
          Control who can see your profile and activity.
        </Text>

        {TOGGLES.map((toggle) => (
          <View key={toggle.key} style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>{toggle.label}</Text>
              <Text style={styles.rowDescription}>{toggle.description}</Text>
            </View>
            <Switch
              value={values[toggle.key]}
              onValueChange={(next) =>
                setValues((prev) => ({ ...prev, [toggle.key]: next }))
              }
            />
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
  subtitle: {
    fontSize: 14,
    color: "#999",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 12,
  },
  rowText: {
    flex: 1,
    paddingRight: 12,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  rowDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: "#999",
  },
});
