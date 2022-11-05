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
  invoice: (invoiceId: string) => `/invoices/${invoiceId}`,
  signIn: '/api/auth/signin',
  signOut: '/api/auth/signout',
  notFound: '/404',
  privacyPolicy: '/invoicing_privacy_policy.pdf',
  termsAndConditions: '/invoicing_terms_and_conditions.pdf',
  cookiePolicy: '/invoicing_cookie_policy.pdf',
};

export default Routes;
