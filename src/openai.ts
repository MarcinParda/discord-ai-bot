import OpenAI from 'openai';
import dotenv from 'dotenv';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateResponse = async (
  prompt: string,
  conversation: ChatCompletionMessageParam[]
): Promise<string> => {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
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
