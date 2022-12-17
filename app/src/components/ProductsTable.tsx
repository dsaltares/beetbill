import { useCallback, useMemo } from 'react';
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
import type { Product } from '@server/products/types';
import useDisclosureForId from '@lib/useDisclosureForId';
import Routes from '@lib/routes';
import { formatAmount, formatPercentage } from '@lib/format';
import useSortFromUrl from '@lib/useSortFromUrl';
import useFilterFromUrl from '@lib/useFilterFromUrl';
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
import TextField from './Fields/TextField';
import ConfirmationDialog from './ConfirmationDialog';
import IconButton from './IconButton';
import LinkIconButton from './LinkIconButton';

const columnHelper = createColumnHelper<Product>();

const fuzzyFilter: FilterFn<Product> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

const DefaultSort = { id: 'name', desc: true };

type ProductsTableProps = {
  products: Product[];
  onDelete: (id: string) => void;
};

const ProductsTable = ({ products, onDelete }: ProductsTableProps) => {
  const { isOpen, openFor, onClose, onOpen } = useDisclosureForId();
  const handleDelete = useCallback(() => {
    if (openFor) {
      onDelete(openFor);
    }
  }, [onDelete, openFor]);
  const { sorting, toggleSort } = useSortFromUrl(DefaultSort);
  const [globalFilter, setGlobalFilter] = useFilterFromUrl();
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: () => 'Product name',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('price', {
        header: () => 'Price',
        cell: (info) =>
          formatAmount(info.getValue(), info.row.original.currency),
      }),
      columnHelper.accessor('vat', {
        header: () => 'VAT',
        cell: (info) => formatPercentage(info.getValue()),
      }),
      columnHelper.accessor(
        (row) =>
          row.includesVat ? row.price : row.price! * (1 + row.vat! / 100.0),
        {
          id: 'includingVAT',
          header: () => 'Including VAT',
          cell: (info) =>
            formatAmount(info.getValue(), info.row.original.currency),
        }
      ),
      columnHelper.display({
        id: 'actions',
        cell: (info) => {
          const beingCreated = info.row.original.id.startsWith('new-');
          return (
            <div className="flex gap-4 justify-end">
              <IconButton
                aria-label="Delete"
                color="danger"
                icon={faTrash}
                onClick={() => onOpen(info.row.original.id)}
                disabled={beingCreated}
              />
              <LinkIconButton
                aria-label="Edit"
                color="secondary"
                icon={faPencil}
                href={
                  beingCreated
                    ? Routes.products
                    : Routes.product(info.row.original.id)
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
    data: products,
    columns,
    state: {
      globalFilter,
      sorting,
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
                      onClick={() => toggleSort(header.column.id)}
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
        title="Are you sure you want to delete the product?"
        description="This action can not be undone. You will have to add the product's details again if you want to invoice for it in the future"
        confirm={{ label: 'Delete', icon: faTrash }}
        cancel={{ label: 'Cancel' }}
      />
    </div>
  );
};

export default ProductsTable;
