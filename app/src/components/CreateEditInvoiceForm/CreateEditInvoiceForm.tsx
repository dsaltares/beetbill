import startOfDay from 'date-fns/startOfDay';
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import { useRouter } from 'next/router';
import { useCallback, useMemo, forwardRef, useState } from 'react';
import {
  type SubmitHandler,
  type Control,
  type FieldArrayWithId,
  type UseFormRegister,
  useForm,
  Controller,
  useFieldArray,
} from 'react-hook-form';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DraggableAttributes,
  type DragStartEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import {
  faEye,
  faFile,
  faGripVertical,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import useCreateInvoice from '@lib/invoices/useCreateInvoice';
import useUpdateInvoice from '@lib/invoices/useUpdateInvoice';
import Routes from '@lib/routes';
import type { Client } from '@server/clients/types';
import type { Invoice } from '@server/invoices/types';
import type { Company } from '@server/company/types';
import type { Product } from '@server/products/types';
import { safeFormatDate } from '@lib/formatDate';
import getTitle from '@lib/invoices/getTitle';
import FormCard from '@components/FormCard';
import AutocompleteField from '@components/Fields/AutocompleteField';
import TextField from '@components/Fields/TextField';
import InvoiceTotalSection from '@components/InvoiceTotalSection';
import IconButton from '@components/IconButton';
import Button from '@components/Button';
import LinkButton from '@components/LinkButton';
import TextAreaField from '@components/Fields/TextAreaField';
import LineItemsTable, { BodyCell } from './LineItemsTable';

type LineItemFormValue = {
  product: Product;
  date: string;
  quantity: string;
};

type InvoiceFormValues = {
  status: Invoice['status'];
  prefix: Invoice['prefix'];
  date: string;
  message: string;
  client: Invoice['client'];
  items: LineItemFormValue[];
};

type CreateEditInvoiceFormProps = {
  company: Company;
  clients: Client[];
  products: Product[];
  numberByPrefix: { [prefix: string]: number };
  invoice?: Invoice;
};

const getInvoiceNumber = (
  numberByPrefix: { [prefix: string]: number },
  prefix: string
) => {
  const number = numberByPrefix[prefix] || 0;
  return number + 1;
};

const datePickerFormat = (date: Date) => format(date, 'yyyy-MM-dd');

const CreateEditInvoiceForm = ({
  company,
  products,
  clients,
  numberByPrefix,
  invoice,
}: CreateEditInvoiceFormProps) => {
  const router = useRouter();
  const { mutate: createInvoice, isLoading: isCreating } = useCreateInvoice({
    onSuccess: (newInvoice) => router.push(Routes.invoice(newInvoice.id)),
  });
  const { mutate: updateInvoice, isLoading: isUpdating } = useUpdateInvoice();
  const isLoading = isCreating || isUpdating;
  const today = useMemo(() => datePickerFormat(startOfDay(new Date())), []);
  const isSent = invoice?.status !== 'DRAFT';

  const {
    register,
    watch,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    mode: 'onBlur',
    defaultValues: {
      client: invoice?.client,
      status: invoice?.status ?? 'DRAFT',
      prefix: invoice?.prefix ?? '',
      date: invoice?.date ? datePickerFormat(new Date(invoice.date)) : today,
      message: invoice?.message ?? '',
      items: (invoice?.items ?? []).map(({ product, date, quantity }) => ({
        product,
        date: datePickerFormat(new Date(date)),
        quantity: quantity.toString(),
      })),
    },
  });
  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
    move: moveItem,
  } = useFieldArray({
    control,
    name: 'items',
    rules: { minLength: 1 },
  });
  const [watchPrefix, watchDate, watchClient, watchItems] = watch([
    'prefix',
    'date',
    'client',
    'items',
  ]);
  const onSubmit: SubmitHandler<InvoiceFormValues> = useCallback(
    (values) => {
      const data = {
        ...values,
        company,
        clientId: values.client.id,
        date: new Date(values.date).toISOString(),
        items: values.items.map((item) => ({
          productId: item.product.id,
          quantity: parseInt(item.quantity, 10),
          date: new Date(item.date).toISOString(),
        })),
      };
      return !invoice
        ? createInvoice(data)
        : updateInvoice({ ...data, id: invoice.id });
    },
    [createInvoice, updateInvoice, company, invoice]
  );

  const formattedDueDate =
    watchClient &&
    safeFormatDate(
      addDays(new Date(Date.parse(watchDate)), watchClient.paymentTerms)
    );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [dragActiveId, setDragActiveId] = useState<UniqueIdentifier>();
  const draggedItem = useMemo(() => {
    if (!dragActiveId) {
      return;
    }
    const index = itemFields.findIndex((item) => item.id === dragActiveId);
    return {
      item: itemFields[index],
      watchItem: watchItems[index],
      index,
    };
  }, [itemFields, watchItems, dragActiveId]);
  const handleDragStart = useCallback(
    (event: DragStartEvent) => setDragActiveId(event.active.id),
    [setDragActiveId]
  );
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over?.id) {
        const oldIndex = itemFields.findIndex((item) => item.id === active.id);
        const newIndex = itemFields.findIndex((item) => item.id === over.id);
        return moveItem(oldIndex, newIndex);
      }
    },
    [moveItem, itemFields]
  );

  return (
    <FormCard
      title={isSent ? `Invoice ${getTitle(invoice!)}` : 'Invoice details'}
      description={isSent ? '' : 'Add the details of your invoice below'}
      onSubmit={handleSubmit(onSubmit)}
      buttons={
        <>
          {(!invoice || invoice.status === 'DRAFT') && (
            <Button
              type="submit"
              color="secondary"
              variant="outlined"
              endIcon={faFile}
              loading={isLoading}
            >
              Save as draft
            </Button>
          )}
          {invoice && (
            <LinkButton
              href={Routes.invoicePreview(invoice.id)}
              endIcon={faEye}
            >
              Preview
            </LinkButton>
          )}
        </>
      }
      backHref={Routes.invoices}
    >
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <Controller
            control={control}
            name="client"
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <AutocompleteField<Client>
                id="invoice-client"
                placeholder="Client..."
                label="Select client"
                value={value}
                options={clients}
                optionToLabel={clientToLabel}
                optionToKey={clientToKey}
                onChange={onChange}
                required
                error={errors.client && 'Client is required'}
                disabled={isSent}
              />
            )}
          />
          <div className="flex items-end gap-2">
            <TextField
              id="invoice-prefix"
              placeholder="Prefix..."
              type="text"
              {...register('prefix')}
              label="Prefix"
              disabled={isSent}
            />
            <div className="flex justify-center bg-zinc-200 rounded-lg p-2 text-sm text-zinc-900 min-w-[54px]">
              {getInvoiceNumber(numberByPrefix, watchPrefix)}
            </div>
          </div>
          <TextField
            id="invoice-date"
            placeholder="Date..."
            type="date"
            {...register('date', { required: true })}
            label="Date"
            required
            disabled={isSent}
          />
          <div className="flex flex-col gap-2 text-zinc-900 text-sm">
            <span className="font-medium">Due date</span>
            <span className="font-bold py-2">{formattedDueDate || ''}</span>
          </div>
          <TextAreaField
            id="invoice-message"
            placeholder="Message..."
            {...register('message')}
            label="Message"
            disabled={isSent}
          />
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={itemFields}
            strategy={verticalListSortingStrategy}
          >
            <LineItemsTable>
              {itemFields.map((item, index) => (
                <SortableLineItem
                  key={item.id}
                  item={item}
                  index={index}
                  watchItem={watchItems[index]}
                  control={control}
                  register={register}
                  disabled={isSent}
                  onRemove={() => removeItem(index)}
                  products={products}
                />
              ))}
              {!isSent && (
                <tr>
                  <BodyCell />
                  <BodyCell>
                    <div className="min-w-[200px]">
                      <AutocompleteField
                        id="lineitem-add-product"
                        placeholder="Product..."
                        options={products}
                        optionToKey={(product) => product.id}
                        optionToLabel={(product) => product.name}
                        onChange={(product) => {
                          if (product) {
                            appendItem({ product, date: today, quantity: '1' });
                          }
                        }}
                      />
                    </div>
                  </BodyCell>
                  <BodyCell />
                  <BodyCell />
                  <BodyCell />
                  <BodyCell />
                  <BodyCell />
                  <BodyCell />
                </tr>
              )}
            </LineItemsTable>
          </SortableContext>
          <DragOverlay>
            {draggedItem ? (
              <table className="w-full whitespace-nowrap text-left text-base text-zinc-900 border-separate border-spacing-y-0">
                <thead className="text-sm font-medium">
                  <tr>
                    <th />
                    <th />
                    <th />
                    <th />
                    <th />
                    <th />
                    <th />
                    <th />
                  </tr>
                </thead>
                <tbody>
                  <LineItem
                    control={control}
                    index={draggedItem.index}
                    watchItem={draggedItem.watchItem}
                    item={draggedItem.item}
                    products={products}
                    disabled
                  />
                </tbody>
              </table>
            ) : null}
          </DragOverlay>
        </DndContext>
        <div className="grid grid-cols-2 gap-8">
          <div></div>
          <InvoiceTotalSection items={watchItems} />
        </div>
      </div>
    </FormCard>
  );
};

type LineItemProps = {
  item: FieldArrayWithId<InvoiceFormValues, 'items', 'id'>;
  watchItem: LineItemFormValue;
  index: number;
  control: Control<InvoiceFormValues>;
  products: Product[];
  disabled: boolean;
  register?: UseFormRegister<InvoiceFormValues>;
  onRemove?: () => void;
  listeners?: SyntheticListenerMap;
  attributes?: DraggableAttributes;
  style?: {
    transform?: string;
    transition?: string;
  };
};

const SortableLineItem = ({ item, disabled, ...props }: LineItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <LineItem
      ref={setNodeRef}
      item={item}
      {...props}
      attributes={attributes}
      listeners={listeners}
      style={style}
      disabled={disabled || isDragging}
    />
  );
};

const LineItem = forwardRef<HTMLTableRowElement, LineItemProps>(
  (
    {
      item,
      watchItem,
      index,
      control,
      products,
      disabled,
      register,
      onRemove,
      attributes,
      listeners,
      style,
    },
    ref
  ) => (
    <tr ref={ref} className="bg-zinc-50" {...style}>
      <BodyCell>
        <div className="pl-0.5">
          <IconButton
            aria-label="Drag"
            icon={faGripVertical}
            color="secondary"
            variant="borderless"
            size="sm"
            disabled={disabled}
            draggable
            {...attributes}
            {...listeners}
          />
        </div>
      </BodyCell>
      <BodyCell>
        <div className="min-w-[200px]">
          <Controller
            control={control}
            name={`items.${index}.product`}
            render={({ field: { value, onChange } }) => (
              <AutocompleteField
                id={`${item.id}-product`}
                value={value}
                placeholder="Product..."
                options={products}
                optionToKey={(product) => product.id}
                optionToLabel={(product) => product.name}
                onChange={onChange}
                disabled={disabled}
              />
            )}
          />
        </div>
      </BodyCell>
      <BodyCell>
        <TextField
          id={`${item.id}-date`}
          placeholder="Date..."
          type="date"
          {...(register
            ? register(`items.${index}.date`, { required: true })
            : {})}
          required
          defaultValue={watchItem.date}
          disabled={disabled}
        />
      </BodyCell>
      <BodyCell>
        <div className="w-[84px]">
          <TextField
            id={`${item.id}-quantity`}
            placeholder="Quantity..."
            type="number"
            {...(register
              ? register(`items.${index}.quantity`, {
                  required: true,
                })
              : {})}
            required
            defaultValue={watchItem.quantity}
            endAdornment={item.product.unit}
            disabled={disabled}
          />
        </div>
      </BodyCell>
      <BodyCell>{`${item.product.price} ${item.product.currency}`}</BodyCell>
      <BodyCell>{`${item.product.vat}%`}</BodyCell>
      <BodyCell>
        {`${lineItemTotal(item.product, parseInt(watchItem.quantity, 10))} ${
          item.product.currency
        }`}
      </BodyCell>
      <BodyCell>
        <IconButton
          aria-label="Remove"
          icon={faXmark}
          color="secondary"
          variant="borderless"
          size="sm"
          onClick={onRemove}
          disabled={disabled}
        />
      </BodyCell>
    </tr>
  )
);
LineItem.displayName = 'LineItem';

const clientToLabel = (client: Client) => client.name;
const clientToKey = (client: Client) => client.id;
const lineItemTotal = (product: Product, quantity: number) =>
  product.includesVat
    ? product.price * quantity
    : product.price * quantity * (1 + product.vat / 100);

export default CreateEditInvoiceForm;
