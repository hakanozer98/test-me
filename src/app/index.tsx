import { View, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { useTheme, Text, Button, H2, Spinner, Slider, XStack } from "tamagui";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useThemeStore from "../stores/themeStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { generateQuiz } from "../services/openai";
import { router } from "expo-router";
import * as Haptics from 'expo-haptics';
import { quizStore$ } from "../legend-state/quiz-store";
import { observer } from "@legendapp/state/react";

export const Index = observer(() => {
  const { themeType, setTheme } = useThemeStore();
  const theme = useTheme();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(10);

  const toggleTheme = async () => {
    setTheme(themeType === "dark" ? "light" : "dark");
  }

  const handleSend = async () => {
    console.log('Sending message:', message);
    if (!message.trim() || isLoading) return;
    
    try {
      setIsLoading(true);
      console.log('Generating quiz...');
      const quiz = await generateQuiz(message, questionCount);
      
      if (!quiz) {
        throw new Error('No quiz data received');
      }
      
      console.log('Quiz generated:', JSON.stringify(quiz, null, 2));
      setMessage("");
      router.navigate({
        pathname: "/quiz",
        params: { quiz: JSON.stringify(quiz) }
      });
    } catch (error) {
      console.error('Error:', error);
      Alert.alert(
        'Error',
        'Failed to generate quiz. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  const handleQuestionCountChange = ([value]: number[]) => {
    setQuestionCount(value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

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
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            padding: 16,
            alignItems: 'center'
          }}>
            <MaterialCommunityIcons
              name="history"
              size={32}
              color={theme.color10.get()}
              onPress={() => router.navigate('/history')}
            />
            <MaterialCommunityIcons
              name={themeType === "dark" ? "white-balance-sunny" : "moon-waning-crescent"}
              size={32}
              color={theme.color10.get()}
              onPress={toggleTheme}
            />
          </View>
          <View style={{ flex: 1, padding: 16, gap: 24}}>
              <H2 style={{color: theme.color9.get(), fontWeight: 'bold', textAlign: 'center', marginVertical: 12}}>AI Test Generator</H2>
              <Text style={{color: theme.color9.get(), textAlign: 'center', marginBottom: 40}}>
                Enter any topic or subject, and I'll generate a multiple-choice test to help you assess your knowledge.
              </Text>
              <TextInput
                style={{
                  borderWidth: 1.5,
                  borderColor: theme.color8.get(),
                  backgroundColor: theme.color1.get(),
                  borderRadius: 8,
                  padding: 12,
                  color: theme.color12.get(),
                  minHeight: 150,
                  maxHeight: 200,
                  textAlignVertical: 'top'
                }}
                multiline
                value={message}
                onChangeText={setMessage}
                placeholder="Example: 'Create a test about JavaScript fundamentals' or 'Generate questions about World War II'"
                placeholderTextColor={theme.color8.get()}
              />
              <View style={{ gap: 8 }}>
                <Text style={{color: theme.color9.get(), marginBottom: 8}}>
                  Number of questions: {questionCount}
                </Text>
                <Slider
                  size="$4"
                  defaultValue={[10]}
                  min={5}
                  max={20}
                  step={1}
                  onValueChange={handleQuestionCountChange}
                >
                  <Slider.Track>
                    <Slider.TrackActive />
                  </Slider.Track>
                  <Slider.Thumb size="$1" circular index={0} />
                </Slider>
              </View>
              <Button 
                size="$5" 
                onPress={handleSend} 
                disabled={!message.trim() || isLoading}
                opacity={!message.trim() || isLoading ? 0.5 : 1}
              >
                {isLoading ? (
                  <Spinner color={theme.color12.get()} />
                ) : (
                  <Text color={theme.color12.get()} style={{fontSize: 18}}>Generate Test</Text>
                )}
              </Button>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});

export default Index;
