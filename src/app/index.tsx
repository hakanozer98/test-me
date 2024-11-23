import { View } from "react-native";
import { Button, ButtonIcon, Text, useTheme } from "tamagui";
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // Import Ionicons
import useThemeStore from "../stores/themeStore";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { themeType, setTheme } = useThemeStore();
  const theme = useTheme();

  const toggleTheme = () => {
    setTheme(themeType === "dark" ? "light" : "dark");
  }

  return (
    <SafeAreaView style={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <MaterialCommunityIcons
          name={themeType === "dark" ? "white-balance-sunny" : "moon-waning-crescent"}
          size={32}
          color={theme.color.get()}
          onPress={toggleTheme}
        />
      </View>
    </SafeAreaView>
  );
}
