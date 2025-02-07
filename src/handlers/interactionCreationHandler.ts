import { Interaction, PermissionFlagsBits, TextChannel } from 'discord.js';
import { getFeedUrlsFromNotion } from '../notion';

export const handleInteractionCreate = async (interaction: Interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  if (!interaction.channel) {
    await interaction.reply(
      'This command can only be used in server text channels'
    );
    return;
  }

  const { commandName } = interaction;

  switch (commandName) {
    case 'clearall':
      try {
        const textChannel = interaction.channel as TextChannel;

        if (
          interaction.guild &&
          !textChannel
            .permissionsFor(interaction.guild.members.me!)
            .has(PermissionFlagsBits.ManageMessages)
        ) {
          await interaction.reply(
            'I need **Manage Messages** permission to clear messages'
          );
          return;
        }

        const fetchedMessages = await textChannel.messages.fetch({
          limit: 100,
        });
        await textChannel.bulkDelete(fetchedMessages, true);

        const threads = await textChannel.threads.fetchActive();
        for (const thread of threads.threads.values()) {
          await thread.delete();
        }

        await interaction.reply(
          'Successfully cleared up to 100 messages and all threads'
        );
      } catch (error) {
        console.error('Error clearing messages and threads:', error);
        await interaction.reply(
          'Failed to clear messages and threads - check console for details'
        );
      }
      break;
    case 'getfeedurls':
      const feeds = await getFeedUrlsFromNotion();
      const message = feeds
        .map((feed) => `${feed.title}: ${feed.url}`)
        .join('\n');
      await interaction.reply(message);
      break;
    default:
      break;
  }
};
