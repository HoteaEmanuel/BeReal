import { StyleSheet, Text, TextInput, View } from "react-native";
export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text>Edit src/app/index.tsx to edit this screen.</Text>
      <Text style={styles.headerTitle}>Hi all </Text>
      
      <TextInput placeholder="Email"/>
      {/* <ActivityIndicator size={"large"}/> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle:{
    color:'blue',
    fontWeight:"bold",
    fontStyle:"italic",
    fontSize:100,
  },
  image:{
    height:100,
    width:100
  }
});
