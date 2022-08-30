export interface getWordListDataType {
  // 단어장 이름
  name: string;

  // 라벨 목록 ( string: 라벨 이름, number, 라벨 인덱스 )
  labels: [string, number][];

  // 단어 목록 ( string: 단어, number: 라벨 인덱스 )
  word_list: [string, number][];

  // 원문
  origin: string;
}

export interface wordListType {
  word: string;
  phonetic: string;
  meaning: string;
  label: [string, number];
}

export interface getWordListResType {
  word_list: wordListType[];
}
