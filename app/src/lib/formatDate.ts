import format from 'date-fns/format';

const formatDate = (date: Date | string) =>
  format(new Date(date), 'dd MMMM yyyy');

export const safeFormatDate = (date: Date | string) => {
  try {
    return formatDate(date);
  } catch (e) {}
};

export default formatDate;
