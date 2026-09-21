import React, { useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  addChildOrder,
  getUpdateProductInfoOfOrders,
  getUpdateAnchorProductsInfoOfOrder,
  getUpdateDryMixedProductsInfoOfOrder,
  getUpdateRelMatProductsInfoOfOrder,
  getUpdateToolProductsInfoOfOrder,
} from '#components/redux/actions/ordersAction.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';
import {
  findBlockPackaging,
  m2PerPallet,
  packagingLabel,
  round2,
} from './packagingUtils.js';
import '../ordersView.css';

// Name of the column on the parent order's product row that tracks how much
// of that line has already been sent out via child ("Liberar") orders.
// Same field name is used across all product types (blocks, dry mixes,
// anchors, tools, related materials) for simplicity.
const QTY_LIBERATED_FIELD = 'quantity_liberated';

// Builds the payload used to update the parent order's row for a single
// product line, incrementing quantity_liberated by the amount just sent to
// the child order. `row` is the parent-order product record (must carry its
// own `id` and `order_id`), `qty` is the amount taken out of that line in the
// PARENT line's own unit — for blocks that is square meters converted back to
// the parent's pallets, so it can be fractional when the child order ships a
// different package.
const buildLiberatedUpdate = (row, qty) => ({
  // id: row.id,
  ...row,
  [QTY_LIBERATED_FIELD]: round2(qty),
});

// Quantities and prices of one block line of the child order. `newPalets` is
// entered in pallets of `catalog` — the product actually being shipped, which
// may be a different package of the same block than the parent line holds.
// Unit prices are inherited from the parent line, so the client keeps the
// agreed EUR/m2 (delivery included) whichever package goes out.
function calcProductFields(orderRow, newPalets, catalog) {
  if (!catalog) return null;

  const discount = parseFloat(orderRow.discount) || 0;
  const price_m2 = Number(orderRow.price_m2) || 0;
  const price_m3 = Number(orderRow.price_m3) || 0;
  const price_m2_with_delivery = Number(orderRow.price_m2_with_delivery) || 0;
  const quantity_m2 = round2(newPalets * m2PerPallet(catalog));

  const final_price_with_delivery =
    (price_m2_with_delivery * quantity_m2 * (100 - discount)) / 100;

  return {
    quantity_m2,
    quantity_real: quantity_m2,
    price_m2,
    price_m3,
    price_m2_with_delivery,
    discount,
    final_price: round2(final_price_with_delivery),
  };
}

function calcDryMixFields(orderRow, newPalets, catalogDryMix) {
  const catalog = catalogDryMix.find((p) => p.id === orderRow.dry_mixed_id);
  if (!catalog) return null;

  const discount = parseFloat(orderRow.discount) || 0;
  const unitsPerPallet = catalog.units_per_pallet || 1;
  const quantity_ud = round2(newPalets * unitsPerPallet);
  const quantity_real_ud = Math.ceil(newPalets * unitsPerPallet);
  const total = round2(quantity_real_ud);
  const final_price = round2(
    (catalog.price_per_unit * quantity_real_ud * (100 - discount)) / 100,
  );
  const pvp = total > 0 ? round2(final_price / total) : 0;

  return { quantity_ud, quantity_real_ud, total, discount, pvp, final_price };
}

function calcAnchorFields(orderRow, newPalets, catalogAnchors) {
  const catalog = catalogAnchors.find((p) => p.id === orderRow.anchor_id);
  if (!catalog) return null;

  const discount = parseFloat(orderRow.discount) || 0;
  const piecesPerPallet = catalog.pieces_per_unit || 1;
  const quantity_ud = round2(newPalets * piecesPerPallet);
  const quantity_real_ud = Math.ceil(newPalets * piecesPerPallet);
  const total = round2(quantity_real_ud);
  const final_price = round2(
    (catalog.price_per_unit * quantity_real_ud * (100 - discount)) / 100,
  );
  const pvp = total > 0 ? round2(final_price / total) : 0;

  return { quantity_ud, quantity_real_ud, total, discount, pvp, final_price };
}

function calcToolFields(orderRow, newUd, catalogTools) {
  const catalog = catalogTools.find((p) => p.id === orderRow.tool_id);
  if (!catalog) return null;

  const discount = parseFloat(orderRow.discount) || 0;
  const total = round2(newUd);
  const final_price = round2(
    (catalog.price_per_unit * newUd * (100 - discount)) / 100,
  );
  const pvp = newUd > 0 ? round2(final_price / newUd) : 0;

  return { total, discount, pvp, final_price };
}

function calcRelMatFields(orderRow, newUd, catalogRelMats) {
  const catalog = catalogRelMats.find((p) => p.id === orderRow.rel_mat_id);
  if (!catalog) return null;
  const sign = Math.sign(orderRow.final_price) || 1;

  const discount = parseFloat(orderRow.discount) || 0;
  const total = round2(newUd);
  const final_price = round2(
    (sign * (catalog.price_per_unit * newUd * (100 - discount))) / 100,
  );
  const pvp = newUd > 0 ? round2(final_price / newUd) : 0;

  return { total, discount, pvp, final_price };
}

const getQuantityKey = (type, id) => `${type}_${id}`;

function LiberarModal({ show, onHide, orderCartData, productLists }) {
  const { list_of_orders } = useOrderContext();
  const { latestProducts } = useProductsContext();
  const { latestDryMix, latestAnchors, latestTools, latestRelatedMaterials } =
    useProductsTypeJournalContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [quantities, setQuantities] = useState({});
  // Row key -> id of the catalog product to actually ship for that line.
  // Only blocks can be swapped, and only for another package of the same block.
  const [replacements, setReplacements] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleDateChange = (date) => setSelectedDate(date);

  // Blocks carry the packaging swap and are therefore debited from the parent
  // order by square meters; every other product type keeps the plain
  // pallet/unit accounting, so `_shipped` stays empty for them.
  const allProducts = useMemo(() => {
    const catalog = latestProducts || [];

    const blocks = (productLists.products || []).map((p) => {
      const _key = getQuantityKey('product', p.id);
      const { origin, variants } = findBlockPackaging(p, catalog);
      const shipped =
        variants.find((c) => c.id === Number(replacements[_key])) || origin;

      const originM2 = m2PerPallet(origin);
      const shippedM2 = m2PerPallet(shipped);
      const quantity = Number(p.quantity_palet) || 0;
      const liberated = Number(p[QTY_LIBERATED_FIELD]) || 0;
      const availablePalets = round2(quantity - liberated);

      return {
        ...p,
        _type: 'product',
        _key,
        _label: p.product_article,
        _desc: p.description,
        _quantity: quantity,
        _liberated: liberated,
        _available: availablePalets,
        // Square-meter view of the same three numbers, in the parent line's package.
        _quantityM2: round2(quantity * originM2),
        _liberatedM2: round2(liberated * originM2),
        _availableM2: round2(availablePalets * originM2),
        _origin: origin,
        _variants: variants,
        _shipped: shipped,
        _originM2PerPallet: originM2,
        _shippedM2PerPallet: shippedM2,
        // Input is in pallets of whatever package is being shipped.
        _max: shippedM2 > 0 ? round2((availablePalets * originM2) / shippedM2) : 0,
      };
    });

    const simple = (list, type, quantityField) =>
      (list || []).map((p) => {
        const quantity = Number(p[quantityField]) || 0;
        const liberated = Number(p[QTY_LIBERATED_FIELD]) || 0;

        return {
          ...p,
          _type: type,
          _key: getQuantityKey(type, p.id),
          _label: p.product_article,
          _desc: p.description,
          _quantity: quantity,
          _liberated: liberated,
          _available: round2(quantity - liberated),
          _max: round2(quantity - liberated),
        };
      });

    return [
      ...blocks,
      ...simple(productLists.dryMixes, 'drymix', 'quantity_palet_dry'),
      ...simple(productLists.anchors, 'anchor', 'quantity_palet_anchor'),
      ...simple(productLists.tools, 'tool', 'quantity_ud'),
      ...simple(productLists.related_materials, 'relmat', 'quantity_ud'),
    ];
  }, [productLists, latestProducts, replacements]);

  const rowsByKey = useMemo(
    () => new Map(allProducts.map((row) => [row._key, row])),
    [allProducts],
  );

  // How much of the parent line one entered quantity eats, expressed in the
  // PARENT line's own pallets. For blocks the entered pallets are converted
  // through square meters, which is what makes a swap to another package
  // debit the main order by area instead of by pallet count.
  const consumedFromParent = (row, qty) => {
    if (row._type !== 'product') return qty;
    const deduction = (qty * row._shippedM2PerPallet) / row._originM2PerPallet;
    // Guard against rounding pushing the line past what is left, which the
    // server rejects outright.
    return Math.min(round2(deduction), row._available);
  };

  const handleReplacementChange = (key, productId) => {
    setReplacements((prev) => ({ ...prev, [key]: productId }));
    // The entered amount was in pallets of the previous package, so it no
    // longer means anything once another package is picked.
    setQuantities((prev) => ({ ...prev, [key]: '' }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const handleQuantityChange = (key, value) => {
    const product = rowsByKey.get(key);
    if (!product) return;

    const numValue = Number(value);
    const maxQuantity = product._max;

    setErrors((prev) => ({ ...prev, [key]: '' }));
    setQuantities((prev) => ({ ...prev, [key]: value }));

    if (value === '') return;

    if (numValue < 0) {
      setErrors((prev) => ({ ...prev, [key]: 'Value cannot be negative' }));
      return;
    }

    if (numValue > maxQuantity) {
      setErrors((prev) => ({
        ...prev,
        [key]: `Maximum allowed is ${maxQuantity}`,
      }));
    }
  };

  const isTotalQuantityFullyLiberated = () => {
    let totalAvailable = 0;
    let totalEntered = 0;

    for (const product of allProducts) {
      const enteredQty = parseFloat(quantities[product._key]) || 0;

      if (product._available > 0) {
        totalAvailable += product._available;
        totalEntered += consumedFromParent(product, enteredQty);
      }
    }

    return totalAvailable > 0 && round2(totalEntered) >= round2(totalAvailable);
  };

  const handleConfirm = () => {
    if (!selectedDate) {
      alert('Please select a date.');
      return;
    }

    const hasErrors = Object.values(errors).some((error) => error !== '');
    if (hasErrors) {
      alert('Please fix all quantity errors before confirming.');
      return;
    }

    if (isTotalQuantityFullyLiberated()) {
      alert(
        'Cannot create child order: all products are fully liberated. Please leave at least one product with remaining quantity.',
      );
      return;
    }

    const formattedDate = selectedDate.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    // Every dispatch that needs to run against the PARENT order once the
    // child order is confirmed, to bump quantity_liberated on each line
    // that was included below (one entry per product type).
    const parentUpdates = [];

    const products = (productLists.products || [])
      .map((p) => {
        const row = rowsByKey.get(getQuantityKey('product', p.id));
        const qty = parseFloat(quantities[row?._key]);
        if (!row || !qty || qty <= 0) return null;
        const calc = calcProductFields(p, qty, row._shipped);
        if (!calc) return null;
        parentUpdates.push({
          action: getUpdateProductInfoOfOrders,
          payload: buildLiberatedUpdate(p, consumedFromParent(row, qty)),
        });
        // The child order ships `row._shipped`, which is the parent's product
        // unless another package of the same block was picked for this line.
        return { product_id: row._shipped.id, quantity_palet: qty, ...calc };
      })
      .filter(Boolean);

    // "Delivery price for m2 full" для дочернего заказа: доставка на m2
    // (price_m2_with_delivery - price_m2) одинакова для всех позиций
    // родительского заказа, но кол-во блоков (quantity_m2) в дочернем заказе
    // у каждой позиции может отличаться — поэтому суммируем долю доставки
    // по каждой попавшей в дочерний заказ позиции, а не берём одно значение.
    const deliveryM2Full = round2(
      products.reduce(
        (acc, prod) =>
          acc +
          (Number(prod.price_m2_with_delivery || 0) -
            Number(prod.price_m2 || 0)) *
            Number(prod.quantity_m2 || 0),
        0,
      ),
    );

    const dryMixes = (productLists.dryMixes || [])
      .map((p) => {
        const qty = parseFloat(quantities[getQuantityKey('drymix', p.id)]);
        if (!qty || qty <= 0) return null;
        const calc = calcDryMixFields(p, qty, latestDryMix || []);
        if (!calc) return null;
        parentUpdates.push({
          action: getUpdateDryMixedProductsInfoOfOrder,
          payload: buildLiberatedUpdate(p, qty),
        });
        return {
          dry_mixed_id: p.dry_mixed_id,
          quantity_palet_dry: qty,
          ...calc,
        };
      })
      .filter(Boolean);

    const anchors = (productLists.anchors || [])
      .map((p) => {
        const qty = parseFloat(quantities[getQuantityKey('anchor', p.id)]);
        if (!qty || qty <= 0) return null;
        const calc = calcAnchorFields(p, qty, latestAnchors || []);
        if (!calc) return null;
        parentUpdates.push({
          action: getUpdateAnchorProductsInfoOfOrder,
          payload: buildLiberatedUpdate(p, qty),
        });
        return { anchor_id: p.anchor_id, quantity_palet_anchor: qty, ...calc };
      })
      .filter(Boolean);

    const tools = (productLists.tools || [])
      .map((p) => {
        const qty = parseFloat(quantities[getQuantityKey('tool', p.id)]);
        if (!qty || qty <= 0) return null;
        const calc = calcToolFields(p, qty, latestTools || []);
        if (!calc) return null;
        parentUpdates.push({
          action: getUpdateToolProductsInfoOfOrder,
          payload: buildLiberatedUpdate(p, qty),
        });
        return { tool_id: p.tool_id, quantity_ud: qty, ...calc };
      })
      .filter(Boolean);

    const relMats = (productLists.related_materials || [])
      .map((p) => {
        const qty = parseFloat(quantities[getQuantityKey('relmat', p.id)]);
        if (!qty || qty <= 0) return null;
        const calc = calcRelMatFields(p, qty, latestRelatedMaterials || []);
        if (!calc) return null;
        parentUpdates.push({
          action: getUpdateRelMatProductsInfoOfOrder,
          payload: buildLiberatedUpdate(p, qty),
        });
        return { rel_mat_id: p.rel_mat_id, quantity_ud: qty, ...calc };
      })
      .filter(Boolean);

    const totalProducts =
      products.length +
      dryMixes.length +
      anchors.length +
      tools.length +
      relMats.length;

    if (totalProducts === 0) {
      alert('Please enter at least one product quantity.');
      return;
    }

    // const timestamp = Date.now();
    // const article = `CH-${orderCartData.article}-${timestamp}`;
    // const article = `${orderCartData.article}`;
    const getOrderArticle = () => {
      let versionNumber = '0001';
      const year = new Date().getFullYear().toString().slice(-2);
      const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
      const day = new Date().getDate().toString().padStart(2, '0');

      const currentDate = `${day}${month}${year}`;

      const ordersWithSameDate = list_of_orders.filter((order) =>
        order.article?.includes(currentDate),
      );

      if (ordersWithSameDate.length > 0) {
        const lastNumbers = ordersWithSameDate.map((order) => {
          const match = order.article.match(/(\d{8})$/);
          return match ? parseInt(match[1], 10) : 0;
        });

        const maxNumber = Math.max(...lastNumbers);

        versionNumber = `0000000${maxNumber + 1}`.slice(-8);
      } else {
        versionNumber = `00000001`;
      }

      const orderArticle = `Z0000${currentDate}${versionNumber}`;

      return orderArticle;
    };
    const article = getOrderArticle();

    const payload = {
      article: article,
      owner: orderCartData.owner?.id ?? orderCartData.owner,
      del_adr_id: orderCartData?.deliveryAddress?.id,
      contact_id: orderCartData?.contactInfo?.id,
      secondary_contact: orderCartData?.secondaryContact?.client_id ?? null,
      person_in_charge: orderCartData?.person_in_charge ?? 0,
      shipping_date: formattedDate,
      main_order: orderCartData.article,
      delivery_m2: deliveryM2Full,
      region: orderCartData?.region,
      payment_method: orderCartData?.payment_method,
      products,
      dryMixes,
      anchors,
      tools,
      relMats,
    };

    setLoading(true);
    dispatch(addChildOrder(payload));
    parentUpdates.forEach(({ action, payload: updatePayload }) =>
      dispatch(action(updatePayload)),
    );
    onHide();
    navigate('/orders');
  };

  if (!show) return null;

  return (
    <div className="ord-modal-root">
      <div className="ord-modal-overlay" onClick={onHide} />
      <div className="ord-modal-card ord-modal-card--lg">
        <div className="ord-modal-head">
          <div>
            <div className="ord-modal-head__title">
              Liberar — Create child order
            </div>
            <div className="ord-modal-head__subtitle">
              from {orderCartData?.article}
            </div>
          </div>
          <button type="button" className="ord-iconbtn" onClick={onHide}>
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#565d6d"
              strokeWidth="2.1"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6 6 18" />
            </svg>
          </button>
        </div>
        <div className="ord-modal-body">
          <div className="ord-field">
            <label className="ord-field__label">Shipping date</label>
            <DatePicker
              className="ord-liberar-date"
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="dd.MM.yyyy"
            />
          </div>

          <div>
            <div
              className="ord-modal-head__title ord-modal-head__title--sm"
              style={{ marginBottom: 10 }}
            >
              Products (enter quantity in pallets / units)
            </div>
            {allProducts.length === 0 ? (
              <div className="ord-empty-products">
                No products in this order.
              </div>
            ) : (
              <table className="ord-liberar-table">
                <thead>
                  <tr>
                    <th>Article</th>
                    <th>Description</th>
                    <th>Ship as</th>
                    <th className="ord-liberar-table__num">
                      Quantity in Main Order
                    </th>
                    <th className="ord-liberar-table__num">Liberated</th>
                    <th className="ord-liberar-table__num">Available</th>
                    <th className="ord-liberar-table__num">
                      Quantity from Main Order
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allProducts.map((p) => {
                    const isBlock = p._type === 'product';
                    const entered = parseFloat(quantities[p._key]) || 0;
                    const showDeduction = isBlock && entered > 0;
                    const shippedM2 = showDeduction
                      ? round2(entered * p._shippedM2PerPallet)
                      : 0;

                    return (
                      <tr key={p._key}>
                        <td className="ord-liberar-table__article">
                          {p._label}
                        </td>
                        <td>{p._desc}</td>
                        <td>
                          {isBlock && p._variants.length > 1 ? (
                            <select
                              className="ord-liberar-select"
                              value={p._shipped?.id ?? ''}
                              onChange={(e) =>
                                handleReplacementChange(p._key, e.target.value)
                              }
                            >
                              {p._variants.map((variant) => (
                                <option key={variant.id} value={variant.id}>
                                  {variant.article}
                                  {packagingLabel(variant)
                                    ? ` — ${packagingLabel(variant)}`
                                    : ''}
                                  {` (${m2PerPallet(variant)} m²/pal)`}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="ord-liberar-sub">—</span>
                          )}
                        </td>
                        <td className="ord-liberar-table__num">
                          {p._quantity}
                          {isBlock && (
                            <div className="ord-liberar-sub">
                              {p._quantityM2} m²
                            </div>
                          )}
                        </td>
                        <td className="ord-liberar-table__num">
                          {p._liberated}
                          {isBlock && (
                            <div className="ord-liberar-sub">
                              {p._liberatedM2} m²
                            </div>
                          )}
                        </td>
                        <td className="ord-liberar-table__num">
                          {p._available}
                          {isBlock && (
                            <div className="ord-liberar-sub">
                              {p._availableM2} m²
                            </div>
                          )}
                        </td>
                        <td className="ord-liberar-table__num">
                          <input
                            type="number"
                            min="0"
                            max={p._max}
                            step="1"
                            value={quantities[p._key] ?? ''}
                            onChange={(e) =>
                              handleQuantityChange(p._key, e.target.value)
                            }
                            className="ord-liberar-qty"
                          />
                          {showDeduction && (
                            <div className="ord-liberar-sub">
                              = {shippedM2} m² · −{consumedFromParent(p, entered)}{' '}
                              pal from main
                            </div>
                          )}
                          {errors[p._key] && (
                            <div className="ord-liberar-error">
                              {errors[p._key]}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="ord-modal-foot">
          <button
            type="button"
            className="ord-btn ord-btn--ghost"
            onClick={onHide}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="ord-btn ord-btn--primary"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Confirm Order'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LiberarModal;
