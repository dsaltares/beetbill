const QueryKeys = {
  invoices: ['invoices'],
  invoice: (id: string) => ['invoices', id],
};

export default QueryKeys;
