import React from 'react'
import { quizStore$, AttemptItemProps } from '../legend-state/quiz-store'
import { For, observer } from '@legendapp/state/react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Card, H2, H3, Paragraph, ScrollView, Text, YStack } from 'tamagui'

function AttemptItem({ item$ }: AttemptItemProps) {
    const attempt = item$.get()
    const date = new Date(attempt.date).toLocaleString()
    const totalQuestions = attempt.questions.length

    return (
        <Card bordered marginBottom="$3">
            <Card.Header padded>
                <Paragraph theme="alt2">{date}</Paragraph>
                <Paragraph>
                    Score: {attempt.score} / {totalQuestions}
                </Paragraph>
            </Card.Header>
        </Card>
    )
}

const History = observer(function History() {
    const attempts = quizStore$.attempts.get()

    return (
        <SafeAreaView style={{ flex: 1, padding: 16, gap: 16 }}>
                <H3>Attempts</H3>

                {attempts.length === 0 ? (
                    <Paragraph textAlign="center" theme="alt2">
                        No quiz attempts yet
                    </Paragraph>
                ) : (
                    <ScrollView flex={1}>
                        <For each={quizStore$.attempts} item={AttemptItem} />
                        <Button onPress={() => quizStore$.clearHistory()}>
                            Clear History
                        </Button>
                    </ScrollView>
                )}
        </SafeAreaView>
    )
})

export default History