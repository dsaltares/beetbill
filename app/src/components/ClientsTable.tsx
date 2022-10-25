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
  faMagnifyingGlass,
  faPencil,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useDisclosureForId from '@lib/useDisclosureForId';
import Routes from '@lib/routes';
import type { Client } from '@server/clients/types';
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
import LinkButton from './LinkButton';

const columnHelper = createColumnHelper<Client>();

const fuzzyFilter: FilterFn<Client> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

type ClientsTableProps = {
  clients: Client[];
  onDelete: (id: string) => void;
};

const fullName = (
  firstName: string | undefined | null,
  lastName: string | undefined | null
) => [firstName, lastName].filter((part) => part).join(' ');

const ClientsTable = ({ clients, onDelete }: ClientsTableProps) => {
  const { isOpen, openFor, onClose, onOpen } = useDisclosureForId();
  const handleDelete = useCallback(() => {
    if (openFor) {
      onDelete(openFor);
    }
  }, [onDelete, openFor]);
  const [globalFilter, setGlobalFilter] = useState('');
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: () => 'Name',
        cell: (info) => (
          <div className="flex flex-col gap-1">
            <div className="text-xl font-medium">{info.getValue()}</div>
            <div className="text-base font-normal">
              {fullName(
                info.row.original.firstName,
                info.row.original.lastName
              )}
            </div>
          </div>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        cell: (info) => (
          <div className="flex gap-4 justify-end">
            <Button
              color="danger"
              endIcon={faTrash}
              onClick={() => onOpen(info.row.original.id)}
            >
              Delete
            </Button>
            <LinkButton
              color="secondary"
              endIcon={faPencil}
              href={Routes.client(info.row.original.id)}
            >
              Edit
            </LinkButton>
          </div>
        ),
      }),
    ],
    [onOpen]
  );

  const table = useReactTable({
    data: clients,
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
      <div className="w-full md:max-w-[250px]">
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
        title="Are you sure you want to delete the client?"
        description="This action can not be undone. You will have to add the client's details again if you want to work with them in the future"
        confirm={{ label: 'Delete', icon: faTrash }}
        cancel={{ label: 'Cancel' }}
      />
    </div>
  );
};

export default ClientsTable;
