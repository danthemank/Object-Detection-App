import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey || apiKey === 'your-openai-api-key-here') {
  throw new Error('OpenAI API key is not configured. Please add your API key to the .env file.');
}

export const openaiClient = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true
});
