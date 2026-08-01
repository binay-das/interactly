export interface OptionDistribution {
  optionId: string;
  text: string;
  isCorrect: boolean;
  count: number;
}

export interface QuestionAnalytics {
  questionId: string;
  questionText: string;
  totalAnswers: number;
  correctAnswers: number;
  accuracyPercentage: number;
  averageResponseTimeMs: number;
  optionDistribution: OptionDistribution[];
}

export interface FinalRankingEntry {
  rank: number;
  participantId: string;
  nickname: string;
  score: number;
  streak: number;
  maxStreak: number;
}

export interface SessionAnalytics {
  sessionId: string;
  quizTitle: string;
  sessionState: string;
  totalParticipants: number;
  totalAnswersSubmitted: number;
  overallAverageResponseTimeMs: number;
  questionStats: QuestionAnalytics[];
  finalRankings: FinalRankingEntry[];
}
