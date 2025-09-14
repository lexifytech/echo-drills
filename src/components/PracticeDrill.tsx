import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import '../types/speech-recognition.d.ts';
import { validateResponse } from '../services/validation';
import { generateRandomSentence } from '../services/sentences';
import { usePractice } from '../hooks/usePractice';
import TranscriptionVisualizer from './TranscriptionVisualizer';
import SessionProgress from './SessionProgress';
import RecordButton from './RecordButton';

type PracticeDrillProps = {
  topic: string;
  onBack: () => void;
};

export default function PracticeDrill({ topic, onBack }: PracticeDrillProps) {
  const { state, dispatch } = usePractice();
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      dispatch({ type: 'SET_ERROR', payload: 'Your browser does not support speech recognition. Please use Chrome, Edge or Safari.' });
      return;
    }

    try {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        dispatch({ type: 'SET_LISTENING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        
        if (event.results[event.results.length - 1].isFinal) {
          dispatch({ type: 'SET_RESPONSE', payload: transcript });
          checkAnswer();
        }
      };

      recognition.onend = () => {
        dispatch({ type: 'SET_LISTENING', payload: false });
      };

      recognition.onerror = () => {
        dispatch({ type: 'SET_LISTENING', payload: false });
        dispatch({ type: 'SET_ERROR', payload: 'Speech recognition error. Please try again.' });
      };

      setRecognition(recognition);
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize speech recognition. Please try again.' });
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [dispatch]);

  const checkAnswer = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await validateResponse();
      if (result.isCorrect) {
        dispatch({ type: 'INCREMENT_SCORE' });
        dispatch({ type: 'INCREMENT_STREAK' });
      } else {
        dispatch({ type: 'RESET_STREAK' });
      }
    } catch (err) {
      console.error('Validation error:', err);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to validate response. Please try again.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const generateNewSentence = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newSentence = await generateRandomSentence(topic);
      dispatch({ type: 'SET_SENTENCE', payload: newSentence });
      dispatch({ type: 'UPDATE_PROGRESS', payload: (state.score / 100) * 0.1 }); // 10 frases = 100%
    } catch (err) {
      console.error('Generation error:', err);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to generate new sentence. Please try again.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    const initializeSentence = async () => {
      await generateNewSentence();
    };
    initializeSentence();
  }, []);

  const handleListen = async () => {
    if (!recognition) return;

    try {
      if (state.isListening) {
        recognition.stop();
      } else {

        dispatch({ type: 'SET_RESPONSE', payload: '' });
        dispatch({ type: 'SET_ERROR', payload: null });
        await recognition.start();
      }
    } catch {
      dispatch({ type: 'SET_LISTENING', payload: false });
      dispatch({ type: 'SET_ERROR', payload: 'Failed to start recording. Please try again.' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="btn-secondary flex items-center gap-2"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold">{topic}</h2>
      </div>

      <SessionProgress
        score={state.score}
        streak={state.streak}
        progress={state.sessionProgress}
      />

      <motion.div
        key={state.currentSentence}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="card space-y-6"
      >
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Sentence to practice:</h3>
          <p className="text-2xl text-dark-text">
            {state.isLoading ? 'Loading...' : state.currentSentence}
          </p>
        </div>

        <TranscriptionVisualizer
          originalText={state.currentSentence}
          spokenText={state.userResponse}
          isListening={state.isListening}
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <RecordButton
              isListening={state.isListening}
              onToggle={handleListen}
              disabled={!recognition}
            />
          </div>

          {state.error && (
            <div className="p-4 rounded-lg bg-red-500/20 text-red-500">
              <p className="text-lg">{state.error}</p>
            </div>
          )}

          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handleListen}
              className="btn-primary"
            >
              Try Again
            </button>
            <button
              onClick={async () => {
                await generateNewSentence();
                dispatch({ type: 'SET_RESPONSE', payload: '' });
                dispatch({ type: 'SET_FEEDBACK', payload: null });
              }}
              className="btn-primary"
            >
              Next Sentence
            </button>
          </div>
        </div>

        {state.isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </motion.div>
    </div>
  );
}