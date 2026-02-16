import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import { generateInvoicePdf } from '../src/services/pdfService.js';

test('pdf generator writes invoice file', async () => {
  const filePath = await generateInvoicePdf(
    { id: 'inv-pdf-test', status: 'Approved', total: 113 },
    { name: 'PDF User', address: '123 Main St' },
    [{ productName: 'Prod', registrationNumber: 'REG', activeIngredient: 'A', concentration: '1%' }],
  );
  assert.equal(fs.existsSync(filePath), true);
});
