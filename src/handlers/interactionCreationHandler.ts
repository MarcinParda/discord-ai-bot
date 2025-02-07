import { Interaction, PermissionFlagsBits, TextChannel } from "discord.js";

export const handleInteractionCreate = async (interaction: Interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'clearall') {
    if (!interaction.channel) {
      await interaction.reply(
        'This command can only be used in server text channels'
      );
      return;
    }

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

      const fetchedMessages = await textChannel.messages.fetch({ limit: 100 });
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
  }
};
