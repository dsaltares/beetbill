import format from 'date-fns/format';

export const formatDate = (date: Date | string) =>
  format(new Date(date), 'dd MMMM yyyy');

export const safeFormatDate = (date: Date | string) => {
  try {
    return formatDate(date);
  } catch (e) {}
};

export const datePickerFormat = (date: Date) => format(date, 'yyyy-MM-dd');
