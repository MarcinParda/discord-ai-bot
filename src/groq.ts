import Groq from 'groq-sdk';
import { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions.mjs';
import dotenv from 'dotenv';

dotenv.config();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateGroqResponse = async (
  prompt: string,
  conversation: Array<ChatCompletionMessageParam>
): Promise<string> => {
  const completion = await groq.chat.completions.create({
    model: 'llama3-8b-8192',
    messages: [
      { role: 'system', content: 'You are a helpful Discord assistant' },
      ...conversation,
      { role: 'user', content: prompt },
    ],
  });

  return (
    completion.choices[0].message.content ||
    "I'm sorry, I don't understand that"
  );
};
