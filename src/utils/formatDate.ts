export const formatDate = (_date: Date | string, _isDetail: boolean) => {
  if (_date === undefined) _date = new Date();
  const _dateObj = new Date(_date);

  const year = _dateObj.getFullYear();

  const month =
    _dateObj.getMonth() + 1 < 10
      ? `0${_dateObj.getMonth() + 1}`
      : _dateObj.getMonth() + 1;

  const date =
    _dateObj.getDate() < 10 ? `0${_dateObj.getDate()}` : _dateObj.getDate();

  const hour =
    _dateObj.getHours() < 10 ? `0${_dateObj.getHours()}` : _dateObj.getHours();

  const minute =
    _dateObj.getMinutes() < 10
      ? `0${_dateObj.getMinutes()}`
      : _dateObj.getMinutes();

  return _isDetail
    ? `${year}/${month}/${date} ${hour}:${minute}`
    : `${year}/${month}/${date}`;
};
