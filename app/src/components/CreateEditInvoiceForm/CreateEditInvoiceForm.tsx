import startOfDay from 'date-fns/startOfDay';
import addDays from 'date-fns/addDays';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import {
  type SubmitHandler,
  useForm,
  Controller,
  useFieldArray,
} from 'react-hook-form';
import { faEye, faFile } from '@fortawesome/free-solid-svg-icons';
import useCreateInvoice from '@lib/invoices/useCreateInvoice';
import useUpdateInvoice from '@lib/invoices/useUpdateInvoice';
import Routes from '@lib/routes';
import type { Client } from '@server/clients/types';
import type { Invoice } from '@server/invoices/types';
import type { Company } from '@server/company/types';
import type { Product } from '@server/products/types';
import { datePickerFormat, safeFormatDate } from '@lib/format';
import getTitle from '@lib/invoices/getTitle';
import FormCard from '@components/FormCard';
import AutocompleteField from '@components/Fields/AutocompleteField';
import TextField from '@components/Fields/TextField';
import InvoiceTotalSection from '@components/InvoiceTotalSection';
import Button from '@components/Button';
import LinkButton from '@components/LinkButton';
import TextAreaField from '@components/Fields/TextAreaField';
import LineItemsTable from './LineItemsTable';
import type { InvoiceFormValues } from './InvoiceFormValues';

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
  const isSent = !!invoice?.status && invoice?.status !== 'DRAFT';

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
      message: invoice?.message ?? company.message ?? '',
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
          quantity: parseFloat(item.quantity),
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
        <LineItemsTable
          itemFields={itemFields}
          watchItems={watchItems}
          isSent={isSent}
          control={control}
          register={register}
          moveItem={moveItem}
          removeItem={removeItem}
          appendItem={appendItem}
          products={products}
          defaultDate={watchDate}
        />
        <div className="grid grid-cols-2 gap-8">
          <div></div>
          <InvoiceTotalSection items={watchItems} />
        </div>
      </div>
    </FormCard>
  );
};

const clientToLabel = (client: Client) => client.name;
const clientToKey = (client: Client) => client.id;

export default CreateEditInvoiceForm;
