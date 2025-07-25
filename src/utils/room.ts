import { getRandomInt } from '../utils';
import { adjectives, nouns } from './dictionaries';

const generateRoomName = (): string => {
  const adjective = adjectives[getRandomInt(adjectives.length - 1)];
  const noun = nouns[getRandomInt(nouns.length - 1)];

  return `${adjective}-${noun}`;
};

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // reader.result will be a Data URL (e.g., "data:image/png;base64,...")
      // We only want the base64 part, so we split and take the second element.
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('FileReader result is not a string.'));
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(blob); // Start reading the blob
  });
};


export default generateRoomName;
