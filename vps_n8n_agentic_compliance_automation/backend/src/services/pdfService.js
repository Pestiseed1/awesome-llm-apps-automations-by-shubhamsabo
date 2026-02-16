import fs from 'fs';
import path from 'path';

const invoiceDir = '/data/invoices';

export async function generateInvoicePdf(invoice, customer, snapshots) {
  await fs.promises.mkdir(invoiceDir, { recursive: true });
  const filePath = path.join(invoiceDir, `${invoice.id}.pdf`);

  const bodyLines = [
    `Invoice ${invoice.id}`,
    `Customer: ${customer.name}`,
    `Address: ${customer.address}`,
    `Status: ${invoice.status}`,
    ...snapshots.map((item) => `${item.productName} ${item.registrationNumber} ${item.activeIngredient} ${item.concentration}`),
    `Total: ${invoice.total}`,
  ];

  const pseudoPdf = `%PDF-1.1\n1 0 obj<</Type/Catalog>>endobj\n2 0 obj<</Length ${bodyLines.join('\n').length}>>stream\n${bodyLines.join('\n')}\nendstream\nendobj\ntrailer<</Root 1 0 R>>\n%%EOF`;
  await fs.promises.writeFile(filePath, pseudoPdf);
  return filePath;
}
