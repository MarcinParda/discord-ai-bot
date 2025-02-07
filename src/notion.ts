import dotenv from 'dotenv';
import { Client, LogLevel } from '@notionhq/client';

dotenv.config();

const { NOTION_API_TOKEN, NOTION_FEEDS_DATABASE_ID, CI } = process.env;

const logLevel = CI ? LogLevel.INFO : LogLevel.DEBUG;

export const notion = new Client({
  auth: NOTION_API_TOKEN,
  logLevel,
});

export async function getFeedUrlsFromNotion() {
  try {
    const response = await notion.databases.query({
      database_id: NOTION_FEEDS_DATABASE_ID!,
      filter: {
        or: [
          {
            property: 'Enabled',
            checkbox: { equals: true },
          },
        ],
      },
    });

    const feeds = response.results.map((item) => ({
      // @ts-ignore
      url: item.properties['Link'].url,
      // @ts-ignore
      title: item.properties['Title'].title[0].text.content,
    }));
    return feeds;
  } catch (err) {
    console.error(err);
    return [];
  }
}
