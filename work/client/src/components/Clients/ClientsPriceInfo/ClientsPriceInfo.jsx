import { useProjectContext } from '#components/contexts/Context.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { updClientPriceInfo } from '#components/redux/actions/clientAction.js';
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';

const categoryOptions = [
  { value: 'base', label: 'Base' },
  {
    value: 'promotor_constructor_de_gobierno',
    label: 'Promotor/Constructor de gobierno',
  },
  { value: 'promotor', label: 'Promotor' },
  { value: 'constructor', label: 'Constructor' },
  { value: 'arquitecto', label: 'Arquitecto' },
  { value: 'distribuidor_con_almacen', label: 'Distribuidor con almacen' },
  { value: 'distribuidor_sin_almacen', label: 'Distribuidor sin almacen' },
  { value: 'tienda_de_la_construccion', label: 'Tienda de la construcción' },
  { value: 'equipo_de_construction', label: 'Equipo de construction' },
  { value: 'agente', label: 'Agente' },
  { value: 'cliente_privado', label: 'Cliente privado' },
  { value: 'constructor_pequeno', label: 'Constructor pequeño' },
  { value: 'almacenista_pequeno', label: 'Almacenista pequeno' },
  {
    value: 'distribuidor_en_nuestra_lista',
    label: 'Distribuidor en nuestra lista',
  },
  {
    value: 'arquitecto_en_nuestra_lista',
    label: 'Arquitecto en nuestra lista',
  },
];

function formatDisplayValue(v) {
  if (v === '' || v === null || v === undefined) return '';
  const num = Number(v);
  if (!Number.isFinite(num)) return '';
  if (num % 1 === 0) {
    return num.toString();
  }
  return num
    .toString()
    .replace(/(\.\d*?[1-9])0+$/, '$1')
    .replace(/\.0+$/, '');
}

function parseInputValue(str) {
  if (str == null || str === '') {
    return '';
  }

  const stringValue = String(str);
  const normalized = stringValue.replace(',', '.');
  const num = parseFloat(normalized);

  return Number.isNaN(num) ? '' : num;
}

function extractProductTitle(description) {
  if (!description) return '';

  const parts = description.split('BAUBLOCK®');
  if (parts.length < 2) return description;

  const afterBaublock = parts[1];

  const medidasIndex = afterBaublock.indexOf('Medidas');

  if (medidasIndex !== -1) {
    return afterBaublock.substring(0, medidasIndex).trim();
  }

  return afterBaublock.trim();
}

function valuesAreEqual(val1, val2) {
  const parsed1 = parseInputValue(val1);
  const parsed2 = parseInputValue(val2);

  if (parsed1 === '' && parsed2 === '') return true;

  return Number(parsed1) === Number(parsed2);
}

function calculatePrice(basePrice, discount) {
  if (basePrice === 0) return 0;
  const price = basePrice * (1 - discount / 100);
  return Math.max(0, Math.round(price));
}

export default function ClientsPriceInfo() {
  const { latestProducts } = useProductsContext();
  const { clientPriceInfo } = useProjectContext();
  const categories = categoryOptions;

  const [clientsProducts, setClientsProducts] = useState([]);
  const [rowsState, setRowsState] = useState({});

  const [initialData, setInitialData] = useState({});

  const [modifiedData, setModifiedData] = useState([]);

  const dispatch = useDispatch();

  const buildClientPriceMap = useCallback(() => {
    if (!clientPriceInfo || !Array.isArray(clientPriceInfo)) return new Map();

    const map = new Map();

    clientPriceInfo.forEach((item) => {
      const key = `${item.client_type}_${item.title}`;
      map.set(key, {
        discount: item.discont || 0,
        title: item.title,
        client_type: item.client_type,
      });
    });

    return map;
  }, [clientPriceInfo]);

  useEffect(() => {
    if (!latestProducts?.length) {
      setClientsProducts([]);
      setRowsState({});
      setInitialData({});
      setModifiedData([]);
      return;
    }

    const transformedProducts = latestProducts.map((el) => ({
      title: extractProductTitle(el.description),
      price: Math.floor(Number(el.price || 0)),
      id: el.id,
      discont: 0,
    }));

    setClientsProducts(transformedProducts);

    const clientPriceMap = buildClientPriceMap();

    const newRowsState = {};
    const baseRow = {};

    transformedProducts.forEach((p) => {
      baseRow[p.id] = {
        price: p.price,
        discount: p.discont,
      };
    });
    newRowsState['base'] = baseRow;

    categories.forEach((c) => {
      if (c.value !== 'base') {
        const obj = {};
        transformedProducts.forEach((p) => {
          const key = `${c.value}_${p.title}`;
          const clientPriceData = clientPriceMap.get(key);

          if (clientPriceData) {
            const discount = Number(clientPriceData.discount) || 0;
            const price = calculatePrice(p.price, discount);

            obj[p.id] = {
              price: formatDisplayValue(price),
              discount: formatDisplayValue(discount),
            };
          } else {
            obj[p.id] = {
              price: '',
              discount: '',
            };
          }
        });
        newRowsState[c.value] = obj;
      }
    });

    setRowsState(newRowsState);

    setInitialData(JSON.parse(JSON.stringify(newRowsState)));
    setModifiedData([]);
  }, [latestProducts, clientPriceInfo, categories, buildClientPriceMap]);

  const getBase = useCallback(() => rowsState['base'] || {}, [rowsState]);

  useEffect(() => {
    const base = getBase();
    if (!base || Object.keys(base).length === 0) return;

    setRowsState((prev) => {
      const updated = { ...prev };
      const baseKeys = Object.keys(base);
      let changed = false;

      for (const category of categories) {
        if (category.value === 'base') continue;
        const row = { ...(prev[category.value] || {}) };

        for (const pid of baseKeys) {
          const basePrice = Number(base[pid]?.price || 0);
          const currentDiscount = parseInputValue(row[pid]?.discount);

          if (currentDiscount !== '' && row[pid]?.price === '') {
            const calculatedPrice = calculatePrice(basePrice, currentDiscount);
            row[pid] = {
              ...row[pid],
              price: formatDisplayValue(calculatedPrice),
            };
            changed = true;
          } else if (currentDiscount !== '') {
            const calculatedPrice = calculatePrice(basePrice, currentDiscount);
            const currentPrice = parseInputValue(row[pid]?.price);

            if (Math.abs(calculatedPrice - currentPrice) > 0.01) {
              row[pid] = {
                ...row[pid],
                price: formatDisplayValue(calculatedPrice),
              };
              changed = true;
            }
          }
        }
        updated[category.value] = row;
      }
      return changed ? updated : prev;
    });
  }, [getBase, categories]);

  useEffect(() => {
    if (Object.keys(initialData).length === 0) return;

    const changes = [];

    // Проверяем все категории
    categories.forEach((category) => {
      const currentData = rowsState[category.value];
      const originalData = initialData[category.value];

      if (!currentData || !originalData) return;

      // Проверяем все продукты в категории
      clientsProducts.forEach((product) => {
        const currentCell = currentData[product.id];
        const originalCell = originalData[product.id];

        if (!currentCell || !originalCell) return;

        // Проверяем, изменились ли price или discount
        const priceChanged = !valuesAreEqual(
          currentCell.price,
          originalCell.price,
        );
        const discountChanged = !valuesAreEqual(
          currentCell.discount,
          originalCell.discount,
        );

        if (priceChanged || discountChanged) {
          const priceValue = parseInputValue(currentCell.price);
          const discountValue = parseInputValue(currentCell.discount);

          changes.push({
            title: product.title,
            client_type: category.value,
            discont: discountValue !== '' ? Number(discountValue) : 0,
          });
        }
      });
    });

    setModifiedData(changes);
  }, [rowsState, initialData, clientsProducts, categories]);

  const handlePriceChange = (categoryValue, productId, inputValue) => {
    const parsedValue = parseInputValue(inputValue);

    setRowsState((prev) => {
      const next = { ...prev };
      const row = { ...(next[categoryValue] || {}) };
      const entry = { ...(row[productId] || {}) };

      entry.price = inputValue;

      if (categoryValue === 'base') {
        const numValue = parsedValue === '' ? 0 : parsedValue;
        entry.price = numValue >= 0 ? numValue : 0;
        row[productId] = entry;
        next[categoryValue] = row;
        return next;
      }

      if (parsedValue === '') {
        entry.discount = '';
      } else {
        const baseEntry = getBase()[productId] || { price: 0 };
        const basePrice = Number(baseEntry.price || 0);
        let newDiscount = 0;

        if (basePrice > 0) {
          newDiscount = Math.max(
            0,
            ((basePrice - parsedValue) / basePrice) * 100,
          );
        }
        entry.discount = formatDisplayValue(newDiscount);
      }

      row[productId] = entry;
      next[categoryValue] = row;
      return next;
    });
  };

  const handleDiscountChange = (categoryValue, productId, inputValue) => {
    const parsedValue = parseInputValue(inputValue);

    setRowsState((prev) => {
      const next = { ...prev };
      const row = { ...(next[categoryValue] || {}) };
      const entry = { ...(row[productId] || {}) };

      entry.discount = inputValue;

      if (categoryValue === 'base') {
        const numValue = parsedValue === '' ? 0 : parsedValue;
        entry.discount = numValue >= 0 ? numValue : 0;
        row[productId] = entry;
        next[categoryValue] = row;
        return next;
      }

      if (parsedValue === '') {
        entry.price = '';
      } else {
        const baseEntry = getBase()[productId] || { price: 0 };
        const basePrice = Number(baseEntry.price || 0);
        const computedPrice = calculatePrice(basePrice, parsedValue);
        entry.price = formatDisplayValue(computedPrice);
      }

      row[productId] = entry;
      next[categoryValue] = row;
      return next;
    });
  };

  useEffect(() => {
    console.log('Modified data:', clientPriceInfo);
  }, [clientPriceInfo]);

  const handleSave = () => {
    if (modifiedData.length === 0) {
      alert('No changes to save!');
      return;
    }

    console.log('Modified data to save:', modifiedData);

    dispatch(updClientPriceInfo(modifiedData));

    setInitialData(JSON.parse(JSON.stringify(rowsState)));
    setModifiedData([]);
  };

  const handleReset = () => {
    if (modifiedData.length === 0) {
      alert('No changes to reset!');
      return;
    }

    if (window.confirm('Are you sure you want to undo all the changes?')) {
      setRowsState(JSON.parse(JSON.stringify(initialData)));
      setModifiedData([]);
    }
  };

  if (clientsProducts.length === 0) {
    return <div>Loading products...</div>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <div
        style={{
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2>Price management for clients</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: modifiedData.length > 0 ? '#ff9800' : '#4CAF50',
              color: 'white',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          >
            Changes: {modifiedData.length}
          </div>
          <button
            onClick={handleReset}
            disabled={modifiedData.length === 0}
            style={{
              padding: '10px 20px',
              backgroundColor:
                modifiedData.length === 0 ? '#cccccc' : '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: modifiedData.length === 0 ? 'not-allowed' : 'pointer',
              fontSize: '16px',
            }}
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={modifiedData.length === 0}
            style={{
              padding: '10px 20px',
              backgroundColor:
                modifiedData.length === 0 ? '#cccccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: modifiedData.length === 0 ? 'not-allowed' : 'pointer',
              fontSize: '16px',
            }}
          >
            Save
          </button>
        </div>
      </div>

      <table
        style={{ borderCollapse: 'collapse', width: '100%', minWidth: 800 }}
      >
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
                    minWidth: 100,
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
                    minWidth: 100,
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
            const isBase = c.value === 'base';

            return (
              <tr key={c.value}>
                <td
                  style={{
                    border: '1px solid #ddd',
                    padding: 8,
                    color: 'black',
                  }}
                >
                  {c.label}
                </td>

                {clientsProducts.map((p) => {
                  const cell = row[p.id] || { price: '', discount: '' };
                  const originalCell = initialData[c.value]?.[p.id] || {
                    price: '',
                    discount: '',
                  };

                  // Проверяем, изменилась ли ячейка
                  const isPriceChanged = !valuesAreEqual(
                    cell.price,
                    originalCell.price,
                  );
                  const isDiscountChanged = !valuesAreEqual(
                    cell.discount,
                    originalCell.discount,
                  );

                  return (
                    <React.Fragment key={c.value + '_' + p.id}>
                      <td
                        style={{
                          border: '1px solid #ddd',
                          padding: 6,
                          textAlign: 'center',
                          width: 120,
                          backgroundColor: isPriceChanged
                            ? '#fff3cd'
                            : 'transparent',
                          position: 'relative',
                        }}
                      >
                        {isPriceChanged && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '2px',
                              right: '2px',
                              width: '8px',
                              height: '8px',
                              backgroundColor: '#ff9800',
                              borderRadius: '50%',
                            }}
                          />
                        )}
                        <input
                          type="text"
                          value={formatDisplayValue(cell.price)}
                          onChange={(e) =>
                            handlePriceChange(c.value, p.id, e.target.value)
                          }
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            padding: '6px',
                            textAlign: 'center',
                            color: 'black',
                            border: isPriceChanged
                              ? '1px solid #ff9800'
                              : '1px solid #ddd',
                          }}
                          placeholder={isBase ? '' : '-'}
                        />
                      </td>
                      <td
                        style={{
                          border: '1px solid #ddd',
                          padding: 6,
                          textAlign: 'center',
                          width: 120,
                          backgroundColor: isDiscountChanged
                            ? '#fff3cd'
                            : 'transparent',
                          position: 'relative',
                        }}
                      >
                        {isDiscountChanged && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '2px',
                              right: '2px',
                              width: '8px',
                              height: '8px',
                              backgroundColor: '#ff9800',
                              borderRadius: '50%',
                            }}
                          />
                        )}
                        <input
                          type="text"
                          value={formatDisplayValue(cell.discount)}
                          onChange={(e) =>
                            handleDiscountChange(c.value, p.id, e.target.value)
                          }
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            padding: '6px',
                            textAlign: 'center',
                            color: 'black',
                            border: isDiscountChanged
                              ? '1px solid #ff9800'
                              : '1px solid #ddd',
                          }}
                          placeholder={isBase ? '' : '-'}
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
        <strong>Note:</strong>
        <ul>
          <li>
            Editing values in the <em>Base</em> row updates the reference prices
          </li>
          <li>
            For other rows, entering a price automatically calculates the
            discount relative to the reference price, and entering a discount
            automatically recalculates the price
          </li>
          <li>
            Data from the database is loaded automatically if records exist
          </li>
          <li>Modified cells are highlighted in yellow with an orange dot</li>
          <li>Only modified records will be saved</li>
        </ul>
      </div>
    </div>
  );
}
