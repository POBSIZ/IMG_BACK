import { wordListType } from './getWordList';

export interface createVocaBodyType {
  // 단어장 이름
  name: string;

  // 라벨 목록 ( string: 라벨 이름, number, 라벨 인덱스 )
  labels: [string, number][];

  // 단어 목록 ( string: 단어, number: 라벨 인덱스 )
  word_list: wordListType[];

  // 원문
  origin: string;
}
