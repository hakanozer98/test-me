import { observable, Observable } from "@legendapp/state"
import { configureSynced, synced } from "@legendapp/state/sync"
import { observer, Reactive, useObservable } from "@legendapp/state/react"
import { ObservablePersistAsyncStorage } from "@legendapp/state/persist-plugins/async-storage"
import { Question, QuizResponse } from "../types/question"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Crypto from 'expo-crypto';

interface QuizAttempt {
    id: string
    date: string
    questions: Question[]
    userAnswers: number[]
    score: number
}

interface QuizStore {
    attempts: Observable<QuizAttempt[]>
    total: () => number
    addQuizAttempt: (quiz: QuizResponse, answers: number[]) => void
    clearHistory: () => void
}

export interface AttemptItemProps {
    item$: Observable<QuizAttempt>
}

// Configure persistence with AsyncStorage
const quizSynced = configureSynced(synced, {
    persist: {
        plugin: new ObservablePersistAsyncStorage({
            AsyncStorage
        })
    }
})

// Create global quiz store
export const quizStore$ = observable<QuizStore>({
    attempts: quizSynced({
        initial: [],
        persist: {
            name: 'quiz-history'
        }
    }),

    // Computed values
    total: (): number => {
        return quizStore$.attempts.length
    },

    // Actions
    addQuizAttempt: (quiz: QuizResponse, answers: number[]): void => {
        const score = answers.reduce((acc, ans, idx) => {
            return acc + (quiz.questions[idx].choices[ans]?.isCorrect ? 1 : 0)
        }, 0)

        const attempt: QuizAttempt = {
            id: Crypto.randomUUID(),
            date: new Date().toISOString(),
            questions: quiz.questions,
            userAnswers: answers,
            score
        }

        quizStore$.attempts.push(attempt)
    },

    clearHistory: (): void => {
        quizStore$.attempts.set([])
    }
})