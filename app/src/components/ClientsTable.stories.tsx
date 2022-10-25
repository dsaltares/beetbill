import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import type { Client } from '@server/clients/types';
import ClientsTable from './ClientsTable';
export default {
  title: 'ClientsTable',
  component: ClientsTable,
  argTypes: {
    onDelete: { action: 'edit' },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof ClientsTable>;

const clients: Client[] = [
  {
    id: 'client_1',
    name: 'Client 1',
    number: '1',
    vatNumber: '1',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@company.com',
    country: 'client_country',
    address: 'client_address',
    postCode: 'client_post_code',
    city: 'client_city',
    paymentTerms: 7,
    companyId: 'company_1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'client_2',
    name: 'Client 2',
    number: '2',
    vatNumber: '2',
    firstName: null,
    lastName: null,
    email: 'nikola@company.com',
    country: 'client_country',
    address: 'client_address',
    postCode: 'client_post_code',
    city: 'client_city',
    paymentTerms: 30,
    companyId: 'company_1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'client_3',
    name: 'Client 3',
    number: '3',
    vatNumber: '3',
    firstName: 'Alan',
    lastName: 'Turin',
    email: 'alan@company.com',
    country: 'client_country',
    address: 'client_address',
    postCode: 'client_post_code',
    city: 'client_city',
    paymentTerms: 14,
    companyId: 'company_1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const Template: ComponentStory<typeof ClientsTable> = (args) => (
  <div className="w-full h-full bg-violet-50 items-center justify-center p-10">
    <ClientsTable {...args} clients={clients} />
  </div>
);

export const Default = Template.bind({});
