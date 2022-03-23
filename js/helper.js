export const formatCur = function (value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

export const formatAmt = function (value) {
  return new Intl.NumberFormat('en-US', {
    useGrouping: true,
    minimumFractionDigits: 2,
  }).format(value);
};

export const formatDate = function (date) {
  return new Intl.DateTimeFormat('en-US').format(date);
};

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const setLocalStorage = function (key, dataPath) {
  localStorage.setItem(key, JSON.stringify(dataPath));
};

export const getLocalStorage = function (key) {
  const dataObj = JSON.parse(localStorage.getItem(key));
  if (!dataObj) return;
  return dataObj;
};
