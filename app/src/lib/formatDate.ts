import format from 'date-fns/format';

const formatDate = (date: Date | string) =>
  format(new Date(date), 'dd MMMM yyyy');

export default formatDate;
