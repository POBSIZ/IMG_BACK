export const dateSort = (_a: Date | string, _b: Date | string) => {
  const A = new Date(_a);
  const B = new Date(_b);
  return Number(B) - Number(A);
};
