import { PROMPT_CATEGORIES } from '../consts/prompts';

export const getPromptCategoryPrompt = (prompt: string) =>
  `You are a categorizer assistant. 
Please categorize following prompt in one of these categories: ${PROMPT_CATEGORIES.join(
    ', '
  )}. 
As a response return only one category name. 
No interpunction, no comments, no thought process. 
<prompt>${prompt}</prompt>`;
