import getCompany from './company/getCompany';
import updateCompany from './company/updateCompany';
import createClient from './clients/createClient';
import deleteClient from './clients/deleteClient';
import getClient from './clients/getClient';
import getClients from './clients/getClients';
import updateClient from './clients/updateClient';
import createProduct from './products/createProduct';
import deleteProduct from './products/deleteProduct';
import getProduct from './products/getProduct';
import getProducts from './products/getProducts';
import updateProduct from './products/updateProduct';
import getInvoice from './invoices/getInvoice';
import getInvoices from './invoices/getInvoices';
import createInvoice from './invoices/createInvoice';
import updateInvoice from './invoices/updateInvoice';
import deleteInvoice from './invoices/deleteInvoice';
import trpc from './trpc';

const router = trpc.router({
  getProduct,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getClient,
  getClients,
  createClient,
  updateClient,
  deleteClient,
  getCompany,
  updateCompany,
  getInvoice,
  getInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
});

export default router;

export type AppRouter = typeof router;
