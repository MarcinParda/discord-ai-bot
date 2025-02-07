import { Client } from 'discord.js';

export type ClientWithUser = Client & { user: NonNullable<Client['user']> };
