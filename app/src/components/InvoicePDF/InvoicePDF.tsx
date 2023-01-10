import addDays from 'date-fns/addDays';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import format from 'date-fns/format';
import { formatAmount, formatDate, formatPercentage } from '@lib/format';
import getTitle from '@lib/invoices/getTitle';
import type { Invoice } from '@server/invoices/types';
import calculateTotal from '@lib/invoices/calculateTotal';
import { Table, TableCell, TableHeader, TableRow } from './Table';
import { sizes, fontSizes } from './styles';

type InvoicePDFProps = {
  invoice: Invoice;
};

const InvoicePDF = ({ invoice }: InvoicePDFProps) => {
  const { items, company, client, date, message } = invoice;
  const { total, currency, exclVat } = calculateTotal(items);
  const title = `Invoice ${getTitle(invoice)}`;
  return (
    <Document title={title} data-testid={`${invoice.id}-preview`}>
      <Page
        size="A4"
        wrap
        style={{
          flexDirection: 'column',
          paddingHorizontal: sizes[12],
          paddingTop: sizes[14],
          paddingBottom: sizes[16],
          justifyContent: 'space-between',
          fontSize: fontSizes.base,
          fontFamily: 'Inter',
        }}
      >
        <View style={{ width: '100%', flexDirection: 'column' }}>
          <View style={{ flexDirection: 'column', marginBottom: sizes[6] }}>
            <Text style={{ fontSize: fontSizes.lg, fontWeight: 'bold' }}>
              {title}
            </Text>
            <Text
              style={{ fontSize: fontSizes.sm }}
            >{`Invoice date: ${formatDate(date)}`}</Text>
            <Text style={{ fontSize: fontSizes.sm }}>
              {`Due date: ${formatDate(
                addDays(new Date(date), client.paymentTerms)
              )}`}
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              marginBottom: sizes[8],
              fontSize: fontSizes.sm,
            }}
          >
            <View style={{ flex: 1, marginRight: sizes[4] }}>
              <Text style={{ fontSize: fontSizes.base, fontWeight: 'bold' }}>
                {company.name}
              </Text>
              {company.contactName && <Text>{company.contactName}</Text>}
              {company.address && <Text>{company.address}</Text>}
              {company.city && <Text>{company.city}</Text>}
              {company.postCode && <Text>{company.postCode}</Text>}
              {company.country && <Text>{company.country}</Text>}
              {company.email && <Text>{company.email}</Text>}
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <View>
                <Text style={{ fontSize: fontSizes.base, fontWeight: 'bold' }}>
                  {client.name}
                </Text>
                {client.contactName && <Text>{client.contactName}</Text>}
                {client.address && <Text>{client.address}</Text>}
                {client.city && <Text>{client.city}</Text>}
                {client.postCode && <Text>{client.postCode}</Text>}
                {client.country && <Text>{client.country}</Text>}
                {client.number && (
                  <Text>{`Registration number: ${client.number}`}</Text>
                )}
                {client.vatNumber && (
                  <Text>{`VAT number: ${client.vatNumber}`}</Text>
                )}
              </View>
            </View>
          </View>
          {message && (
            <View
              style={{
                width: '50%',
                marginBottom: sizes[4],
                fontSize: fontSizes.sm,
              }}
            >
              <Text>{message}</Text>
            </View>
          )}
          <View style={{ width: '100%', marginBottom: sizes[4] }}>
            <Table>
              <TableHeader>
                <TableCell weight={0.33}>Product</TableCell>
                <TableCell weight={0.15}>Date</TableCell>
                <TableCell weight={0.12} textAlign="right">
                  Quantity
                </TableCell>
                <TableCell weight={0.15} textAlign="right">
                  Unit price
                </TableCell>
                <TableCell weight={0.1} textAlign="right">
                  VAT
                </TableCell>
                <TableCell weight={0.12} textAlign="right">
                  Total
                </TableCell>
              </TableHeader>
              {items.map(({ id, product, quantity, date }) => (
                <TableRow key={id}>
                  <TableCell weight={0.33}>{product.name}</TableCell>
                  <TableCell weight={0.15}>
                    {format(new Date(date), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell weight={0.12} textAlign="right">
                    {`${quantity} ${product.unit}`}
                  </TableCell>
                  <TableCell weight={0.15} textAlign="right">
                    {formatAmount(
                      product.includesVat
                        ? product.price / (1 + product.vat / 100.0)
                        : product.price,
                      product.currency
                    )}
                  </TableCell>
                  <TableCell weight={0.1} textAlign="right">
                    {formatPercentage(product.vat)}
                  </TableCell>
                  <TableCell weight={0.15} textAlign="right">
                    {formatAmount(
                      (product.includesVat
                        ? product.price
                        : product.price * (1 + product.vat / 100.0)) * quantity,
                      product.currency
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </View>
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'right',
              marginBottom: sizes[8],
            }}
          >
            <Text
              style={{ fontSize: fontSizes.sm }}
            >{`Total excl. VAT: ${formatAmount(exclVat, currency)}`}</Text>
            <Text style={{ fontSize: fontSizes.sm }}>{`VAT: ${formatAmount(
              total - exclVat,
              currency
            )}`}</Text>
            <Text style={{ fontWeight: 'bold' }}>{`Total due: ${formatAmount(
              total,
              currency
            )}`}</Text>
          </View>
          <View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontWeight: 'bold' }}>Payment details:</Text>
              <Text>{` ${company.iban}`}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontWeight: 'bold' }}>Payment terms:</Text>
              <Text>{` ${client.paymentTerms} days`}</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            width: '100%',
            flexDirection: 'column',
            textAlign: 'center',
          }}
        >
          <Text style={{ fontWeight: 'bold' }}>{company.name}</Text>
          <Text style={{ fontSize: fontSizes.sm }}>
            {[company.address, company.postCode, company.city, company.country]
              .filter((part) => !!part)
              .join(' ')}
          </Text>
          <Text
            style={{ fontSize: fontSizes.sm }}
          >{`Company number: ${company.number}`}</Text>
          {company.vatNumber && (
            <Text
              style={{ fontSize: fontSizes.sm }}
            >{`VAT number: ${company.vatNumber}`}</Text>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
