import { Client, Message, OmitPartialGroupDMChannel } from 'discord.js';
import { generateGroqResponse } from '../groq';

const threadNameGeneratorPrompt = (userPrompt: string) => {
  return `Create a thread name based on the prompt. As shorter as better, but it should help me navigate between multiple threads. Don't user markdown here, respond with plain text.
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
      generateGroqResponse(prompt, []),
      generateGroqResponse(threadNameGeneratorPrompt(prompt), []),
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
