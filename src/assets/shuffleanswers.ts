import type { Card } from "./types";

export function shuffleAnswers(cards: Card[], answer: string): string[] {
  const distractors = [...new Set(cards.map((card) => card.Front))]
    .filter((front) => front !== answer);

  for (let i = distractors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [distractors[i], distractors[j]] = [distractors[j], distractors[i]];
  }

  const answers = [answer, ...distractors.slice(0, 3)];

  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }
  return answers;
}