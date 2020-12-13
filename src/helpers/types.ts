export type Emotions = {
  sad: number,
  happy: number,
  angry: number,
};

export const emotionTypes: Array<keyof Emotions> = ["sad", "happy", "angry"];
