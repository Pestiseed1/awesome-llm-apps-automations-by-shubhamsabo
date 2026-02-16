import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSlackInvoiceSummary } from '../src/services/slackService.js';

test('slack summary includes required approval buttons', () => {
  const payload = buildSlackInvoiceSummary(
    { id: 'inv_1', jobDate: '2026-01-10', serviceCost: 100, hst: 13, total: 113 },
    { name: 'Jane Doe', address: '123 Main St' },
    [{ productName: 'Delta Dust', registrationNumber: 'REG-123', activeIngredient: 'Deltamethrin', concentration: '0.05%' }],
  );

  const buttons = payload.blocks.at(-1).elements.map((item) => item.text.text);
  assert.deepEqual(buttons, ['Approve', 'Edit', 'Reject']);
});
