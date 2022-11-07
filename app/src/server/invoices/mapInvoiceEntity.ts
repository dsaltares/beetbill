import type {
  Client,
  ClientState,
  Company,
  CompanyState,
  Invoice,
  LineItem,
  Product,
  ProductState,
} from '@prisma/client';
import mapCompanyEntity from '@server/company/mapCompanyEntity';
import mapClientEntity from '@server/clients/mapClientEntity';
import mapProductEntity from '@server/products/mapProductEntity';
import type { Invoice as APIInvoice } from './types';

type Entity = Invoice & {
  companyState: CompanyState & {
    company: Company;
  };
  clientState: ClientState & {
    client: Client;
  };
  items: (LineItem & {
    productState: ProductState & {
      product: Product;
    };
  })[];
};

const mapInvoiceEntity = ({
  id,
  status,
  prefix,
  number,
  date,
  createdAt,
  updatedAt,
  companyState: { company, ...companyState },
  clientState: { client, ...clientState },
  items,
}: Entity): APIInvoice => ({
  id,
  status,
  prefix,
  number,
  date: date.toISOString(),
  createdAt,
  updatedAt,
  company: mapCompanyEntity({
    ...company,
    states: [companyState],
  }),
  client: mapClientEntity({
    ...client,
    states: [clientState],
  }),
  items: items.map(
    ({
      id,
      invoiceId,
      quantity,
      date,
      createdAt,
      updatedAt,
      productState: { product, ...productState },
    }) => ({
      id,
      invoiceId,
      quantity,
      date: date.toISOString(),
      createdAt,
      updatedAt,
      product: mapProductEntity({
        ...product,
        states: [productState],
      }),
    })
  ),
});

export default mapInvoiceEntity;
