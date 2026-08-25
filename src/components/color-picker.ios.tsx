import { ColorPicker, Host } from '@expo/ui/swift-ui';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

const ColorPickerIos = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [color, setColor] = useState<string | null>(null);
  return (
    <View style={styles.container}>
      <Host>
        <ColorPicker selection={color} />
      </Host>
    </View>
  )
}

const styles=StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  }
})

export default ColorPickerIos;