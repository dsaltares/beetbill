import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import type { Product } from '@server/products/types';
import ProductsTable from './ProductsTable';
export default {
  title: 'ProductsTable',
  component: ProductsTable,
  argTypes: {
    onDelete: { action: 'edit' },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof ProductsTable>;

const products: Product[] = [
  {
    id: 'product_1',
    name: 'Product 1',
    includesVat: false,
    price: 10,
    currency: 'GBP',
    vat: 15,
    unit: 'h',
    companyId: 'company_1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'product_2',
    name: 'Product 2',
    includesVat: false,
    price: 17.65,
    currency: 'EUR',
    vat: 9,
    unit: 'h',
    companyId: 'company_1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'product_3',
    name: 'Product 3',
    includesVat: false,
    price: 24.3,
    currency: 'USD',
    vat: 0,
    unit: 'h',
    companyId: 'company_1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const Template: ComponentStory<typeof ProductsTable> = (args) => (
  <div className="w-full h-full bg-violet-50 items-center justify-center p-10">
    <ProductsTable {...args} products={products} />
  </div>
);

export const Default = Template.bind({});
