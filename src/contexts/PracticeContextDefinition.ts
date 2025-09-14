import { createContext } from 'react';

export type PracticeState = {
  currentSentence: string;
  userResponse: string;
  isListening: boolean;
  feedback: {
    isCorrect: boolean;
    message: string;
  } | null;
  error: string | null;
  isLoading: boolean;
  score: number;
  streak: number;
  sessionProgress: number;
};

export type PracticeAction =
  | { type: 'SET_SENTENCE'; payload: string }
  | { type: 'SET_RESPONSE'; payload: string }
  | { type: 'SET_LISTENING'; payload: boolean }
  | { type: 'SET_FEEDBACK'; payload: { isCorrect: boolean; message: string } | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'INCREMENT_SCORE' }
  | { type: 'INCREMENT_STREAK' }
  | { type: 'RESET_STREAK' }
  | { type: 'UPDATE_PROGRESS'; payload: number };

export type PracticeContextType = {
  state: PracticeState;
  dispatch: React.Dispatch<PracticeAction>;
};

export const initialState: PracticeState = {
  currentSentence: '',
  userResponse: '',
  isListening: false,
  feedback: null,
  error: null,
  isLoading: false,
  score: 0,
  streak: 0,
  sessionProgress: 0,
};

export const PracticeContext = createContext<PracticeContextType | undefined>(undefined);