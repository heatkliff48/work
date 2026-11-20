'use strict';

// Та же логика на клиенте: client/src/utils/clientProductPrice.js
const projectIdOf = (projectId) => {
  if (projectId == null || projectId === '' || Number(projectId) === 0) return null;
  const id = Number(projectId);
  return Number.isFinite(id) ? id : null;
};

const latest = (rows) =>
  rows.reduce((best, row) => (Number(row.id) > Number(best.id) ? row : best));

const matchingRows = (rows, productId, clientId) => {
  const product = Number(productId);
  const client = Number(clientId);
  return (rows || []).filter(
    (row) => Number(row.product_id) === product && Number(row.client_id) === client,
  );
};

// Цена Price, EURO per m2: последняя запись продукта и клиента без проекта.
function resolveBaseClientPrice(rows, { productId, clientId }) {
  const withoutProject = matchingRows(rows, productId, clientId).filter(
    (row) => row.delivery_address_id == null,
  );
  if (!withoutProject.length) return null;
  return Number(latest(withoutProject).price);
}

// Цена с проектом и базовая цена без проекта. Базовая нужна, чтобы из их
// разницы посчитать включённую в цену доставку.
function resolveOrderLinePrices(rows, { productId, clientId, projectId }) {
  const matches = matchingRows(rows, productId, clientId);
  const withoutProject = matches.filter((row) => row.delivery_address_id == null);
  const priceM2 = withoutProject.length ? Number(latest(withoutProject).price) : null;
  const project = projectIdOf(projectId);
  let projectPrice = null;
  if (project != null && priceM2 != null) {
    const withProject = matches.filter(
      (row) => Number(row.delivery_address_id) === project,
    );
    if (withProject.length) projectPrice = Number(latest(withProject).price);
  }
  return { priceM2, projectPrice };
}

module.exports = { resolveBaseClientPrice, resolveOrderLinePrices };
