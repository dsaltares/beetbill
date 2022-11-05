import format from 'date-fns/format';

const formatDate = (date: Date | string) =>
  format(new Date(date), 'yyyy-MM-dd');

export default formatDate;
