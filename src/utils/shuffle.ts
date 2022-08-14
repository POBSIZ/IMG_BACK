/**
 * 피셔-예이츠 셔플 알고리즘
 *
 * @param {any[]} _arr 배열
 * @returns {any[]} 무작위로 섞인 배열 반환
 */
export const shuffle = (_arr: any[]) => {
  const arr: any[] = [..._arr];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
