import { Client, Message, OmitPartialGroupDMChannel } from 'discord.js';
import { generateResponse } from '../openai';

const threadNameGeneratorPrompt = (userPrompt: string) => {
  return `Create a thread name based on the prompt. It should be one sentence long summary, max 10 words. 
  <prompt>
    ${userPrompt}
  </prompt>`;
};

export async function respondWithThread(
  message: OmitPartialGroupDMChannel<Message<boolean>>,
  client: Client
) {
  try {
    message.channel.sendTyping();

    const prompt = message.content.replace(`<@${client.user?.id}>`, '').trim();
    const [response, threadName] = await Promise.all([
      generateResponse(prompt, []),
      generateResponse(threadNameGeneratorPrompt(prompt), []),
    ]);

    const thread = await message.startThread({
      name: threadName,
      autoArchiveDuration: 60,
    });

    await thread.send(response);
  } catch (error) {
    console.error('Error:', error);
    message.reply('An error occurred while responding with a thread');
  }
}
