import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { GrammarTopic } from '../types/grammar';
import '../types/speech-recognition.d.ts';
import { generateRandomSentence, validateResponse } from '../services/gemini';

type PracticeDrillProps = {
  topic: GrammarTopic;
  onBack: () => void;
};

export function PracticeDrill({ topic, onBack }: PracticeDrillProps) {
  const [currentSentence, setCurrentSentence] = useState('');
  const [userResponse, setUserResponse] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Your browser does not support speech recognition. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setUserResponse(transcript);
        
        if (event.results[event.results.length - 1].isFinal) {
          checkAnswer(transcript);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setError('Speech recognition error. Please try again.');
      };

      setRecognition(recognition);
    } catch {
      setError('Failed to initialize speech recognition. Please try again.');
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const checkAnswer = async (response: string) => {
    try {
      if (!currentSentence) {
        setError('No sentence to validate against. Please wait for a new sentence to be generated.');
        return;
      }

      setIsLoading(true);
      console.log('Validating response:', { currentSentence, response });
      const result = await validateResponse(currentSentence, response);
      setFeedback({ isCorrect: result.isCorrect, message: result.feedback });

      if (result.isCorrect) {
        setTimeout(() => {
          generateNewSentence();
          setUserResponse('');
          setFeedback(null);
        }, 1500);
      }
    } catch (err) {
      console.error('Validation error:', err);
      setError('Failed to validate response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewSentence = async () => {
    try {
      setIsLoading(true);
      const newSentence = await generateRandomSentence();
      console.log('New sentence generated:', newSentence);
      setCurrentSentence(newSentence);
      console.log('Current sentence state:', newSentence);
    } catch (err) {
      console.error('Generation error:', err);
      setError('Failed to generate new sentence. Please try again.');
    } finally {
      setIsLoading(false);
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
      if (isListening) {
        recognition.stop();
      } else {
        setFeedback(null);
        setUserResponse('');
        setError(null);
        await recognition.start();
      }
    } catch {
      setIsListening(false);
      setError('Failed to handle recording. Please try again.');
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
        <h2 className="text-2xl font-bold">{topic.title}</h2>
      </div>

      <motion.div
        key={currentSentence}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="card space-y-6"
      >
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Sentence to practice:</h3>
          <p className="text-2xl text-dark-text">
            {isLoading ? 'Loading...' : currentSentence}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleListen}
              disabled={!recognition}
              className={`btn-primary flex items-center gap-2 relative ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : ''} ${!recognition ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="flex items-center gap-2">
                {isListening && (
                  <span className="absolute left-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                )}
                {isListening ? 'Stop Recording' : 'Start Recording'}
              </span>
            </button>
            {isListening && (
              <p className="text-sm text-green-500 animate-pulse">
                Microphone active - speak now
              </p>
            )}
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-500/20 text-red-500">
              <p className="text-lg">{error}</p>
            </div>
          )}

          {userResponse && (
            <div
              className={`p-4 rounded-lg ${feedback?.isCorrect ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}
            >
              <p className="text-lg">{userResponse}</p>
              {feedback && (
                <p className="mt-2 text-sm">{feedback.message}</p>
              )}
            </div>
          )}
        </div>

        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </motion.div>
    </div>
  );
}