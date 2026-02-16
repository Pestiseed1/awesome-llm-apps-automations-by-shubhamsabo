import { syncProductsWithRegistry } from '../services/syncService.js';

export async function syncProducts(req, res) {
  try {
    const registryProducts = req.body.registryProducts || [];
    const alerts = await syncProductsWithRegistry(registryProducts);
    return res.json({ ok: true, alertsCount: alerts.length, alerts });
  } catch (error) {
    console.error('Product sync failed', error);
    return res.status(503).json({ ok: false, error: 'Registry unavailable' });
  }
}
