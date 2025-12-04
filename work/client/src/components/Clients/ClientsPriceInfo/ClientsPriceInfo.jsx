// ClientsPriceInfo

import React, { useState, useEffect } from 'react';

/**
 * Примерный компонент таблицы:
 * - categoryOptions: список типов клиентов (строки)
 * - clientsProducts: список продуктов, каждый с title, price (base), discont (base %)
 *
 * Поведение:
 * - base row (value === "base") — источник значений.
 * - остальные rows — editable, взаимно вычисляют price/discount относительно base.
 */

const categoryOptions = [
  { value: 'base', label: 'Base' },
  { value: 'constructor_de_gobieno', label: 'Constructor de gobieno' },
  { value: 'promotor', label: 'Promotor' },
  { value: 'constructor', label: 'Constructor' },
  { value: 'arquitecto', label: 'Arquitecto' },
  { value: 'distributor_con_almacen', label: 'Distributor con almacen' },
  { value: 'distributor_sin_almacen', label: 'Distributor sin almacen' },
  { value: 'tienda_de_la_construccion', label: 'Tienda de la construccion' },
  { value: 'equipos_de_construccion', label: 'Equipos de construccion' },
  { value: 'agente', label: 'Agente' },
  { value: 'cliente_privado', label: 'Cliente privado' },
];

// Пример clients_products — подставь реальный список
const initialProducts = [
  { id: 'termeco_10', title: 'TERMECO 10', price: 100.0, discont: 0.0 },
  { id: 'prod_b', title: 'PRODUCT B', price: 250.0, discont: 0.0 },
];

function formatNum(v) {
  return Number.isFinite(v) ? Number(v).toFixed(2) : '0.00';
}

export default function ClientsPriceInfo({
  clientsProducts = initialProducts,
  categories = categoryOptions,
}) {
  // rowsState: { [categoryValue]: { [productId]: { price, discount } } }
  const [rowsState, setRowsState] = useState(() => {
    const state = {};
    // initialize: base uses product values; others copy base (price=basePrice, discount=0)
    const baseRow = {};
    clientsProducts.forEach((p) => {
      baseRow[p.id] = {
        price: Number(p.price || 0),
        discount: Number(p.discont || 0),
      };
    });
    categories.forEach((c) => {
      if (c.value === 'base') state[c.value] = { ...baseRow };
      else {
        // default for others: same price as base, discount computed (here 0)
        const obj = {};
        clientsProducts.forEach((p) => {
          obj[p.id] = {
            price: Number(p.price || 0),
            discount: 0,
          };
        });
        state[c.value] = obj;
      }
    });
    return state;
  });

  // helper: get base values
  const getBase = () => rowsState['base'] || {};

  // When base changes, recalc discounts for other rows based on their current price
  useEffect(() => {
    // nothing on mount: rowsState already initialized
    // This effect will run whenever rowsState.base changes; we need to update non-base rows' discounts
    // To avoid infinite loop, compute only if base changed and differences exist.
    // Simpler approach: whenever base changes, recalc other rows discounts using current prices.
    const base = getBase();
    if (!base) return;

    setRowsState((prev) => {
      const updated = { ...prev };
      const baseKeys = Object.keys(base);
      let changed = false;
      for (const category of categories) {
        if (category.value === 'base') continue;
        const row = { ...(prev[category.value] || {}) };
        for (const pid of baseKeys) {
          const basePrice = Number(base[pid].price || 0);
          const currentPrice = Number(row[pid]?.price ?? 0);
          let newDiscount = 0;
          if (basePrice > 0) {
            newDiscount = Math.max(
              0,
              ((basePrice - currentPrice) / basePrice) * 100
            );
          } else {
            newDiscount = 0;
          }
          newDiscount = Number(newDiscount.toFixed(2));
          if (!row[pid]) row[pid] = { price: currentPrice, discount: newDiscount };
          else if (row[pid].discount !== newDiscount) {
            row[pid] = { ...row[pid], discount: newDiscount };
            changed = true;
          }
        }
        updated[category.value] = row;
      }
      return changed ? updated : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsState['base'] && JSON.stringify(rowsState['base'])]);

  const handlePriceChange = (categoryValue, productId, rawValue) => {
    // parse price; disallow negative
    let newPrice = parseFloat(rawValue);
    if (Number.isNaN(newPrice)) newPrice = 0;
    if (newPrice < 0) newPrice = 0;
    setRowsState((prev) => {
      const next = { ...prev };
      const row = { ...(next[categoryValue] || {}) };
      const entry = { ...(row[productId] || {}) };
      entry.price = Number(newPrice);
      // if editing base -> keep discount as provided or recalc? keep as is (user may set both)
      if (categoryValue === 'base') {
        // allow base discount to remain; update base entry
        row[productId] = { ...entry };
        next[categoryValue] = row;
        return next;
      }
      // For non-base: compute discount from base
      const baseEntry = getBase()[productId] || { price: 0, discount: 0 };
      const basePrice = Number(baseEntry.price || 0);
      let newDiscount = 0;
      if (basePrice > 0) {
        newDiscount = Math.max(0, ((basePrice - newPrice) / basePrice) * 100);
      } else {
        newDiscount = 0;
      }
      newDiscount = Number(newDiscount.toFixed(2));
      entry.discount = newDiscount;
      row[productId] = entry;
      next[categoryValue] = row;
      return next;
    });
  };

  const handleDiscountChange = (categoryValue, productId, rawValue) => {
    // parse discount; disallow negative
    let newDiscount = parseFloat(rawValue);
    if (Number.isNaN(newDiscount)) newDiscount = 0;
    if (newDiscount < 0) newDiscount = 0;
    setRowsState((prev) => {
      const next = { ...prev };
      const row = { ...(next[categoryValue] || {}) };
      const entry = { ...(row[productId] || {}) };
      // if base row: just set discount value
      if (categoryValue === 'base') {
        entry.discount = Number(newDiscount);
        row[productId] = entry;
        next[categoryValue] = row;
        return next;
      }
      // for non-base: compute price from base
      const baseEntry = getBase()[productId] || { price: 0, discount: 0 };
      const basePrice = Number(baseEntry.price || 0);
      let computedPrice = basePrice * (1 - newDiscount / 100);
      if (computedPrice > basePrice) {
        // discount would be negative => clamp to 0
        computedPrice = basePrice;
        newDiscount = 0;
      }
      if (computedPrice < 0) computedPrice = 0;
      entry.price = Number(Number(computedPrice).toFixed(2));
      entry.discount = Number(newDiscount.toFixed(2));
      row[productId] = entry;
      next[categoryValue] = row;
      return next;
    });
  };

  // Render
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 800 }}>
        <thead>
          <tr>
            <th
              style={{
                border: '1px solid #ddd',
                padding: 8,
                background: '#f7f7f7',
                color: 'black',
                width: 200,
                minWidth: 200,
              }}
              rowSpan={2}
            >
              Client Type
            </th>
            {clientsProducts.map((p) => (
              <th
                key={p.id}
                style={{
                  border: '1px solid #ddd',
                  padding: 8,
                  background: '#f1f1f1',
                  textAlign: 'center',
                  color: 'black',
                  width: 100,
                  minWidth: 100,
                }}
                colSpan={2}
              >
                {p.title}
              </th>
            ))}
          </tr>
          <tr>
            {clientsProducts.map((p) => (
              <React.Fragment key={p.id + '_sub'}>
                <th
                  style={{
                    border: '1px solid #ddd',
                    padding: 6,
                    background: '#fafafa',
                    color: 'black',
                  }}
                >
                  EURO
                </th>
                <th
                  style={{
                    border: '1px solid #ddd',
                    padding: 6,
                    background: '#fafafa',
                    color: 'black',
                  }}
                >
                  DISCOUNT %
                </th>
              </React.Fragment>
            ))}
          </tr>
        </thead>

        <tbody>
          {categories.map((c) => {
            const row = rowsState[c.value] || {};
            return (
              <tr key={c.value}>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{c.label}</td>

                {clientsProducts.map((p) => {
                  const cell = row[p.id] || { price: 0, discount: 0 };
                  return (
                    <React.Fragment key={c.value + '_' + p.id}>
                      <td
                        style={{
                          border: '1px solid #ddd',
                          padding: 6,
                          textAlign: 'center',
                          width: 120,
                        }}
                      >
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formatNum(cell?.price ?? 0)}
                          onChange={(e) =>
                            handlePriceChange(c.value, p.id, e.target.value)
                          }
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            padding: '6px',
                          }}
                        />
                      </td>
                      <td
                        style={{
                          border: '1px solid #ddd',
                          padding: 6,
                          textAlign: 'center',
                          width: 120,
                        }}
                      >
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formatNum(cell?.discount ?? 0)}
                          onChange={(e) =>
                            handleDiscountChange(c.value, p.id, e.target.value)
                          }
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            padding: '6px',
                          }}
                        />
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ marginTop: 12, fontSize: 13, color: '#444' }}>
        <strong>Примечание:</strong> редактирование значений в строке <em>Base</em>{' '}
        обновляет эталонные цены. Для остальных строк при вводе цены автоматически
        считается скидка относительно эталонной цены, при вводе скидки автоматически
        пересчитывается цена.
      </div>
    </div>
  );
}
