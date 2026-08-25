import ColorPickerIos from "@/components/color-picker.ios";
import { BottomSheet, Host } from "@expo/ui";
import { useState } from "react";
import { Button, Platform, Text, View } from "react-native";

export default function Profile() {
  const [isPresented, setIsPresented] = useState(false);
  const [color, setColor] = useState<string | null>(null);
  const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFFFF"];
  return (
    <Host>
      <Button title="Open sheet" onPress={() => setIsPresented(true)} />
      { Platform.OS =='ios' && <ColorPickerIos/> }
      <BottomSheet
        isPresented={isPresented}
        onDismiss={() => setIsPresented(false)}
        // snapPoints={["50%", "90%"]}
      >
        <View style={{ height: 500 }}>
          <Text>Bottom-sheet content</Text>
        </View>

      </BottomSheet>
    </Host>
  );
}