import { REST, Routes } from 'discord.js';
import { ClientWithUser } from '../types/ClientWithUser';
import { commands } from '../commands';

export const handleReady = async (client: ClientWithUser) => {
  console.log(`Logged in as ${client.user.tag}!`);
  const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN!);

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID!),
      { body: commands }
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
};
