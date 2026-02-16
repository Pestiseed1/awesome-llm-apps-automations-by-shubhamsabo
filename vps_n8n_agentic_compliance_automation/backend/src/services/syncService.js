import { prisma } from '../config/prisma.js';
import { diffProduct } from '../utils/productSync.js';

export async function syncProductsWithRegistry(registryProducts) {
  const alerts = [];

  for (const registryProduct of registryProducts) {
    const current = await prisma.product.findUnique({
      where: { registrationNumber: registryProduct.registrationNumber },
    });

    if (!current) continue;

    const changes = diffProduct(current, registryProduct);
    if (!changes.length) continue;

    await prisma.$transaction([
      prisma.product.update({
        where: { id: current.id },
        data: {
          activeIngredient: registryProduct.activeIngredient,
          concentration: registryProduct.concentration,
          isActive: registryProduct.isActive,
          lastSyncedAt: new Date(),
        },
      }),
      ...changes.map((change) =>
        prisma.productChangeLog.create({
          data: {
            productId: current.id,
            fieldName: change.fieldName,
            oldValue: String(change.oldValue),
            newValue: String(change.newValue),
            reason: 'weekly_registry_sync',
          },
        }),
      ),
    ]);

    const criticalFields = ['registrationNumber', 'activeIngredient', 'isActive'];
    if (changes.some((item) => criticalFields.includes(item.fieldName))) {
      alerts.push({ productName: current.name, changes });
    }
  }

  return alerts;
}
