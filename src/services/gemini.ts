import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
console.log('API Key loaded:', API_KEY ? 'Yes' : 'No');

if (!API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export async function generateRandomSentence(): Promise<string> {
  const prompt = 'Generate a simple English sentence for language practice. The sentence should be clear and use basic grammar. Return ONLY the sentence, without any additional text, explanation or punctuation at the start or end.';
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Generated sentence:', text);
    return text;
  } catch (error) {
    console.error('Error details:', error);
    console.error('Error generating sentence:', JSON.stringify(error, null, 2));
    throw new Error('Failed to generate sentence');
  }
}

export async function validateResponse(expected: string, actual: string): Promise<{ isCorrect: boolean; feedback: string }> {
  console.log('heere', expected, actual)
  
  const prompt = `You are a JSON response generator. Your task is to compare two English sentences and determine if they have the same meaning.\n\nSentence 1: "${expected}"\nSentence 2: "${actual}"\n\nProvide your response in valid JSON format like this example:\n{\n  "isCorrect": true,\n  "feedback": "Both sentences are identical"\n}\n\nYour response MUST be a valid JSON object with exactly these two fields and types:\n- isCorrect: boolean (true/false)\n- feedback: string\n\nRespond with ONLY the JSON object, no other text.`;

  console.log('heere', prompt)

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const feedback = JSON.parse(response.text());
    return feedback;
  } catch (error) {
    console.error('Error validating response:', error);
    throw new Error('Failed to validate response');
  }
}