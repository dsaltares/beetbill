import { InvoiceStatus } from '@prisma/client';
import { useMemo } from 'react';
import useInvoices from './useInvoices';

const useLatestNumberByPrefix = () => {
  const { data: invoices, ...rest } = useInvoices();
  const numbersByPrefix = useMemo(
    () =>
      (invoices || []).reduce((acc, invoice) => {
        const { prefix, number, status } = invoice;
        if (status !== InvoiceStatus.DRAFT || !number) {
          return acc;
        }

        const current = acc[prefix] || 0;
        return {
          ...acc,
          [prefix]: Math.max(current, number),
        };
      }, {} as { [key: string]: number }),
    [invoices]
  );
  return {
    ...rest,
    data: numbersByPrefix,
  };
};

export default useLatestNumberByPrefix;
