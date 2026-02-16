import test from 'node:test';
import assert from 'node:assert/strict';
import { buildInvoiceProductSnapshots } from '../src/utils/snapshot.js';

test('invoice snapshot preserves compliance fields', () => {
  const invoiceId = 'inv_1';
  const snapshots = buildInvoiceProductSnapshots(
    [
      {
        id: 'prod_1',
        name: 'Delta Dust',
        registrationNumber: 'REG-123',
        activeIngredient: 'Deltamethrin',
        concentration: '0.05%',
      },
    ],
    invoiceId,
  );

  assert.equal(snapshots[0].invoiceId, invoiceId);
  assert.equal(snapshots[0].registrationNumber, 'REG-123');
  assert.equal(snapshots[0].activeIngredient, 'Deltamethrin');
});
