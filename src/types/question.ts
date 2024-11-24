
import { z } from "zod";

export const Choice = z.object({
  text: z.string(),
  isCorrect: z.boolean(),
});

export const Question = z.object({
  text: z.string(),
  choices: z.array(Choice),
});

export const QuizResponse = z.object({
  questions: z.array(Question),
});

export type Choice = z.infer<typeof Choice>;
export type Question = z.infer<typeof Question>;
export type QuizResponse = z.infer<typeof QuizResponse>;