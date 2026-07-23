import React, { useState } from 'react';
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
import '../ordersView.css';

const round2 = (n) => parseFloat(n.toFixed(2));

// Name of the column on the parent order's product row that tracks how much
// of that line has already been sent out via child ("Liberar") orders.
// Same field name is used across all product types (blocks, dry mixes,
// anchors, tools, related materials) for simplicity.
const QTY_LIBERATED_FIELD = 'quantity_liberated';

// Builds the payload used to update the parent order's row for a single
// product line, incrementing quantity_liberated by the amount just sent to
// the child order. `row` is the parent-order product record (must carry its
// own `id` and `order_id`), `qty` is the quantity entered in the Liberar
// modal for that line (pallets/units, same unit as the "Quantity" column).
const buildLiberatedUpdate = (row, qty) => {
  const current = Number(row?.[QTY_LIBERATED_FIELD]) || 0;
  return {
    // id: row.id,
    ...row,
    [QTY_LIBERATED_FIELD]: round2(qty),
  };
};

function calcProductFields(
  orderRow,
  newPalets,
  catalogProducts,
  price_m2_with_delivery = 0,
) {
  const catalog = catalogProducts.find((p) => p.id === orderRow.product_id);
  if (!catalog) return null;

  const discount = parseFloat(orderRow.discount) || 0;
  const m2PerPallet =
    catalog.form === 'U-block' ? catalog.m || 1 : catalog.m2 || 1;
  const price_m2 = round2(
    (catalog.price * catalog.volumeBlockOnPallet) / (catalog.m2 || 1),
  );
  const price_m3 = round2(catalog.price * (1 - discount / 100));
  const quantity_m2 = round2(newPalets * m2PerPallet);
  const quantity_real = quantity_m2;

  const final_price_with_delivery =
    (price_m2_with_delivery * quantity_m2 * (100 - discount)) / 100;

  return {
    quantity_m2,
    quantity_real,
    price_m2,
    price_m3,
    price_m2_with_delivery,
    discount,
    final_price: Number(final_price_with_delivery.toFixed(2)),
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

function LiberarModal({ show, onHide, orderCartData, productLists }) {
  const { list_of_orders } = useOrderContext();
  const { latestProducts } = useProductsContext();
  const { latestDryMix, latestAnchors, latestTools, latestRelatedMaterials } =
    useProductsTypeJournalContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleDateChange = (date) => setSelectedDate(date);

  const handleQuantityChange = (key, value) => {
    const product = allProducts.find((p) => p._key === key);
    if (!product) return;

    const numValue = Number(value);
    const maxQuantity = Number(product._quantity) - Number(product._liberated);

    setErrors((prev) => ({ ...prev, [key]: '' }));

    if (value === '') {
      setQuantities((prev) => ({ ...prev, [key]: value }));
      return;
    }

    if (numValue < 0) {
      setQuantities((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: 'Value cannot be negative' }));
      return;
    }

    if (numValue > maxQuantity) {
      setQuantities((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({
        ...prev,
        [key]: `Maximum allowed is ${maxQuantity}`,
      }));
      return;
    }

    setQuantities((prev) => ({ ...prev, [key]: value }));
  };

  const getQuantityKey = (type, id) => `${type}_${id}`;

  const isTotalQuantityFullyLiberated = () => {
    let totalAvailable = 0;
    let totalEntered = 0;

    for (const product of allProducts) {
      const enteredQty = parseFloat(quantities[product._key]) || 0;
      const maxAvailable = product._quantity - product._liberated;

      if (maxAvailable > 0) {
        totalAvailable += maxAvailable;
        totalEntered += enteredQty;
      }
    }

    return totalAvailable > 0 && totalEntered === totalAvailable;
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
        const qty = parseFloat(quantities[getQuantityKey('product', p.id)]);
        if (!qty || qty <= 0) return null;
        const calc = calcProductFields(
          p,
          qty,
          latestProducts || [],
          p.price_m2_with_delivery,
        );
        if (!calc) return null;
        parentUpdates.push({
          action: getUpdateProductInfoOfOrders,
          payload: buildLiberatedUpdate(p, qty),
        });
        return { product_id: p.product_id, quantity_palet: qty, ...calc };
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
    console.log(article, 'article LiberarModal.jsx line 131');
    console.log(orderCartData, 'orderCartData LiberarModal.jsx line 100');
    console.log(products, 'products LiberarModal.jsx line 269');
    console.log(deliveryM2Full, 'deliveryM2Full LiberarModal.jsx line 301');

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
      products,
      dryMixes,
      anchors,
      tools,
      relMats,
    };

    setLoading(true);
    dispatch(addChildOrder(payload));
    console.log(parentUpdates, 'parentUpdates LiberarModal.jsx line 381');
    parentUpdates.forEach(({ action, payload: updatePayload }) =>
      dispatch(action(updatePayload)),
    );
    onHide();
    navigate('/orders');
  };

  const allProducts = [
    ...(productLists.products || []).map((p) => ({
      ...p,
      _type: 'product',
      _key: getQuantityKey('product', p.id),
      _label: p.product_article,
      _desc: p.description,
      _quantity: p.quantity_palet,
      _liberated: Number(p[QTY_LIBERATED_FIELD]) || 0,
    })),
    ...(productLists.dryMixes || []).map((p) => ({
      ...p,
      _type: 'drymix',
      _key: getQuantityKey('drymix', p.id),
      _label: p.product_article,
      _desc: p.description,
      _quantity: p.quantity_palet_dry,
      _liberated: Number(p[QTY_LIBERATED_FIELD]) || 0,
    })),
    ...(productLists.anchors || []).map((p) => ({
      ...p,
      _type: 'anchor',
      _key: getQuantityKey('anchor', p.id),
      _label: p.product_article,
      _desc: p.description,
      _quantity: p.quantity_palet_anchor,
      _liberated: Number(p[QTY_LIBERATED_FIELD]) || 0,
    })),
    ...(productLists.tools || []).map((p) => ({
      ...p,
      _type: 'tool',
      _key: getQuantityKey('tool', p.id),
      _label: p.product_article,
      _desc: p.description,
      _quantity: p.quantity_ud,
      _liberated: Number(p[QTY_LIBERATED_FIELD]) || 0,
    })),
    ...(productLists.related_materials || []).map((p) => ({
      ...p,
      _type: 'relmat',
      _key: getQuantityKey('relmat', p.id),
      _label: p.product_article,
      _desc: p.description,
      _quantity: p.quantity_ud,
      _liberated: Number(p[QTY_LIBERATED_FIELD]) || 0,
    })),
  ];

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
                    <th className="ord-liberar-table__num">
                      Quantity in Main Order
                    </th>
                    <th className="ord-liberar-table__num">Liberated</th>
                    <th className="ord-liberar-table__num">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {allProducts.map((p) => (
                    <tr key={p._key}>
                      <td className="ord-liberar-table__article">{p._label}</td>
                      <td>{p._desc}</td>
                      <td className="ord-liberar-table__num">{p._quantity}</td>
                      <td className="ord-liberar-table__num">{p._liberated}</td>
                      <td className="ord-liberar-table__num">
                        <input
                          type="number"
                          min="0"
                          max={p._quantity}
                          step="1"
                          value={quantities[p._key] ?? ''}
                          onChange={(e) =>
                            handleQuantityChange(p._key, e.target.value)
                          }
                          className="ord-liberar-qty"
                        />
                        {errors[p._key] && (
                          <div className="ord-liberar-error">
                            {errors[p._key]}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
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
