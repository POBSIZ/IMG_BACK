/**
 * 중복 없는 난수 배열 생성 함수
 *
 * 난수의 범위는 배열의 최대 길이보다 항상 작아야 한다.
 *
 * @param {number} _randRange 난수 범위 (0 ~ _randRange)
 * @param {number} _maxArrLen 배열의 최대 길이
 * @param {number[]} _arr 빈 배열
 * @returns {number[]} _arr
 */
export const randomArr = (
  _randRange: number,
  _maxArrLen: number,
  _arr: number[] = [],
): number[] => {
  const _Array = [..._arr];

  // 난수 범위가 배열 최대 길이보다 클 경우 배열 즉시 반환
  if (_randRange < _maxArrLen) {
    return _Array;
  }

  const randNum: number = Math.floor(Math.random() * _randRange);

  if (_Array.length < _maxArrLen && _Array.indexOf(randNum) < 0) {
    _Array.push(randNum);
    return randomArr(_randRange, _maxArrLen, _Array);
  } else {
    if (_Array.length < _maxArrLen) {
      return randomArr(_randRange, _maxArrLen, _Array);
    } else {
      return _Array;
    }
  }
};

// export const randomArr = (
//   _arr: number[],
//   _randRange: number,
//   _maxArrLen: number,
// ): number[] => {
//   const copyArr = [..._arr];

//   if (_randRange < _maxArrLen) {
//     return _arr;
//   }

//   const randNum: number = Math.floor(Math.random() * _randRange);

//   return copyArr.length < _maxArrLen && copyArr.indexOf(randNum) < 0
//     ? randomArr([...copyArr, randNum], _randRange, _maxArrLen)
//     : copyArr.length < _maxArrLen
//     ? randomArr(copyArr, _randRange, _maxArrLen)
//     : copyArr;
// };
