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
  invoicePreview: (invoiceId: string) => `/invoices/${invoiceId}/preview`,
  signIn: '/api/auth/signin',
  signOut: '/api/auth/signout',
  notFound: '/404',
  privacyPolicy: '/beetbill_privacy_policy.pdf',
  termsAndConditions: '/beetbill_terms_and_conditions.pdf',
  cookiePolicy: '/beetbill_cookie_policy.pdf',
};

export default Routes;
