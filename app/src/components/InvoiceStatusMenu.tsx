import cn from 'classnames';
import addDays from 'date-fns/addDays';
import isPast from 'date-fns/isPast';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Menu, Transition } from '@headlessui/react';
import { useCallback } from 'react';
import type { Invoice, InvoiceStatus } from '@server/invoices/types';
import useUpdateInvoice from '@lib/invoices/useUpdateInvoice';
import Chip from './Chip';

type InvoiceStatusMenuProps = {
  invoice: Invoice;
};

type Option = {
  label: string;
  value: InvoiceStatus;
};

const getOptions = (status: InvoiceStatus): Option[] => {
  if (status === 'SENT') {
    return [{ label: 'Paid', value: 'PAID' }];
  } else if (status === 'PAID') {
    return [{ label: 'Unpaid', value: 'SENT' }];
  }
  return [];
};

const InvoiceStatusMenu = ({ invoice }: InvoiceStatusMenuProps) => {
  const { mutate: updateInvoice, isLoading } = useUpdateInvoice();
  const handleMenuItemClick = useCallback(
    (newStatus: InvoiceStatus) =>
      updateInvoice({ id: invoice.id, status: newStatus }),
    [updateInvoice, invoice.id]
  );
  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <div>
            {invoice.status === 'DRAFT' || isLoading ? (
              <InvoiceStatusChip invoice={invoice} />
            ) : (
              <Menu.Button>
                <InvoiceStatusChip invoice={invoice} open={open} />
              </Menu.Button>
            )}
          </div>
          <Transition
            as="div"
            className="relative z-10"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Menu.Items className="w-full absolute bottom-[28px] overflow-auto rounded-md bg-white py-2 shadow-xl border border-zinc-300 focus-ring">
              {getOptions(invoice.status)?.map(({ label, value }) => (
                <Menu.Item key={label}>
                  {({ active }) => (
                    <button
                      className={cn(
                        'flex items-center w-full gap-2 py-2 px-3 text-base',
                        {
                          'bg-violet-50 text-violet-800': active,
                          'text-zinc-900': !active,
                        }
                      )}
                      onClick={() => handleMenuItemClick(value)}
                    >
                      {label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

type InvoiceStatusChipProps = {
  invoice: Invoice;
  open?: boolean;
};

const InvoiceStatusChip = ({
  invoice: {
    date,
    client: { paymentTerms },
    status,
  },
  open = false,
}: InvoiceStatusChipProps) => {
  const dueDate = addDays(new Date(date), paymentTerms);
  const isOverdue = isPast(dueDate);
  const size = 'sm';
  const icon = open ? faChevronUp : faChevronDown;
  if (status === 'DRAFT') {
    return (
      <Chip color="secondary" variant="light" size={size}>
        Draft
      </Chip>
    );
  } else if (status === 'SENT' && isOverdue) {
    return (
      <Chip color="danger" size={size} endIcon={icon}>
        Overdue
      </Chip>
    );
  } else if (status === 'SENT') {
    return (
      <Chip color="primary" variant="light" size={size} endIcon={icon}>
        Sent
      </Chip>
    );
  } else if (status === 'PAID') {
    return (
      <Chip color="primary" variant="solid" size={size} endIcon={icon}>
        Paid
      </Chip>
    );
  }
  return null;
};

export default InvoiceStatusMenu;
