import { faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import Routes from '@lib/routes';
import type { Client } from '@server/clients/types';
import useCreateClient from '@lib/clients/useCreateClient';
import useUpdateClient from '@lib/clients/useUpdateClient';
import EmailRegexp from '@lib/emailRegexp';
import TextField from './Fields/TextField';
import FormCard from './FormCard';

type ClientFormValues = {
  name: Client['name'];
  number: Client['number'];
  vatNumber: Client['vatNumber'];
  firstName: Client['firstName'];
  lastName: Client['lastName'];
  email: Client['email'];
  country: Client['country'];
  address: Client['address'];
  postCode: Client['postCode'];
  city: Client['city'];
  paymentTerms: string;
};

type CreateEditClientFormProps = {
  client?: Client;
};

const CreateEditClientForm = ({ client }: CreateEditClientFormProps) => {
  const router = useRouter();
  const handleSuccess = useCallback(
    () => router.push(Routes.clients),
    [router]
  );
  const { mutate: createClient, isLoading: isCreating } = useCreateClient({
    onSuccess: handleSuccess,
  });
  const { mutate: updateClient, isLoading: isUpdating } = useUpdateClient({
    onSuccess: handleSuccess,
  });
  const isLoading = isCreating || isUpdating;
  const defaultValues = {
    ...(client || {}),
    paymentTerms: client?.paymentTerms?.toString() || '7',
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormValues>({
    mode: 'onBlur',
    defaultValues,
  });
  const onSubmit: SubmitHandler<ClientFormValues> = useCallback(
    (values) => {
      const data = {
        ...values,
        paymentTerms: values.paymentTerms
          ? parseInt(values.paymentTerms, 10)
          : 7,
      };
      return !client
        ? createClient(data)
        : updateClient({ id: client.id, ...data });
    },
    [createClient, updateClient, client]
  );

  return (
    <FormCard
      title={client?.name || 'Client details'}
      description="Add the details of your client below"
      onSubmit={handleSubmit(onSubmit)}
      submitButton={{
        label: client ? 'Save client' : 'Add client',
        icon: client ? faCheck : faPlus,
        loading: isLoading,
      }}
      backHref={Routes.clients}
    >
      <TextField
        id="client-name"
        placeholder="Client name..."
        type="text"
        {...register('name', {
          required: true,
        })}
        required
        label="Name"
        error={errors.name && 'Client name is required'}
      />
      <TextField
        id="client-number"
        placeholder="Company registration number..."
        type="text"
        {...register('number', {
          required: true,
        })}
        required
        label="Number"
        error={errors.name && 'Registration number is required'}
      />
      <TextField
        id="client-vat"
        placeholder="VAT number..."
        type="text"
        {...register('vatNumber')}
        label="VAT number"
      />
      <TextField
        id="client-firstName"
        placeholder="Contact first name..."
        type="text"
        {...register('firstName')}
        label="First name"
      />
      <TextField
        id="client-lastName"
        placeholder="Contact last name..."
        type="text"
        {...register('lastName')}
        label="Last name"
      />
      <TextField
        id="client-email"
        placeholder="Contact email..."
        type="text"
        {...register('email', {
          pattern: EmailRegexp,
        })}
        label="Email"
      />
      <TextField
        id="client-country"
        placeholder="Client country..."
        type="text"
        {...register('country')}
        label="Country"
      />
      <TextField
        id="client-address"
        placeholder="Client address..."
        type="text"
        {...register('address')}
        label="Address"
      />
      <TextField
        id="client-postCode"
        placeholder="Client post code..."
        type="text"
        {...register('postCode')}
        label="Post code"
      />
      <TextField
        id="client-city"
        placeholder="Client city..."
        type="text"
        {...register('city')}
        label="City"
      />
      <TextField
        id="client-payment-terms"
        placeholder="Client payment terms..."
        type="number"
        {...register('paymentTerms')}
        label="Payment terms"
        endAdornment="days"
      />
    </FormCard>
  );
};

export default CreateEditClientForm;
