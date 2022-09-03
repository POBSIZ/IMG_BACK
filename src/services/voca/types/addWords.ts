import { wordListType } from './getWordList';

export interface AddWordsBodyType {
  voca_id: string;
  word_list: wordListType[];
  origin: string;
}
