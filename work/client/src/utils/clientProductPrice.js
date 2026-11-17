// Та же логика на сервере: server/services/clientProductPriceLookup.js
const projectIdOf = (projectId) => {
  if (projectId == null || projectId === '' || Number(projectId) === 0) return null;
  const id = Number(projectId);
  return Number.isFinite(id) ? id : null;
};

const latest = (rows) =>
  rows.reduce((best, row) => (Number(row.id) > Number(best.id) ? row : best));

export function resolveClientProductPrice(rows, { productId, clientId, projectId }) {
  const product = Number(productId);
  const client = Number(clientId);
  const project = projectIdOf(projectId);
  const matches = (rows || []).filter(
    (row) => Number(row.product_id) === product && Number(row.client_id) === client,
  );
  if (!matches.length) return null;

  if (project != null) {
    const withProject = matches.filter(
      (row) => Number(row.delivery_address_id) === project,
    );
    if (withProject.length) {
      return {
        kind: 'price_with_delivery',
        price: Number(latest(withProject).price),
      };
    }
  }

  const withoutProject = matches.filter((row) => row.delivery_address_id == null);
  if (!withoutProject.length) return null;
  return { kind: 'price_m2', price: Number(latest(withoutProject).price) };
}
