export const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
export const endOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

export const toFixedNumber = (value, digits = 2) => Number(Number(value || 0).toFixed(digits));


