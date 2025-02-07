import {
  Client,
  Message,
  OmitPartialGroupDMChannel,
  Interaction,
  TextChannel,
  PermissionFlagsBits,
  SlashCommandBuilder,
  REST,
  Routes,
  ThreadChannel,
} from 'discord.js';
import { generateResponse } from './openai';
import { ChatCompletionAssistantMessageParam } from 'openai/resources/index.mjs';
import { ChatCompletionUserMessageParam } from 'openai/src/resources/index.js';

export const handleReady = async (client: Client) => {
  console.log(`Logged in as ${client.user?.tag}!`);

  const commands = [
    new SlashCommandBuilder()
      .setName('clearall')
      .setDescription('Clears all messages in the channel'),
  ].map((command) => command.toJSON());

  const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN!);

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(client.user!.id, process.env.GUILD_ID!),
      { body: commands }
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
};

export const handleMessageCreate = async (
  client: Client,
  message: OmitPartialGroupDMChannel<Message<boolean>>
) => {
  if (message.author.bot) return;

  // RESPOND AND CREATE THREAD
  if (message.mentions.has(client.user!)) {
    try {
      await message.channel.sendTyping();

      const prompt = message.content
        .replace(`<@${client.user?.id}>`, '')
        .trim();

      const response = await generateResponse(prompt, []);

      const thread = await message.startThread({
        name: `Response to ${message.author.username}`,
        autoArchiveDuration: 60,
      });

      await thread.send(response);
    } catch (error) {
      console.error('Error:', error);
      await message.reply('An error occurred while processing your request');
    }
  }

  // RESPOND IN THREAD
  if (
    message.channel.isThread() &&
    message.channel.ownerId === client.user?.id
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
};

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
