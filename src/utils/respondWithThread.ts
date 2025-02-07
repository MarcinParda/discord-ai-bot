import { Client, Message, OmitPartialGroupDMChannel } from 'discord.js';
import { generateGroqResponse } from '../groq';
import { threadNameGeneratorPrompt } from '../prompts/threadNameGeneratorPrompt';

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
