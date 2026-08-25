import { Host } from "@expo/ui/jetpack-compose";
import { useState } from "react";
import { Button, Pressable, Text, View } from "react-native";

export default function ColorPickerAndroid() {
  const [isPresented, setIsPresented] = useState(false);
  const [color, setColor] = useState<string | null>(null);
  const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFFFF"];
  return (
    <Host>
      <Button title="Open sheet" onPress={() => setIsPresented(true)} />
      <View style={{ flexDirection: "row", gap: 12 }}>
        {colors.map((item) => (
          <Pressable
            key={item}
            onPress={() => setColor(item)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: item,
              borderWidth: color === item ? 3 : 1,
            }}
          />
        ))}
      </View>
      <BottomSheet
        isPresented={isPresented}
        onDismiss={() => setIsPresented(false)}
        snapPoints={["50%", "90%"]}
      >
        <View style={{ height: 500 }}>
          <Text>Bottom-sheet content</Text>
        </View>

      </BottomSheet>
    </Host>
  );
}