import Link from 'next/link';
import { useRouter } from 'next/router';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import useCreateProduct from '@lib/products/useCreateProduct';

type NewProductFormInputs = {
  name: string;
  includesVat: boolean;
  price: string;
  currency: string;
  vat: string;
  unit: string;
};

const NewProductPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewProductFormInputs>({
    defaultValues: {
      includesVat: true,
      currency: 'EUR',
      price: '0.0',
      vat: '0.0',
      unit: 'h',
    },
  });
  const { mutate: createProduct } = useCreateProduct();
  const onSubmit: SubmitHandler<NewProductFormInputs> = (inputs) => {
    createProduct({
      ...inputs,
      price: parseFloat(inputs.price),
      vat: parseFloat(inputs.vat),
    });
    void router.push('/products');
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            aria-invalid={errors.name ? 'true' : 'false'}
            {...register('name', { required: true })}
          />
          {errors.name && <span role="alert">This is required</span>}
        </div>

        <div>
          <label htmlFor="includesVat">Includes VAT</label>
          <input
            id="includesVat"
            type="checkbox"
            {...register('includesVat', { required: true })}
          />
        </div>

        <div>
          <label htmlFor="price">Price</label>
          <input
            id="price"
            type="number"
            {...register('price', { required: true })}
          />
          {errors.price && <span role="alert">This is required</span>}
        </div>

        <div>
          <label htmlFor="currency">Currency</label>
          <select id="currency" {...register('currency')}>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="USD">USD</option>
          </select>
          {errors.currency && <span role="alert">This is required</span>}
        </div>

        <div>
          <label htmlFor="vat">VAT</label>
          <input
            id="vat"
            type="number"
            {...register('vat', { required: true })}
          />
          {errors.vat && <span role="alert">This is required</span>}
        </div>

        <div>
          <label htmlFor="unit">Unit</label>
          <input
            id="unit"
            type="text"
            {...register('unit', { required: true })}
          />
          {errors.unit && <span role="alert">This is required</span>}
        </div>

        <div className="flex gap-3">
          <Link href="/products">
            <a>Cancel</a>
          </Link>
          <input type="submit" value="Create" />
        </div>
      </div>
    </form>
  );
};

export default NewProductPage;
