import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import { storeSignature } from '../src/services/signatureService.js';

test('signature capture stores png image', async () => {
  const oneByOnePng =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO8M5f8AAAAASUVORK5CYII=';
  const filePath = await storeSignature({ invoiceId: 'inv-sig-test', base64Png: oneByOnePng });
  assert.equal(fs.existsSync(filePath), true);
});
