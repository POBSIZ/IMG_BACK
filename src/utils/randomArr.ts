/**
 * 중복 없는 난수 배열 생성 함수
 *
 * 난수의 범위는 배열의 최대 길이보다 항상 작아야 한다.
 *
 * @param {number[]} _arr 빈 배열
 * @param {number} _randRange 난수 범위 (0 ~ _randRange)
 * @param {number} _maxArrLen 배열의 최대 길이
 * @returns {number[]} _arr
 */
export const randomArr = (
  _arr: number[],
  _randRange: number,
  _maxArrLen: number,
): number[] => {
  if (_randRange < _maxArrLen) {
    return _arr;
  }
  const randNum: number = Math.floor(Math.random() * _randRange);
  if (_arr.length < _maxArrLen && _arr.indexOf(randNum) < 0) {
    _arr.push(randNum);
    return randomArr(_arr, _randRange, _maxArrLen);
  } else {
    if (_arr.length < _maxArrLen) {
      return randomArr(_arr, _randRange, _maxArrLen);
    } else {
      return _arr;
    }
  }
};
