export function splitMessageIntoChunks(
  message: string,
  maxLength: number
): string[] {
  const chunks: string[] = [];
  let currentChunk = '';

  for (const word of message.split(' ')) {
    if (currentChunk.length + word.length + 1 > maxLength) {
      chunks.push(currentChunk);
      currentChunk = word;
    } else {
      currentChunk += (currentChunk.length ? ' ' : '') + word;
    }
  }

  if (currentChunk.length) {
    chunks.push(currentChunk);
  }

  return chunks;
}
