import { Client, Message, OmitPartialGroupDMChannel } from 'discord.js';
import { generateGroqResponse } from '../groq';
import {
  ChatCompletionMessageParam,
  ChatCompletionAssistantMessageParam,
  ChatCompletionUserMessageParam,
} from 'groq-sdk/src/resources/chat/completions.js';
import { MAX_MESSAGE_CHAR_LENGHT } from '../consts/discord';
import { splitMessageIntoChunks } from './splitMessageIntoChunks';

export async function respondInThread(
  message: OmitPartialGroupDMChannel<Message<boolean>>,
  client: Client
) {
  try {
    await message.channel.sendTyping();

    // Fetch all messages in the thread
    const messages = await message.channel.messages.fetch();

    const conversation: Array<ChatCompletionMessageParam> = messages
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

    const response = await generateGroqResponse(message.content, conversation);
    const responseChunks = splitMessageIntoChunks(
      response,
      MAX_MESSAGE_CHAR_LENGHT
    );

    for (const chunk of responseChunks) {
      await message.reply(chunk);
    }
  } catch (error) {
    console.error('Error:', error);
    await message.reply('An error occurred while processing your request');
  }
}
