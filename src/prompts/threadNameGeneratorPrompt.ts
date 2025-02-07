export const threadNameGeneratorPrompt = (prompt: string) => {
  return `Create a thread name based on the prompt. As shorter as better, but it should help me navigate between multiple threads. Don't user markdown here, respond with plain text.
  <prompt>
    ${prompt}
  </prompt>`;
};
