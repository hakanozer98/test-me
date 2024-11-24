import { View, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useTheme, Text, Button, H1 } from "tamagui";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useThemeStore from "../stores/themeStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

export default function Index() {
  const { themeType, setTheme } = useThemeStore();
  const theme = useTheme();
  const [message, setMessage] = useState("");

  const toggleTheme = () => {
    setTheme(themeType === "dark" ? "light" : "dark");
  }

  const handleSend = () => {
    console.log("Sending message:", message);
    setMessage("");
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 16 }}>
            <MaterialCommunityIcons
              name={themeType === "dark" ? "white-balance-sunny" : "moon-waning-crescent"}
              size={32}
              color={theme.color9.get()}
              onPress={toggleTheme}
            />
          </View>
          <View style={{ flex: 1, padding: 16, gap: 24}}>
              <H1 style={{color: theme.color9.get(), fontWeight: 'bold', textAlign: 'center', marginBottom: 24}}>AI Test Generator</H1>
              <Text style={{color: theme.color9.get(), textAlign: 'center', marginBottom: 40}}>
                Enter any topic or subject, and I'll generate a multiple-choice test to help you assess your knowledge.
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: theme.color6.get(),
                  backgroundColor: theme.color2.get(),
                  borderRadius: 8,
                  padding: 12,
                  color: theme.color.get(),
                  minHeight: 150,
                  maxHeight: 200,
                  textAlignVertical: 'top'
                }}
                multiline
                value={message}
                onChangeText={setMessage}
                placeholder="Example: 'Create a test about JavaScript fundamentals' or 'Generate questions about World War II'"
                placeholderTextColor={theme.color6.get()}
              />
              <Button size="$5" onPress={handleSend}>Generate Test</Button>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
