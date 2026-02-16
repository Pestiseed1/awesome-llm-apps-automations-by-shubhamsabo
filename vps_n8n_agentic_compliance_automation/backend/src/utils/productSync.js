export function diffProduct(currentProduct, registryProduct) {
  const changedFields = [];
  const checks = [
    ['registrationNumber', currentProduct.registrationNumber, registryProduct.registrationNumber],
    ['activeIngredient', currentProduct.activeIngredient, registryProduct.activeIngredient],
    ['concentration', currentProduct.concentration, registryProduct.concentration],
    ['isActive', String(currentProduct.isActive), String(registryProduct.isActive)],
  ];

  for (const [fieldName, oldValue, newValue] of checks) {
    if (oldValue !== newValue) {
      changedFields.push({ fieldName, oldValue, newValue });
    }
  }

  return changedFields;
}
