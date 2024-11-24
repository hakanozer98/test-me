import { View } from "react-native";
import { Text, Button, H1, useTheme } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import type { QuizResponse, Choice } from "../types/question";
import Animated, { 
  withSpring, 
  useAnimatedStyle, 
  useSharedValue 
} from 'react-native-reanimated';

export default function Quiz() {
  const { quiz } = useLocalSearchParams() as { quiz: string };
  const parsedQuiz: QuizResponse = JSON.parse(quiz);
  const router = useRouter();
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(parsedQuiz.questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const progress = useSharedValue(0);
  const theme = useTheme();

  const handleChoiceSelect = (questionIndex: number, choiceIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = choiceIndex;
    setSelectedAnswers(newAnswers);
  };

  const calculateScore = () => {
    let correct = 0;
    parsedQuiz.questions.forEach((question, idx) => {
      const selectedChoiceIndex = selectedAnswers[idx];
      if (selectedChoiceIndex !== -1 && question.choices[selectedChoiceIndex].isCorrect) {
        correct++;
      }
    });
    return correct;
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleNext = () => {
    if (currentQuestion < parsedQuiz.questions.length - 1) {
      setCurrentQuestion(curr => curr + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(curr => curr - 1);
    }
  };

  useEffect(() => {
    progress.value = withSpring((currentQuestion + 1) / parsedQuiz.questions.length, {
      mass: 1,         // Balanced mass
      damping: 12,     // Increased damping to reduce oscillations
      stiffness: 100,  // Slightly reduced stiffness
      velocity: 2,     // Reduced initial velocity
      restDisplacementThreshold: 0.005,
      restSpeedThreshold: 0.005,
      overshootClamping: false
    });
  }, [currentQuestion]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.color9.val, // Changed from .get() to .val
  }));

  if (showResults) {
    const score = calculateScore();
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, padding: 16, gap: 16 }}>
          <H1>Quiz Results</H1>
          <Text fontSize="$6">
            You got {score} out of {parsedQuiz.questions.length} questions correct!
          </Text>
          <Button onPress={() => router.push('/')}>Back to Home</Button>
        </View>
      </SafeAreaView>
    );
  }

  const question = parsedQuiz.questions[currentQuestion];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 16, gap: 16, flex: 1 }}>
        <View style={{ 
          height: 8, 
          backgroundColor: theme.color4.val,
          borderRadius: 4, 
          overflow: 'hidden',
          marginBottom: 16
        }}>
          <Animated.View style={progressStyle} />
        </View>
        
        <View style={{ gap: 8, flex: 1 }}>
          <Text fontSize="$5" fontWeight="bold" style={{ marginBottom: 20 }}>
            {currentQuestion + 1}. {question.text}
          </Text>
          <View style={{ gap: 12 }}>
            {question.choices.map((choice: Choice, cIndex) => (
              <Button
                key={cIndex}
                backgroundColor={selectedAnswers[currentQuestion] === cIndex ? "$color8" : '$color4'}
                onPress={() => handleChoiceSelect(currentQuestion, cIndex)}
              >
                <Text 
                  color={selectedAnswers[currentQuestion] === cIndex ? '$color2' : '$black'}
                  fontSize={16}
                >
                  {choice.text}
                </Text>
              </Button>
            ))}
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 16, justifyContent: 'space-between' }}>
          <Button 
            disabled={currentQuestion === 0}
            opacity={currentQuestion === 0 ? 0.5 : 1}
            onPress={handlePrevious}
            flex={1}
          >
            Previous
          </Button>
          {currentQuestion === parsedQuiz.questions.length - 1 ? (
            <Button
              disabled={selectedAnswers.includes(-1)}
              opacity={selectedAnswers.includes(-1) ? 0.5 : 1}
              onPress={handleSubmit}
              flex={1}
            >
              Submit
            </Button>
          ) : (
            <Button 
              onPress={handleNext}
              disabled={selectedAnswers[currentQuestion] === -1}
              opacity={selectedAnswers[currentQuestion] === -1 ? 0.5 : 1}
              flex={1}
            >
              Next
            </Button>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}