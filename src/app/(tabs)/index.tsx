import { Button, Host } from "@expo/ui";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Hi all</Text>

      <TextInput placeholder="Email" />

      <Host matchContents>
        <Button
          label="Go to About"
          onPress={() => router.push("/about")}
        />
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "blue",
    fontWeight: "bold",
  },
});