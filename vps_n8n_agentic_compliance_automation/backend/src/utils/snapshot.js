export function buildInvoiceProductSnapshots(products, invoiceId) {
  return products.map((product) => ({
    invoiceId,
    productId: product.id,
    productName: product.name,
    registrationNumber: product.registrationNumber,
    activeIngredient: product.activeIngredient,
    concentration: product.concentration,
  }));
}
