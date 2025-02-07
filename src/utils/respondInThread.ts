import { Client, Message, OmitPartialGroupDMChannel } from 'discord.js';
import { ChatCompletionAssistantMessageParam } from 'openai/resources/index.mjs';
import { ChatCompletionUserMessageParam } from 'openai/src/resources/index.js';
import { generateResponse } from '../openai';

export async function respondInThread(
  message: OmitPartialGroupDMChannel<Message<boolean>>,
  client: Client
) {
  try {
    await message.channel.sendTyping();

    // Fetch all messages in the thread
    const messages = await message.channel.messages.fetch();

    const conversation: (
      | ChatCompletionAssistantMessageParam
      | ChatCompletionUserMessageParam
    )[] = messages
      .map((msg) => {
        if (msg.author.id === client.user?.id) {
          return {
            role: 'assistant',
            content: msg.content,
          } as ChatCompletionAssistantMessageParam;
        }
        return {
          role: 'user',
          content: msg.content,
        } as ChatCompletionUserMessageParam;
      })
      .reverse();

    const response = await generateResponse(message.content, conversation);
    await message.reply(response);
  } catch (error) {
    console.error('Error:', error);
    await message.reply('An error occurred while processing your request');
  }
}
