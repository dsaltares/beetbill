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
});

export default router;

export type AppRouter = typeof router;
