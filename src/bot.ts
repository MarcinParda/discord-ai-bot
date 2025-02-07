import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { handleMessageCreate, handleReady, handleInteractionCreate } from './handlers';

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

client.on('ready', () => handleReady(client));
client.on('messageCreate', (message) => handleMessageCreate(client, message));
client.on('interactionCreate', handleInteractionCreate);

client.login(process.env.DISCORD_TOKEN);
