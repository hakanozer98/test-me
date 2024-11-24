import { View, ScrollView, StyleSheet } from "react-native";
import { Text, Button, H1, XStack, YStack, Paragraph, useTheme } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { quizStore$ } from "../legend-state/quiz-store";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Question } from "../types/question";

export default function Attempt() {
    const { id } = useLocalSearchParams() as { id: string };
    const router = useRouter();
    const attempt = quizStore$.attempts.get().find(a => a.id === id);
    const theme = useTheme();

    const QuestionItem = ({ question, userAnswer }: { question: Question, userAnswer: number }) => {
        return (
            <View>
                <Paragraph>{question.text}</Paragraph>
                {question.choices.map((choice, idx) =>
                    <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        {idx === userAnswer ? (
                            <MaterialCommunityIcons 
                                name={choice.isCorrect ? "checkbox-marked" : "close"} 
                                size={24} 
                                color={choice.isCorrect ? "#22c55e" : "#ef4444"} 
                            />
                        ) : (
                            <MaterialCommunityIcons 
                                name="checkbox-blank-outline" 
                                size={24} 
                                color={choice.isCorrect ? "#22c55e" : "gray"} 
                            />
                        )}
                        <Paragraph style={{ color: choice.isCorrect ? "#22c55e" : theme.color.val }}>
                            {choice.text}
                        </Paragraph>
                    </View>
                )}
            </View>
        )
    };

    if (!attempt) {
        return (
            <SafeAreaView style={{ flex: 1, padding: 16 }}>
                <Text>Attempt not found</Text>
                <Button onPress={() => router.back()}>Go Back</Button>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{padding: 16, gap: 16}} style={{ flex: 1 }}>
                {attempt.questions.map((question, idx) =>
                    <QuestionItem key={idx} question={question} userAnswer={attempt.userAnswers[idx]} />
                )}
            </ScrollView>
        </SafeAreaView>
    );
}