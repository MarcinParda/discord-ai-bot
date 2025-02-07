import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { handleReady } from './handlers/readyHandler';
import { handleMessageCreate } from './handlers/messageCreationHandler';
import { handleInteractionCreate } from './handlers/interactionCreationHandler';
import { ClientWithUser } from './types/ClientWithUser';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
  ],
});

client.on('ready', () => {
  if (client.user) {
    const readyClient = client as ClientWithUser;
    handleReady(readyClient);
  }
});

client.on('messageCreate', (message) => {
  if (client.user) {
    const readyClient = client as ClientWithUser;
    handleMessageCreate(readyClient, message);
  }
});

client.on('interactionCreate', handleInteractionCreate);

client.login(process.env.DISCORD_TOKEN);
