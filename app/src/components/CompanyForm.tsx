import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { type SubmitHandler, useForm } from 'react-hook-form';
import urlRegex from 'url-regex';
import iban from 'iban';
import useUpdateCompany from '@lib/companies/useUpdateCompany';
import type { Company } from '@server/company/types';
import EmailRegexp from '@lib/emailRegexp';
import Button from './Button';
import TextField from './TextField';
import FullScreenCard from './FullscreenCard';

type CompanyFormValues = {
  name: Company['name'];
  number: Company['number'];
  email: Company['email'];
  vatNumber: Company['vatNumber'];
  website: Company['website'];
  country: Company['country'];
  address: Company['address'];
  city: Company['city'];
  postCode: Company['postCode'];
  iban: Company['iban'];
};

type CompanyFormProps = {
  company: Company;
};

const CompanyForm = ({ company }: CompanyFormProps) => {
  const { mutate: updateCompany, isLoading } = useUpdateCompany();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormValues>({ mode: 'onBlur', defaultValues: company });
  const onSubmit: SubmitHandler<CompanyFormValues> = (values) =>
    updateCompany(values);
  return (
    <FullScreenCard>
      <form
        className="flex flex-col w-full gap-16"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold text-zinc-900">
              {company.name || 'Company details'}
            </h1>
            <p className="text-base text-zinc-900">
              Add the details of your company below
            </p>
          </div>
          <div>
            <Button type="submit" endIcon={faCheck} loading={isLoading}>
              Save
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <TextField
            id="company-number"
            placeholder="Registration number..."
            type="text"
            {...register('number', {
              required: true,
            })}
            required
            label="Registration number"
            error={errors.number && 'Registration number is required'}
          />
          <TextField
            id="company-name"
            placeholder="Company name..."
            type="text"
            {...register('name', {
              required: true,
            })}
            required
            label="Company name"
            error={errors.name && 'Company name is required'}
          />
          <TextField
            id="company-vat"
            placeholder="VAT number..."
            type="text"
            {...register('vatNumber')}
            label="VAT number"
          />
          <TextField
            id="company-email"
            placeholder="Email address..."
            type="text"
            {...register('email', {
              pattern: EmailRegexp,
            })}
            label="Email"
            error={errors.email && 'Invalid email'}
          />
          <TextField
            id="company-website"
            placeholder="Company website..."
            type="text"
            {...register('website', {
              pattern: urlRegex(),
            })}
            label="Website"
            error={errors.website && 'Invalid website'}
          />
          <TextField
            id="company-country"
            placeholder="Country..."
            type="text"
            {...register('country')}
            label="Country"
          />
          <TextField
            id="company-address"
            placeholder="Address..."
            type="text"
            {...register('address')}
            label="Address"
          />
          <TextField
            id="company-post-code"
            placeholder="Post code..."
            type="text"
            {...register('postCode')}
            label="Post code"
          />
          <TextField
            id="company-city"
            placeholder="City..."
            type="text"
            {...register('city')}
            label="City"
          />
          <TextField
            id="company-iban"
            placeholder="IBAN..."
            type="text"
            {...register('iban', {
              validate: (value) => !value || iban.isValid(value),
            })}
            label="IBAN"
            error={errors.iban && 'Invalid IBAN'}
          />
        </div>
      </form>
    </FullScreenCard>
  );
};

export default CompanyForm;
