export function calculateTotals(serviceCost) {
  const cost = Number(serviceCost);
  const hst = Number((cost * 0.13).toFixed(2));
  const total = Number((cost + hst).toFixed(2));
  return { serviceCost: cost, hst, total };
}
