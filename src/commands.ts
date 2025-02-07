import { SlashCommandBuilder } from '@discordjs/builders';
import dotenv from 'dotenv';

dotenv.config();

const clearAllCommand = new SlashCommandBuilder()
  .setName('clearall')
  .setDescription('Clears all messages in the channel');

const getfeedurls = new SlashCommandBuilder()
  .setName('getfeedurls')
  .setDescription('Shows feed URLs from Notion');

export const commands = [clearAllCommand, getfeedurls].map((command) =>
  command.toJSON()
);
