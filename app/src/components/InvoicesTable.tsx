import { useCallback, useMemo, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type FilterFn,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import {
  faArrowRight,
  faCheck,
  faFile,
  faMagnifyingGlass,
  faPencil,
  faTrash,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import addDays from 'date-fns/addDays';
import isPast from 'date-fns/isPast';
import useDisclosureForId from '@lib/useDisclosureForId';
import Routes from '@lib/routes';
import calculateTotal from '@lib/invoices/calculateTotal';
import type { Invoice } from '@server/invoices/types';
import formatDate from '@lib/formatDate';
import {
  Body,
  BodyCell,
  BodyRow,
  getSortingIcon,
  Head,
  HeaderCell,
  HeaderRow,
  Table,
} from './Table';
import Button from './Button';
import TextField from './TextField';
import ConfirmationDialog from './ConfirmationDialog';
import IconButton from './IconButton';
import LinkIconButton from './LinkIconButton';
import Chip from './Chip';

const toInvoiceTableRow = (invoice: Invoice) => {
  const dueDate = addDays(new Date(invoice.date), invoice.client.paymentTerms);
  const isOverdue = isPast(dueDate);
  let status = 'Draft';
  if (invoice.status === 'PAID') {
    status = 'Paid';
  } else if (invoice.status === 'SENT' && isOverdue) {
    status = 'Overdue';
  } else if (invoice.status === 'SENT') {
    status = 'Sent';
  }

  let number = '-';
  if (invoice.number && invoice.prefix) {
    number = `${invoice.prefix} - ${invoice.number}`;
  } else if (invoice.number) {
    number = invoice.number.toString();
  }

  const currency = invoice.items.find((item) => item.product.currency)?.product
    .currency;

  return {
    ...invoice,
    total: calculateTotal(invoice),
    clientName: invoice.client.name,
    status,
    number,
    dueDate,
    currency: currency ?? '',
  };
};

type InvoiceTableRow = ReturnType<typeof toInvoiceTableRow>;

const columnHelper = createColumnHelper<InvoiceTableRow>();

const fuzzyFilter: FilterFn<InvoiceTableRow> = (
  row,
  columnId,
  value,
  addMeta
) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

type InvoicesTableProps = {
  invoices: Invoice[];
  onDelete: (id: string) => void;
};

const InvoicesTable = ({ invoices, onDelete }: InvoicesTableProps) => {
  const { isOpen, openFor, onClose, onOpen } = useDisclosureForId();
  const handleDelete = useCallback(() => {
    if (openFor) {
      onDelete(openFor);
    }
  }, [onDelete, openFor]);
  const [globalFilter, setGlobalFilter] = useState('');
  const tableInvoices = useMemo(
    () => invoices.map(toInvoiceTableRow),
    [invoices]
  );
  const columns = useMemo(
    () => [
      columnHelper.accessor('number', {
        header: 'Number',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('clientName', {
        header: 'Client',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('date', {
        header: () => 'Date',
        cell: (info) => formatDate(info.getValue()),
      }),
      columnHelper.accessor('dueDate', {
        header: () => 'Due date',
        cell: (info) => formatDate(info.getValue()),
      }),
      columnHelper.accessor('status', {
        header: () => 'Status',
        cell: (info) => {
          const status = info.getValue();
          const size = 'sm';
          if (status === 'Draft') {
            return (
              <Chip
                color="secondary"
                variant="light"
                size={size}
                startIcon={faFile}
              >
                Draft
              </Chip>
            );
          } else if (status === 'Overdue') {
            return (
              <Chip
                color="danger"
                size={size}
                startIcon={faTriangleExclamation}
              >
                Overdue
              </Chip>
            );
          } else if (status === 'Sent') {
            return (
              <Chip
                color="secondary"
                variant="solid"
                size={size}
                startIcon={faArrowRight}
              >
                Sent
              </Chip>
            );
          } else if (status === 'Paid') {
            return (
              <Chip
                color="primary"
                variant="solid"
                size={size}
                startIcon={faCheck}
              >
                Paid
              </Chip>
            );
          }
        },
      }),
      columnHelper.accessor('total', {
        id: 'total',
        header: 'Total',
        cell: ({
          getValue,
          row: {
            original: { currency },
          },
        }) => `${getValue().toFixed(2)} ${currency}`,
      }),
      columnHelper.display({
        id: 'actions',
        cell: ({ row: { original } }) => {
          const beingCreated = original.id.startsWith('new-');
          const nonDraft = original.status !== 'Draft';
          return (
            <div className="flex gap-4 justify-end">
              <IconButton
                aria-label="Delete"
                color="danger"
                icon={faTrash}
                onClick={() => onOpen(original.id)}
                disabled={beingCreated || nonDraft}
              />
              <LinkIconButton
                aria-label="Edit"
                color="secondary"
                icon={faPencil}
                href={
                  beingCreated ? Routes.invoices : Routes.invoice(original.id)
                }
              />
            </div>
          );
        },
      }),
    ],
    [onOpen]
  );

  const table = useReactTable({
    data: tableInvoices,
    columns,
    state: {
      globalFilter,
    },
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="flex flex-col w-full items-end">
      <div className="w-full lg:max-w-[250px]">
        <TextField
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search"
          startAdornment={<FontAwesomeIcon icon={faMagnifyingGlass} />}
        />
      </div>
      <Table>
        <Head>
          {table.getHeaderGroups().map((headerGroup) => (
            <HeaderRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <HeaderCell key={header.id}>
                  {header.index < headerGroup.headers.length - 1 ? (
                    <Button
                      color="secondary"
                      variant="borderless"
                      size="sm"
                      endIcon={getSortingIcon(header.column.getIsSorted())}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </Button>
                  ) : null}
                </HeaderCell>
              ))}
            </HeaderRow>
          ))}
        </Head>
        <Body>
          {table.getRowModel().rows.map((row) => (
            <BodyRow key={row.id}>
              {row.getVisibleCells().map((cell, index) => (
                <BodyCell key={cell.id} header={index === 0}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </BodyCell>
              ))}
            </BodyRow>
          ))}
        </Body>
      </Table>
      <ConfirmationDialog
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleDelete}
        title="Are you sure you want to delete the invoice?"
        description="This action can not be undone. You will have to re-create the invoice from scratch."
        confirm={{ label: 'Delete', icon: faTrash }}
        cancel={{ label: 'Cancel' }}
      />
    </div>
  );
};

export default InvoicesTable;
