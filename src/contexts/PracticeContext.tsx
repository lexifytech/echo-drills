import { useReducer } from 'react';
import type { ReactNode } from 'react';
import {
  PracticeContext,
  initialState,
  type PracticeState,
  type PracticeAction,
} from './PracticeContextDefinition';

function practiceReducer(state: PracticeState, action: PracticeAction): PracticeState {
  switch (action.type) {
    case 'SET_SENTENCE':
      return { ...state, currentSentence: action.payload };
    case 'SET_RESPONSE':
      return { ...state, userResponse: action.payload };
    case 'SET_LISTENING':
      return { ...state, isListening: action.payload };
    case 'SET_FEEDBACK':
      return { ...state, feedback: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'INCREMENT_SCORE':
      return { ...state, score: state.score + 10 };
    case 'INCREMENT_STREAK':
      return { ...state, streak: state.streak + 1 };
    case 'RESET_STREAK':
      return { ...state, streak: 0 };
    case 'UPDATE_PROGRESS':
      return { ...state, sessionProgress: action.payload };
    default:
      return state;
  }
}

function PracticeProviderComponent({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(practiceReducer, initialState);

  return (
    <PracticeContext.Provider value={{ state, dispatch }}>
      {children}
    </PracticeContext.Provider>
  );
}

export const PracticeProvider = PracticeProviderComponent;