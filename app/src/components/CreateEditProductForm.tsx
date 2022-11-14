import { faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { type SubmitHandler, useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import useCreateProduct from '@lib/products/useCreateProduct';
import useUpdateProduct from '@lib/products/useUpdateProduct';
import type { Product } from '@server/products/types';
import Routes from '@lib/routes';
import TextField from './Fields/TextField';
import SelectField from './Fields/SelectField';
import Toggle from './Fields/Toggle';
import FormCard from './FormCard';
import Button from './Button';

type ProductFormValues = {
  name: Product['name'];
  includesVat: Product['includesVat'];
  price: string;
  currency: Product['currency'];
  vat: string;
  unit: Product['unit'];
};

type CreateEditProductFormProps = {
  product?: Product;
};

const CreateEditProductForm = ({ product }: CreateEditProductFormProps) => {
  const router = useRouter();
  const handleSuccess = useCallback(
    () => router.push(Routes.products),
    [router]
  );
  const { mutate: createProduct, isLoading: isCreating } = useCreateProduct({
    onSuccess: handleSuccess,
  });
  const { mutate: updateProduct, isLoading: isUpdating } = useUpdateProduct({
    onSuccess: handleSuccess,
  });
  const isLoading = isCreating || isUpdating;
  const defaultValues = {
    includesVat: false,
    unit: 'hours',
    currency: 'EUR',
    ...(product || {}),
    price: product?.price.toString() || '0',
    vat: product?.vat.toString() || '0',
  };
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductFormValues>({
    mode: 'onBlur',
    defaultValues,
  });
  const onSubmit: SubmitHandler<ProductFormValues> = useCallback(
    (values) => {
      const data = {
        ...values,
        price: values.price ? parseFloat(values.price) : 0,
        vat: values.vat ? parseFloat(values.vat) : 0,
      };
      return !product
        ? createProduct(data)
        : updateProduct({ id: product.id, ...data });
    },
    [createProduct, updateProduct, product]
  );

  return (
    <FormCard
      title={product?.name || 'Product details'}
      description="Add the details of your product below"
      onSubmit={handleSubmit(onSubmit)}
      buttons={
        <Button
          type="submit"
          endIcon={product ? faCheck : faPlus}
          loading={isLoading}
        >
          {product ? 'Save product' : 'Add product'}
        </Button>
      }
      backHref={Routes.products}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <TextField
          id="product-name"
          placeholder="Product name..."
          type="text"
          {...register('name', {
            required: true,
          })}
          required
          label="Name"
          error={errors.name && 'Product name is required'}
        />
        <Controller
          control={control}
          name="includesVat"
          defaultValue={defaultValues.includesVat}
          render={({ field: { value, onChange } }) => (
            <Toggle
              id="product-includesVat"
              label="Includes VAT"
              checked={value}
              onChange={onChange}
            />
          )}
        ></Controller>
        <TextField
          id="product-price"
          placeholder="Price..."
          type="number"
          {...register('price')}
          label="Price"
        />
        <Controller
          control={control}
          name="currency"
          defaultValue={defaultValues.currency}
          render={({ field: { value, onChange } }) => (
            <SelectField<string>
              id="product-currency"
              placeholder="Currency..."
              label="Currency"
              value={value}
              options={['EUR', 'GBP', 'USD']}
              optionToLabel={(option) => option}
              optionToKey={(option) => option}
              onChange={onChange}
            />
          )}
        ></Controller>
        <TextField
          id="product-vat"
          placeholder="VAT..."
          type="number"
          {...register('vat')}
          label="VAT"
          endAdornment="%"
        />
        <Controller
          control={control}
          name="unit"
          defaultValue={defaultValues.unit}
          render={({ field: { value, onChange } }) => (
            <SelectField<string>
              id="product-unit"
              placeholder="Unit..."
              label="Unit"
              value={value}
              options={['hours', 'days', 'months', 'units']}
              optionToLabel={(option) => option}
              optionToKey={(option) => option}
              onChange={onChange}
            />
          )}
        ></Controller>
      </div>
    </FormCard>
  );
};

export default CreateEditProductForm;
