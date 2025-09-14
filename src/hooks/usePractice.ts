import { useContext } from 'react';
import { PracticeContext } from '../contexts/PracticeContextDefinition';

export function usePractice() {
  const context = useContext(PracticeContext);
  if (context === undefined) {
    throw new Error('usePractice must be used within a PracticeProvider');
  }
  return context;
}