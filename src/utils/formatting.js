/* src/utils/formatting.js */
export const formatNumberInput = (value) => {
  if (!value) return '';
  const stringValue = value.toString().replace(/[^\d]/g, '');
  if (stringValue === '') return '';
  return new Intl.NumberFormat('id-ID').format(parseInt(stringValue, 10));
};

export const parseFormattedNumber = (value) => {
  if (!value) return 0;
  return parseInt(value.toString().replace(/[^\d]/g, ''), 10) || 0;
};