import { Message, OmitPartialGroupDMChannel } from 'discord.js';
import { ClientWithUser } from '../types/ClientWithUser';
import { respondWithThread } from '../utils/respondWithThread';
import { respondInThread } from '../utils/respondInThread';

export const handleMessageCreate = async (
  client: ClientWithUser,
  message: OmitPartialGroupDMChannel<Message<boolean>>
) => {
  if (message.author.bot) {
    return;
  }

  if (message.mentions.has(client.user)) {
    await respondWithThread(message, client);
  }

  if (
    message.channel.isThread() &&
    message.channel.ownerId === client.user.id
  ) {
    await respondInThread(message, client);
  }
};
