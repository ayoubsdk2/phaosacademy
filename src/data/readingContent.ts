export interface ContentBlock {
  type: 'paragraph' | 'heading' | 'bullets' | 'quote' | 'callout' | 'examples' | 'steps' | 'script' | 'table';
  text?: string;
  icon?: string;
  author?: string;
  heading?: string;
  items?: { bold: string; text: string }[];
  examples?: string[];
  steps?: { step: string; description: string }[];
  lines?: { speaker?: string; text: string }[];
  label?: string;
  rows?: string[][];
  headers?: string[];
}

import { READING_CONTENT_WEEK1 } from './readingContentWeek1';
import { READING_CONTENT_WEEK2 } from './readingContentWeek2';

export const READING_CONTENT: Record<string, ContentBlock[]> = {
  ...READING_CONTENT_WEEK1,
  ...READING_CONTENT_WEEK2,
};
