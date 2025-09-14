import { motion, AnimatePresence } from 'framer-motion';

type TranscriptionVisualizerProps = {
  originalText: string;
  spokenText: string;
  isListening: boolean;
};

export default function TranscriptionVisualizer({
  originalText,
  spokenText,
  isListening,
}: TranscriptionVisualizerProps) {
  const originalWords = originalText.toLowerCase().split(' ');
  const spokenWords = spokenText.toLowerCase().split(' ');

  const compareWords = (original: string, spoken: string) => {
    // Remove punctuation and convert to lowercase for comparison
    const cleanOriginal = original.replace(/[.,!?]/g, '').toLowerCase();
    const cleanSpoken = spoken.replace(/[.,!?]/g, '').toLowerCase();
    return cleanOriginal === cleanSpoken;
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {(isListening || spokenText) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-lg bg-slate-700 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-2 text-slate-300">
              {isListening ? 'Speaking...' : 'Your Speech:'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {spokenWords.map((word, index) => {
                const originalWord = originalWords[index];
                const isCorrect = originalWord && compareWords(originalWord, word);

                return (
                  <motion.span
                    key={`spoken-${index}`}
                    className={`text-xl font-medium ${isCorrect ? 'text-green-400' : 'text-red-400'} ${isListening ? 'animate-pulse' : ''}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                  >
                    {word}
                  </motion.span>
                );
              })}
              {isListening && (
                <motion.span
                  className="w-2 h-6 bg-blue-500 rounded-full"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}