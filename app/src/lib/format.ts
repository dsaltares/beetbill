import format from 'date-fns/format';

export const formatDate = (date: Date | string) =>
  format(new Date(date), 'dd MMMM yyyy');

export const safeFormatDate = (date: Date | string) => {
  try {
    return formatDate(date);
  } catch (e) {}
};

export const datePickerFormat = (date: Date) => format(date, 'yyyy-MM-dd');

export const formatNumber = (value: number) => DecimalFormatter.format(value);

export const formatPercentage = (value: number) =>
  PercentFormatter.format(value);

export const formatAmount = (amount: number, currency: string | undefined) =>
  isNaN(amount)
    ? '-'
    : new Intl.NumberFormat('en-UK', {
        style: 'currency',
        currency: currency || 'EUR',
      }).format(amount);

const DecimalFormatter = new Intl.NumberFormat('en-UK', { style: 'decimal' });
const PercentFormatter = new Intl.NumberFormat('en-UK', { style: 'percent' });
