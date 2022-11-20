import type { Client, ClientState } from '@prisma/client';
import calculateTotal from '@lib/invoices/calculateTotal';
import type { Invoice } from '@server/invoices/types';
import type { Client as APIClient } from './types';

type Entity = Client & { states: ClientState[] };
const mapClientEntity = (
  { states, ...client }: Entity,
  invoices: Invoice[]
): APIClient => {
  const { toBePaid, paid } = getAmounts(invoices);

  return {
    ...states[0],
    ...client,
    createdAt: client.createdAt.toISOString(),
    updatedAt: client.updatedAt.toISOString(),
    toBePaid,
    paid,
  };
};

const getAmounts = (invoices: Invoice[]) => {
  if (
    invoices.length === 0 ||
    invoices[0].items.length === 0 ||
    !hasSameCurrency(invoices)
  ) {
    return {
      toBePaid: undefined,
      paid: undefined,
    };
  }

  const currency = invoices[0].items[0].product.currency;
  const { toBePaid, paid } = invoices.reduce(
    (acc, invoice) => {
      const { total } = calculateTotal(invoice.items);
      if (invoice.status === 'PAID') {
        return { ...acc, paid: acc.paid + total };
      } else if (invoice.status === 'SENT') {
        return { ...acc, toBePaid: acc.toBePaid + total };
      }
      return acc;
    },
    {
      toBePaid: 0,
      paid: 0,
    }
  );
  return {
    toBePaid: { currency, value: toBePaid },
    paid: { currency, value: paid },
  };
};

const hasSameCurrency = (invoices: Invoice[]) => {
  const currencies = invoices.map(
    (invoice) => invoice.items[0]?.product.currency
  );
  return currencies.every((currency) => currency === currencies[0]);
};

export default mapClientEntity;
