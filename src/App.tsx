import { useState, useEffect } from 'react';
import TopicSelector from './components/TopicSelector';
import PracticeDrill from './components/PracticeDrill';
import { availableTopics } from './services/sentences';
import { PracticeProvider } from './contexts/PracticeContext';

function App() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <PracticeProvider>
      <div className="min-h-screen bg-dark-primary p-4">
      {selectedTopic ? (
        <PracticeDrill
          topic={selectedTopic}
          onBack={() => setSelectedTopic(null)}
        />
      ) : (
        <TopicSelector
          topics={availableTopics}
          onSelectTopic={setSelectedTopic}
        />
      )}
      </div>
    </PracticeProvider>
  );
}

export default App;
