import test from 'node:test';
import assert from 'node:assert/strict';
import { diffProduct } from '../src/utils/productSync.js';

test('product sync diff detects critical compliance changes', () => {
  const changes = diffProduct(
    { registrationNumber: 'REG-123', activeIngredient: 'A', concentration: '1%', isActive: true },
    { registrationNumber: 'REG-123', activeIngredient: 'B', concentration: '1%', isActive: false },
  );

  assert.equal(changes.length, 2);
  assert.equal(changes[0].fieldName, 'activeIngredient');
  assert.equal(changes[1].fieldName, 'isActive');
});
