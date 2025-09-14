import { motion } from 'framer-motion';

type SessionProgressProps = {
  score: number;
  streak: number;
  progress: number;
};

export default function SessionProgress({ score, streak, progress }: SessionProgressProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-400">Score</p>
          <motion.p 
            className="text-2xl font-bold text-primary"
            key={score}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {score}
          </motion.p>
        </div>

        <div className="space-y-1 text-right">
          <p className="text-sm font-medium text-slate-400">Streak</p>
          <div className="flex items-center justify-end gap-2">
            <motion.p
              className="text-2xl font-bold text-orange-500"
              key={streak}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {streak}
            </motion.p>
            <span className="text-orange-500">🔥</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-slate-400">
          <span>Session Progress</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}