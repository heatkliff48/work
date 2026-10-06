import React, { useMemo, useRef, useState } from 'react';
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
  packageOptionLabel,
  packagingLabel,
  palletHeightCm,
  round2,
} from './packagingUtils.js';
import '../ordersView.css';

// Name of the column on the parent order's product row that tracks how much
// of that line has already been sent out via child ("Liberar") orders.
// Same field name is used across all product types (blocks, dry mixes,
// anchors, tools, related materials) for simplicity.
const QTY_LIBERATED_FIELD = 'quantity_liberated';

// Most one truck may carry, in kg — the same limit the product journals use
// for their pallets-per-truck figure.
const TRUCK_CAPACITY_KG = 24000;

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
  const price_m2_with_agent = Number(orderRow.price_m2_with_agent ?? price_m2);
  const price_m2_with_delivery = Number(orderRow.price_m2_with_delivery) || 0;
  const quantity_m2 = round2(newPalets * m2PerPallet(catalog));

  const final_price_with_delivery =
    (price_m2_with_delivery * quantity_m2 * (100 - discount)) / 100;

  return {
    quantity_m2,
    quantity_real: quantity_m2,
    price_m2,
    price_m3,
    price_m2_with_agent,
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

const enteredQty = (quantities, key) => parseFloat(quantities[key]) || 0;

// Square meters the package lines of a block row ship, leaving `exceptKey`
// out when given.
const shippedM2 = (row, quantities, exceptKey) =>
  row._lines.reduce(
    (acc, line) =>
      line.key === exceptKey
        ? acc
        : acc + enteredQty(quantities, line.key) * line.m2PerPallet,
    0,
  );

// Most pallets one package line can take: whatever area of the parent line
// the row's other package lines have not claimed yet.
const lineMax = (row, line, quantities) => {
  const leftM2 =
    row._available * row._originM2PerPallet -
    shippedM2(row, quantities, line.key);
  return Math.max(0, round2(leftM2 / line.m2PerPallet));
};

// How much of the parent line the entered quantities eat, expressed in the
// PARENT line's own pallets. For blocks every package line is converted
// through square meters, which is what makes shipping another package debit
// the main order by area instead of by pallet count.
const consumedFromParent = (row, quantities) => {
  if (row._type !== 'product') return enteredQty(quantities, row._key);
  const deduction = shippedM2(row, quantities) / row._originM2PerPallet;
  // Guard against rounding pushing the line past what is left, which the
  // server rejects outright.
  return Math.min(round2(deduction), row._available);
};

function LiberarModal({ show, onHide, orderCartData, productLists }) {
  const { list_of_orders } = useOrderContext();
  const { latestProducts, productVersions } = useProductsContext();
  const { latestDryMix, latestAnchors, latestTools, latestRelatedMaterials } =
    useProductsTypeJournalContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  // Line key -> quantity as typed. A block row has one line per package it
  // ships as, every other row is a single line keyed by the row itself.
  const [quantities, setQuantities] = useState({});
  // Row key -> package lines a block row ships as, each { key, productId }.
  // Every line picks one package of the same block and takes its own pallet
  // count, so one parent line can go out in several packages at once. Rows
  // missing here ship as a single line in the parent's own package.
  const [packageLines, setPackageLines] = useState({});
  const lineSeq = useRef(0);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (date) => setSelectedDate(date);

  // Blocks carry the packaging swap and are therefore debited from the parent
  // order by square meters; every other product type keeps the plain
  // pallet/unit accounting and carries no `_lines`.
  const allProducts = useMemo(() => {
    const catalog = latestProducts || [];

    const blocks = (productLists.products || []).map((p) => {
      const _key = getQuantityKey('product', p.id);
      const { origin, variants } = findBlockPackaging(p, catalog, productVersions);
      const lines = (
        packageLines[_key] || [{ key: `${_key}:0`, productId: origin?.id }]
      ).map((line) => {
        const shipped =
          variants.find((c) => c.id === Number(line.productId)) || origin;
        return { key: line.key, shipped, m2PerPallet: m2PerPallet(shipped) };
      });

      const originM2 = m2PerPallet(origin);
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
        _lines: lines,
        _originM2PerPallet: originM2,
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
  }, [productLists, latestProducts, productVersions, packageLines]);

  const rowsByKey = useMemo(
    () => new Map(allProducts.map((row) => [row._key, row])),
    [allProducts],
  );

  // Line key -> why its quantity cannot go into the child order. Package
  // lines of one block row share what is left of the parent line, so typing
  // into one of them changes how much the others may take.
  const errors = useMemo(() => {
    const result = {};
    const check = (key, max) => {
      const value = parseFloat(quantities[key]);
      if (value < 0) result[key] = 'Value cannot be negative';
      else if (value > max) result[key] = `Maximum allowed is ${max}`;
    };

    for (const row of allProducts) {
      if (row._type === 'product') {
        row._lines.forEach((line) =>
          check(line.key, lineMax(row, line, quantities)),
        );
      } else {
        check(row._key, row._max);
      }
    }
    return result;
  }, [allProducts, quantities]);

  // Weight of what the child order ships and the trucks it takes. Catalog
  // weights are per pallet, except tools, which are entered by the unit and
  // weighed by the piece. Lines whose product carries no weight (related
  // materials never do) are counted apart, so the total is not taken for
  // complete.
  const shipment = useMemo(() => {
    const weightSources = {
      drymix: [latestDryMix, 'dry_mixed_id', 'pallet_weight'],
      anchor: [latestAnchors, 'anchor_id', 'pallet_weight'],
      tool: [latestTools, 'tool_id', 'piece_weight'],
    };
    let weightKg = 0;
    let unweighed = 0;
    const add = (qty, unitWeight) => {
      if (qty <= 0) return;
      if (Number(unitWeight) > 0) weightKg += qty * Number(unitWeight);
      else unweighed += 1;
    };

    for (const row of allProducts) {
      if (row._type === 'product') {
        row._lines.forEach((line) =>
          add(enteredQty(quantities, line.key), line.shipped?.weightDef),
        );
      } else {
        const [list, idField, weightField] = weightSources[row._type] || [];
        const catalog = list?.find((c) => c.id === row[idField]);
        add(enteredQty(quantities, row._key), catalog?.[weightField]);
      }
    }

    weightKg = Math.round(weightKg);
    return {
      weightKg,
      trucks: Math.ceil(weightKg / TRUCK_CAPACITY_KG),
      unweighed,
    };
  }, [allProducts, quantities, latestDryMix, latestAnchors, latestTools]);

  // Rewrites the package lines of one block row, starting from the ones it
  // shows right now.
  const updateLines = (row, update) =>
    setPackageLines((prev) => ({
      ...prev,
      [row._key]: update(
        row._lines.map(({ key, shipped }) => ({ key, productId: shipped?.id })),
      ),
    }));

  const handlePackageChange = (row, lineKey, productId) => {
    updateLines(row, (lines) =>
      lines.map((line) => (line.key === lineKey ? { ...line, productId } : line)),
    );
    // The entered amount was in pallets of the previous package, so it no
    // longer means anything once another package is picked.
    setQuantities((prev) => ({ ...prev, [lineKey]: '' }));
  };

  // Adds a line in the first package of the block the row does not ship yet.
  const handleAddPackage = (row) => {
    const used = new Set(row._lines.map((line) => line.shipped?.id));
    const next = row._variants.find((variant) => !used.has(variant.id));
    if (!next) return;

    lineSeq.current += 1;
    const key = `${row._key}:${lineSeq.current}`;
    updateLines(row, (lines) => [...lines, { key, productId: next.id }]);
  };

  const handleRemovePackage = (row, lineKey) => {
    updateLines(row, (lines) => lines.filter((line) => line.key !== lineKey));
    setQuantities((prev) => ({ ...prev, [lineKey]: '' }));
  };

  const handleQuantityChange = (key, value) => {
    setQuantities((prev) => ({ ...prev, [key]: value }));
  };

  const isTotalQuantityFullyLiberated = () => {
    let totalAvailable = 0;
    let totalEntered = 0;

    for (const product of allProducts) {
      if (product._available > 0) {
        totalAvailable += product._available;
        totalEntered += consumedFromParent(product, quantities);
      }
    }

    return totalAvailable > 0 && round2(totalEntered) >= round2(totalAvailable);
  };

  const handleConfirm = () => {
    if (!selectedDate) {
      alert('Please select a date.');
      return;
    }

    const hasErrors = Object.keys(errors).length > 0;
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

    const products = (productLists.products || []).flatMap((p) => {
      const row = rowsByKey.get(getQuantityKey('product', p.id));
      if (!row) return [];
      // Every package line becomes its own line of the child order, shipping
      // `line.shipped`: the parent's product unless another package of the
      // same block was picked for it.
      const lines = row._lines
        .map((line) => {
          const qty = enteredQty(quantities, line.key);
          if (qty <= 0) return null;
          const calc = calcProductFields(p, qty, line.shipped);
          if (!calc) return null;
          return { product_id: line.shipped.id, quantity_palet: qty, ...calc };
        })
        .filter(Boolean);
      if (lines.length > 0) {
        // A single update per parent line: the server adds the amount to
        // what was liberated before, so one update per package would race.
        parentUpdates.push({
          action: getUpdateProductInfoOfOrders,
          payload: buildLiberatedUpdate(p, consumedFromParent(row, quantities)),
        });
      }
      return lines;
    });

    // "Delivery price for m2 full" для дочернего заказа: доставка на m2
    // (price_m2_with_delivery - price_m2_with_agent) одинакова для всех позиций
    // родительского заказа, но кол-во блоков (quantity_m2) в дочернем заказе
    // у каждой позиции может отличаться — поэтому суммируем долю доставки
    // по каждой попавшей в дочерний заказ позиции, а не берём одно значение.
    const deliveryM2Full = round2(
      products.reduce(
        (acc, prod) =>
          acc +
          (Number(prod.price_m2_with_delivery || 0) -
            Number(prod.price_m2_with_agent ?? prod.price_m2 ?? 0)) *
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
      // Цены строк наследуются без вознаграждения — оно применяется по заказу
      agent_commission: orderCartData?.agent_commission ?? 0,
      otros: orderCartData?.otros,
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
      <div className="ord-modal-card ord-modal-card--xl">
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
          <div className="ord-liberar-toprow">
            <div className="ord-field">
              <label className="ord-field__label">Shipping date</label>
              <DatePicker
                className="ord-liberar-date"
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd.MM.yyyy"
              />
            </div>
            <div className="ord-field ord-liberar-trucks">
              <label className="ord-field__label">Trucks needed</label>
              <div className="ord-liberar-trucks__value">
                <span className="ord-liberar-sub">
                  {shipment.weightKg.toLocaleString('es-ES')} kg /{' '}
                  {TRUCK_CAPACITY_KG.toLocaleString('es-ES')} kg per truck
                </span>
                <span className="ord-liberar-trucks__count">
                  {shipment.trucks}
                </span>
              </div>
              {shipment.unweighed > 0 && (
                <div className="ord-liberar-sub">
                  {shipment.unweighed} selected item(s) have no weight and are
                  not counted
                </div>
              )}
            </div>
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
                    // Blocks get one table row per package line; the cells
                    // describing the parent line span all of them.
                    const lines = isBlock ? p._lines : [{ key: p._key }];
                    const span = lines.length;
                    const canSwap = isBlock && p._variants.length > 1;

                    return lines.map((line, i) => {
                      const isLast = i === span - 1;
                      // Package lines of one product read as a group, so only
                      // the last one is ruled off.
                      const lineCell = isLast ? '' : ' ord-liberar-table__cont';
                      const entered = enteredQty(quantities, line.key);
                      const showDeduction = isBlock && entered > 0;
                      const height = isBlock && palletHeightCm(line.shipped);

                      return (
                        <tr key={line.key}>
                          {i === 0 && (
                            <>
                              <td
                                rowSpan={span}
                                className="ord-liberar-table__article"
                              >
                                {p._label}
                              </td>
                              <td rowSpan={span}>{p._desc}</td>
                            </>
                          )}
                          <td className={lineCell}>
                            {canSwap ? (
                              <>
                                <div className="ord-liberar-package">
                                  <select
                                    className="ord-liberar-select"
                                    value={line.shipped?.id ?? ''}
                                    onChange={(e) =>
                                      handlePackageChange(
                                        p,
                                        line.key,
                                        e.target.value,
                                      )
                                    }
                                  >
                                    {p._variants.map((variant) => (
                                      <option
                                        key={variant.id}
                                        value={variant.id}
                                        // One line per package: the same
                                        // package twice would only split it.
                                        disabled={lines.some(
                                          (other) =>
                                            other.key !== line.key &&
                                            other.shipped?.id === variant.id,
                                        )}
                                      >
                                        {packageOptionLabel(variant)}
                                      </option>
                                    ))}
                                  </select>
                                  {i > 0 && (
                                    <button
                                      type="button"
                                      className="ord-iconbtn"
                                      title="Remove package"
                                      onClick={() =>
                                        handleRemovePackage(p, line.key)
                                      }
                                    >
                                      <svg
                                        width="14"
                                        height="14"
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
                                  )}
                                </div>
                                {/* The select is too narrow for the whole
                                    option, so repeat what tells packages apart. */}
                                <div className="ord-liberar-sub">
                                  {[
                                    packagingLabel(line.shipped),
                                    height && `${height} cm`,
                                  ]
                                    .filter(Boolean)
                                    .join(' · ')}
                                </div>
                                {isLast && span < p._variants.length && (
                                  <button
                                    type="button"
                                    className="ord-liberar-add"
                                    onClick={() => handleAddPackage(p)}
                                  >
                                    + Add package
                                  </button>
                                )}
                              </>
                            ) : (
                              <span className="ord-liberar-sub">—</span>
                            )}
                          </td>
                          {i === 0 && (
                            <>
                              <td
                                rowSpan={span}
                                className="ord-liberar-table__num"
                              >
                                {p._quantity}
                                {isBlock && (
                                  <div className="ord-liberar-sub">
                                    {p._quantityM2} m²
                                  </div>
                                )}
                              </td>
                              <td
                                rowSpan={span}
                                className="ord-liberar-table__num"
                              >
                                {p._liberated}
                                {isBlock && (
                                  <div className="ord-liberar-sub">
                                    {p._liberatedM2} m²
                                  </div>
                                )}
                              </td>
                              <td
                                rowSpan={span}
                                className="ord-liberar-table__num"
                              >
                                {p._available}
                                {isBlock && (
                                  <div className="ord-liberar-sub">
                                    {p._availableM2} m²
                                  </div>
                                )}
                              </td>
                            </>
                          )}
                          <td className={`ord-liberar-table__num${lineCell}`}>
                            <input
                              type="number"
                              min="0"
                              max={
                                isBlock
                                  ? lineMax(p, line, quantities)
                                  : p._max
                              }
                              step="1"
                              value={quantities[line.key] ?? ''}
                              onChange={(e) =>
                                handleQuantityChange(line.key, e.target.value)
                              }
                              className="ord-liberar-qty"
                            />
                            {showDeduction && (
                              <div className="ord-liberar-sub">
                                = {round2(entered * line.m2PerPallet)} m² · −
                                {Math.min(
                                  round2(
                                    (entered * line.m2PerPallet) /
                                      p._originM2PerPallet,
                                  ),
                                  p._available,
                                )}{' '}
                                pal from main
                              </div>
                            )}
                            {errors[line.key] && (
                              <div className="ord-liberar-error">
                                {errors[line.key]}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    });
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
