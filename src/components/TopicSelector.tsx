import { motion } from 'framer-motion';
import type { GrammarTopic } from '../types/grammar';

type TopicSelectorProps = {
  topics: GrammarTopic[];
  onSelectTopic: (topic: GrammarTopic) => void;
};

export function TopicSelector({ topics, onSelectTopic }: TopicSelectorProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-center text-dark-text">
        Choose a Grammar Topic
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card hover:scale-105 transition-transform cursor-pointer"
            onClick={() => onSelectTopic(topic)}
          >
            <h2 className="text-2xl font-bold mb-2">{topic.title}</h2>
            <p className="text-dark-muted mb-4">{topic.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-dark-muted">
                {topic.sentences.length} practice sentences
              </span>
              <button className="btn-primary">
                Start Practice
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}