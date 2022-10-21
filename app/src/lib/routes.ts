const Routes = {
  home: '/',
  company: '/company',
  products: '/products',
  createProduct: '/products/new',
  product: (productId: string) => `/products/${productId}`,
  clients: '/clients',
  createClient: '/clients/new',
  client: (clientId: string) => `/clients/${clientId}`,
  invoices: '/invoices',
  createInvoice: '/invoices/new',
  signIn: '/api/auth/signin',
};

export default Routes;
