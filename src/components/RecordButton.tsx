import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type RecordButtonProps = {
  isListening: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

export default function RecordButton({
  isListening,
  onToggle,
  disabled = false,
}: RecordButtonProps) {
  const [volume, setVolume] = useState(0);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);

  useEffect(() => {
    if (isListening && !audioContext) {
      const initAudio = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const context = new AudioContext();
          const source = context.createMediaStreamSource(stream);
          const analyserNode = context.createAnalyser();
          
          analyserNode.fftSize = 32;
          source.connect(analyserNode);
          
          setAudioContext(context);
          setAnalyser(analyserNode);
          setDataArray(new Uint8Array(analyserNode.frequencyBinCount));
        } catch (error) {
          console.error('Error initializing audio:', error);
        }
      };

      initAudio();
    }

    return () => {
      if (audioContext) {
        audioContext.close();
        setAudioContext(null);
        setAnalyser(null);
        setDataArray(null);
      }
    };
  }, [isListening]);

  useEffect(() => {
    let animationFrame: number;

    const updateVolume = () => {
      if (analyser && dataArray) {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((acc, value) => acc + value, 0) / dataArray.length;
        setVolume(average / 255); // Normalize to 0-1
      }
      animationFrame = requestAnimationFrame(updateVolume);
    };

    if (isListening) {
      updateVolume();
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isListening, analyser, dataArray]);

  const buttonVariants = {
    idle: { scale: 1 },
    recording: { scale: 1 + volume * 0.2 },
  };

  const ringVariants = {
    idle: { scale: 1, opacity: 0 },
    recording: { scale: 1.5 + volume * 0.5, opacity: 0.5 - volume * 0.3 },
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {isListening && (
          <motion.div
            className="absolute inset-0 bg-red-500 rounded-full"
            variants={ringVariants}
            initial="idle"
            animate="recording"
            exit="idle"
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      <motion.button
        onClick={onToggle}
        disabled={disabled}
        className={`
          relative z-10 px-6 py-3 rounded-full font-medium text-white
          ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          transition-colors duration-200
        `}
        variants={buttonVariants}
        initial="idle"
        animate={isListening ? 'recording' : 'idle'}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="flex items-center gap-2">
          {isListening ? (
            <>
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Recording...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4z" />
                <path d="M5.5 9.643a.5.5 0 00-1 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.5.5 0 100 1h4.5a.5.5 0 100-1h-1.5v-1.546A6.001 6.001 0 0015.5 10v-.357a.5.5 0 00-1 0V10a5 5 0 01-10 0v-.357z" />
              </svg>
              Start Recording
            </>
          )}
        </div>
      </motion.button>
    </div>
  );
}