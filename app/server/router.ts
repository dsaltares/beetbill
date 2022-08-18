import createCustomer from './customers/createCustomer';
import deleteCustomer from './customers/deleteCustomer';
import getCustomers from './customers/getCustomers';
import updateCustomer from './customers/updateCustomer';
import createProduct from './products/createProduct';
import deleteProduct from './products/deleteProduct';
import getProducts from './products/getProducts';
import updateProduct from './products/updateProduct';
import trpc from './trpc';

const router = trpc.router({
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
});

export default router;

export type AppRouter = typeof router;
