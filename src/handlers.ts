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
} from 'discord.js';
import { generateResponse } from './openai';
import { ChatCompletionAssistantMessageParam } from 'openai/resources/index.mjs';
import { ChatCompletionUserMessageParam } from 'openai/src/resources/index.js';
