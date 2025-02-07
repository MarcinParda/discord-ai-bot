import { Message, OmitPartialGroupDMChannel } from 'discord.js';
import { ClientWithUser } from '../types/ClientWithUser';
import { respondWithThread } from '../utils/respondWithThread';
import { respondInThread } from '../utils/respondInThread';
import { generateGroqResponse } from '../groq';
import { getFeedUrlsFromNotion } from '../notion';

const categorizationPrompt = (prompt: string) =>
  `You are a categorizer assistant. 
Please categorize following prompt in one of two categories: GET_FEEDS_URL or OTHER. 
As a response return only one of these two categories name. 
No interpunction, no comments, no thought process. 
<prompt>${prompt}</prompt>`;

export const handleMessageCreate = async (
  client: ClientWithUser,
  message: OmitPartialGroupDMChannel<Message<boolean>>
) => {
  if (message.author.bot) {
    return;
  }

  if (message.mentions.has(client.user)) {
    const queryType = await generateGroqResponse(
      categorizationPrompt(message.content),
      []
    );
    console.log('Getting feeds', queryType);

    if (queryType === 'GET_FEEDS_URL') {
      const feeds = await getFeedUrlsFromNotion();
      const feedsUrl = feeds
        .map((feed) => `${feed.title}: ${feed.url}`)
        .join('\n');
      await message.reply(feedsUrl);
    } else {
      await respondWithThread(message, client);
    }

    if (
      message.channel.isThread() &&
      message.channel.ownerId === client.user.id
    ) {
      await respondInThread(message, client);
    }
  }
};
