import type { SentenceCollection } from "../types/sentences";
import simplePresentSentences from '../data/sentences/simple-present.json';
import presentContinuousSentences from '../data/sentences/present-continuous.json';
import simplePastSentences from '../data/sentences/simple-past.json';
import pastContinuousSentences from '../data/sentences/past-continuous.json';
import presentPerfectSentences from '../data/sentences/present-perfect.json';

const topicToSentences: { [key: string]: string[] } = {
  'Simple Present': simplePresentSentences.sentences,
  'Present Continuous': presentContinuousSentences.sentences,
  'Simple Past': simplePastSentences.sentences,
  'Past Continuous': pastContinuousSentences.sentences,
  'Present Perfect': presentPerfectSentences.sentences
};

export const availableTopics: SentenceCollection[] = [
  simplePresentSentences,
  presentContinuousSentences,
  simplePastSentences,
  pastContinuousSentences,
  presentPerfectSentences
];

export function generateRandomSentence(topic: string): string {
  const sentences = topicToSentences[topic];
  if (!sentences) {
    throw new Error(`Topic ${topic} not found`);
  }
  const randomIndex = Math.floor(Math.random() * sentences.length);
  return sentences[randomIndex];
}