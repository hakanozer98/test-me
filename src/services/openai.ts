
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { QuizResponse } from "../types/question";

const openai = new OpenAI({apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY});

export async function generateQuiz(topic: string, numberOfQuestions: number = 5) {
  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Generate ${numberOfQuestions} multiple choice questions about the given topic. Each question should have 4 choices with exactly one correct answer.`
        },
        { role: "user", content: topic },
      ],
      response_format: zodResponseFormat(QuizResponse, "quiz"),
    });

    const quiz = completion.choices[0].message.parsed;
    console.log('Generated quiz:', quiz);
    return quiz;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
}