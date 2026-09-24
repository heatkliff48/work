import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getUpdateProductInfoOfOrders } from '#components/redux/actions/ordersAction.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import {
  findBlockPackaging,
  m2PerPallet,
  packagingLabel,
  round2,
} from './packagingUtils.js';
import '../ordersView.css';

// Liberar debits a line by square meters, so quantity_liberated comes out
// fractional whenever a child order shipped the block in another package —
// and with it the pallets still left to ship, quantity_palet minus
// quantity_liberated. Before the order is contracted the manager squares that
// remainder up to whole pallets, optionally moving the line to another package
// of the same block, which often makes it come out whole on its own.
//
// What was already liberated is a fact and stays untouched; the line's total
// quantity_palet is what gets adjusted to fit the whole remainder.
function RoundPalletsModal({ show, onHide, orderCartData, blocks, onConfirm }) {
  const { latestProducts } = useProductsContext();
  const dispatch = useDispatch();
  // Order line id -> catalog id of the package chosen for it.
  const [packages, setPackages] = useState({});
  // Order line id -> remaining pallets as typed. Starts empty for the lines
  // that need fixing, so nothing is silently rounded behind the manager's back.
  const [remainders, setRemainders] = useState({});
  const [loading, setLoading] = useState(false);

  const rows = useMemo(() => {
    return (blocks || []).map((line) => {
      const { origin, variants } = findBlockPackaging(line, latestProducts || []);
      const chosen = variants.find((c) => c.id === Number(packages[line.id])) || origin;

      const ordered = Number(line.quantity_palet) || 0;
      const liberated = Number(line.quantity_liberated) || 0;
      // Normally the catalog says how much area a pallet holds; if the line
      // points at an article the catalog no longer carries, its own totals
      // still do, and anything is better than silently collapsing m2 to 1.
      const originM2PerPallet = origin
        ? m2PerPallet(origin)
        : (ordered && Number(line.quantity_m2) / ordered) || 1;
      const chosenM2PerPallet = chosen ? m2PerPallet(chosen) : originM2PerPallet;
      const remaining = round2(ordered - liberated);
      const remainingM2 = round2(remaining * originM2PerPallet);

      return {
        line,
        origin,
        variants,
        chosen,
        chosenM2PerPallet,
        ordered,
        liberated,
        remaining,
        remainingM2,
        liberatedM2: round2(liberated * originM2PerPallet),
        // The very same amount of product counted in the chosen package. This
        // is the number a swap is meant to produce, so it is offered as a hint.
        equivalent:
          chosenM2PerPallet > 0 ? round2(remainingM2 / chosenM2PerPallet) : 0,
        needsFix: !Number.isInteger(remaining),
      };
    });
  }, [blocks, latestProducts, packages]);

  const remainderValue = (row) =>
    remainders[row.line.id] ?? (row.needsFix ? '' : String(row.remaining));

  const errorFor = (row) => {
    const raw = remainderValue(row);
    if (raw === '') return 'Enter a whole number of pallets';

    const value = Number(raw);
    if (!Number.isFinite(value)) return 'Not a number';
    if (!Number.isInteger(value)) return 'Must be a whole number of pallets';
    if (value <= 0) return 'Must be greater than 0';

    return '';
  };

  const handlePackageChange = (row, catalogId) => {
    setPackages((prev) => ({ ...prev, [row.line.id]: catalogId }));
    // The typed amount was counted in the previous package, so it no longer
    // means anything. Back on the original package the line simply returns to
    // whatever it started as.
    const backToOrigin = Number(catalogId) === row.origin?.id;
    setRemainders((prev) => ({
      ...prev,
      [row.line.id]: backToOrigin && !row.needsFix ? String(row.remaining) : '',
    }));
  };

  const handleRemainderChange = (row, value) =>
    setRemainders((prev) => ({ ...prev, [row.line.id]: value }));

  // Liberated pallets re-expressed in the chosen package — unchanged unless the
  // line was moved to a different one, since the area released stays the same.
  const liberatedInChosen = (row) =>
    row.chosen?.id === row.origin?.id || !row.liberated
      ? row.liberated
      : round2(row.liberatedM2 / row.chosenM2PerPallet);

  // Stored prices are the per-m2 price without delivery, matching how order
  // lines are written everywhere else; the delivery share is layered on top at
  // display time from the order's own delivery_m2.
  const buildUpdate = (row) => {
    const { line, chosen } = row;
    const discount = Number(line.discount) || 0;
    const price_m2 = Number(line.price_m2) || 0;

    const newLiberated = liberatedInChosen(row);
    const quantity_palet = round2(Number(remainderValue(row)) + newLiberated);
    const quantity_m2 = round2(quantity_palet * row.chosenM2PerPallet);

    // The server ADDS quantity_liberated to what it already holds, so pass the
    // delta that re-expresses the released amount in the new package, and null
    // when the package is untouched so the stored value is left alone.
    const quantity_liberated =
      newLiberated === row.liberated ? null : round2(newLiberated - row.liberated);

    return {
      id: line.id,
      order_id: line.order_id,
      // Falls back to the line's own product when the catalog has no entry for
      // it, so a stale article cannot blank out the reference.
      product_id: chosen?.id ?? line.product_id,
      quantity_palet,
      quantity_m2,
      quantity_real: quantity_m2,
      price_m2,
      price_m3: Number(line.price_m3) || 0,
      discount,
      final_price: round2((price_m2 * quantity_m2 * (100 - discount)) / 100),
      warehouse_id: line.warehouse_id ?? null,
      quantity_liberated,
    };
  };

  const blockingError = rows.find((row) => errorFor(row));

  const handleConfirm = () => {
    if (blockingError) return;

    setLoading(true);
    rows
      // Untouched lines that were already whole need no write.
      .filter(
        (row) =>
          row.needsFix ||
          row.chosen?.id !== row.origin?.id ||
          Number(remainderValue(row)) !== row.remaining,
      )
      .forEach((row) => dispatch(getUpdateProductInfoOfOrders(buildUpdate(row))));

    onConfirm();
  };

  if (!show) return null;

  return (
    <div className="ord-modal-root">
      <div className="ord-modal-overlay" onClick={onHide} />
      <div className="ord-modal-card ord-modal-card--lg">
        <div className="ord-modal-head">
          <div>
            <div className="ord-modal-head__title">
              Round pallets before contracting
            </div>
            <div className="ord-modal-head__subtitle">
              order {orderCartData?.article}
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
          <div className="ord-status-warn">
            Liberar leaves these lines with a fractional number of pallets still
            to ship. Set a whole number for each, or move the line to another
            package to keep the same m² on whole pallets.
          </div>

          {rows.length === 0 ? (
            <div className="ord-empty-products">No blocks in this order.</div>
          ) : (
            <table className="ord-liberar-table">
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Description</th>
                  <th>Package</th>
                  <th className="ord-liberar-table__num">Left to ship</th>
                  <th className="ord-liberar-table__num">Whole pallets</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const error = errorFor(row);
                  const typed = Number(remainderValue(row));
                  const newTotal = error
                    ? 0
                    : round2(typed + liberatedInChosen(row));

                  return (
                    <tr key={row.line.id}>
                      <td className="ord-liberar-table__article">
                        {row.chosen?.article || row.line.product_article}
                      </td>
                      <td>{row.line.description}</td>
                      <td>
                        {row.variants.length > 1 ? (
                          <select
                            className="ord-liberar-select"
                            value={row.chosen?.id ?? ''}
                            onChange={(e) =>
                              handlePackageChange(row, e.target.value)
                            }
                          >
                            {row.variants.map((variant) => (
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
                        {row.remaining} pal
                        <div className="ord-liberar-sub">
                          {row.remainingM2} m²
                        </div>
                        <div className="ord-liberar-sub">
                          {row.ordered} ordered − {row.liberated} liberated
                        </div>
                      </td>
                      <td className="ord-liberar-table__num">
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={remainderValue(row)}
                          onChange={(e) =>
                            handleRemainderChange(row, e.target.value)
                          }
                          className="ord-liberar-qty"
                        />
                        <div className="ord-liberar-sub">
                          same m² = {row.equivalent} pal
                        </div>
                        {!error && (
                          <div className="ord-liberar-sub">
                            → order total {newTotal} pal
                          </div>
                        )}
                        {error && (
                          <div className="ord-liberar-error">{error}</div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
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
            disabled={loading || !!blockingError || rows.length === 0}
          >
            {loading ? 'Saving...' : 'Save and change status'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoundPalletsModal;
