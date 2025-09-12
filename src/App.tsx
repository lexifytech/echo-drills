import { useState, useEffect } from 'react';
import { TopicSelector } from './components/TopicSelector';
import { PracticeDrill } from './components/PracticeDrill';
import type { GrammarTopic } from './types/grammar';
import { grammarTopics } from './types/grammar';

function App() {
  const [selectedTopic, setSelectedTopic] = useState<GrammarTopic | null>(null);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-dark-primary p-4">
      {selectedTopic ? (
        <PracticeDrill
          topic={selectedTopic}
          onBack={() => setSelectedTopic(null)}
        />
      ) : (
        <TopicSelector
          topics={grammarTopics}
          onSelectTopic={setSelectedTopic}
        />
      )}
    </div>
  );
}

export default App;
