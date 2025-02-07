import { Message, OmitPartialGroupDMChannel } from 'discord.js';
import { ClientWithUser } from '../types/ClientWithUser';
import { respondWithThread } from '../utils/respondWithThread';
import { respondInThread } from '../utils/respondInThread';
import { generateGroqResponse } from '../groq';
import { getFeedUrlsFromNotion } from '../notion';
import { getPromptCategoryPrompt } from '../prompts/getCategoryPrompts';
import { PromptCategory } from '../types/Prompts';

export const handleMessageCreate = async (
  client: ClientWithUser,
  message: OmitPartialGroupDMChannel<Message<boolean>>
) => {
  if (message.author.bot) {
    return;
  }
  // Add guard check for generateGroqResponse
  const promptCategory = (await generateGroqResponse(
    getPromptCategoryPrompt(message.content),
    []
  )) as PromptCategory;

  if (message.mentions.has(client.user)) {
    switch (promptCategory) {
      case 'GET_FEEDS_URL':
        const feeds = await getFeedUrlsFromNotion();
        const feedsUrl = feeds
          .map((feed) => `${feed.title}: ${feed.url}`)
          .join('\n');
        await message.reply(feedsUrl);
        return;
      default:
        await respondWithThread(message, client);
        return;
    }
  }

  if (
    message.channel.isThread() &&
    message.channel.ownerId === client.user.id
  ) {
    await respondInThread(message, client);
    return;
  }
};
