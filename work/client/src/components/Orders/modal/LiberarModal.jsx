import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addChildOrder } from '#components/redux/actions/ordersAction.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';

const parseNum = (v) => {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};

const round2 = (n) => parseFloat(n.toFixed(2));

function calcProductFields(orderRow, newPalets, catalogProducts) {
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
  const final_price = round2((price_m3 * quantity_m2 * (100 - discount)) / 100);

  return {
    quantity_m2,
    quantity_real,
    price_m2,
    price_m3,
    discount,
    final_price,
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

  const discount = parseFloat(orderRow.discount) || 0;
  const total = round2(newUd);
  const final_price = round2(
    (catalog.price_per_unit * newUd * (100 - discount)) / 100,
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

  const handleDateChange = (date) => setSelectedDate(date);

  const handleQuantityChange = (key, value) => {
    setQuantities((prev) => ({ ...prev, [key]: value }));
  };

  const getQuantityKey = (type, id) => `${type}_${id}`;

  const handleConfirm = () => {
    if (!selectedDate) {
      alert('Please select a date.');
      return;
    }

    const formattedDate = selectedDate.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const products = (productLists.products || [])
      .map((p) => {
        const qty = parseFloat(quantities[getQuantityKey('product', p.id)]);
        if (!qty || qty <= 0) return null;
        const calc = calcProductFields(p, qty, latestProducts || []);
        if (!calc) return null;
        return { product_id: p.product_id, quantity_palet: qty, ...calc };
      })
      .filter(Boolean);

    const dryMixes = (productLists.dryMixes || [])
      .map((p) => {
        const qty = parseFloat(quantities[getQuantityKey('drymix', p.id)]);
        if (!qty || qty <= 0) return null;
        const calc = calcDryMixFields(p, qty, latestDryMix || []);
        if (!calc) return null;
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
        return { anchor_id: p.anchor_id, quantity_palet_anchor: qty, ...calc };
      })
      .filter(Boolean);

    const tools = (productLists.tools || [])
      .map((p) => {
        const qty = parseFloat(quantities[getQuantityKey('tool', p.id)]);
        if (!qty || qty <= 0) return null;
        const calc = calcToolFields(p, qty, latestTools || []);
        if (!calc) return null;
        return { tool_id: p.tool_id, quantity_ud: qty, ...calc };
      })
      .filter(Boolean);

    const relMats = (productLists.related_materials || [])
      .map((p) => {
        const qty = parseFloat(quantities[getQuantityKey('relmat', p.id)]);
        if (!qty || qty <= 0) return null;
        const calc = calcRelMatFields(p, qty, latestRelatedMaterials || []);
        if (!calc) return null;
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

    const payload = {
      article: article,
      owner: orderCartData.owner?.id ?? orderCartData.owner,
      del_adr_id: orderCartData?.deliveryAddress?.id,
      contact_id: orderCartData?.contactInfo?.id,
      secondary_contact: orderCartData?.secondaryContact ?? null,
      person_in_charge: orderCartData?.person_in_charge ?? 0,
      shipping_date: formattedDate,
      main_order: orderCartData.article,
      products,
      dryMixes,
      anchors,
      tools,
      relMats,
    };

    setLoading(true);
    dispatch(addChildOrder(payload));
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
    })),
    ...(productLists.dryMixes || []).map((p) => ({
      ...p,
      _type: 'drymix',
      _key: getQuantityKey('drymix', p.id),
      _label: p.product_article,
      _desc: p.description,
    })),
    ...(productLists.anchors || []).map((p) => ({
      ...p,
      _type: 'anchor',
      _key: getQuantityKey('anchor', p.id),
      _label: p.product_article,
      _desc: p.description,
    })),
    ...(productLists.tools || []).map((p) => ({
      ...p,
      _type: 'tool',
      _key: getQuantityKey('tool', p.id),
      _label: p.product_article,
      _desc: p.description,
    })),
    ...(productLists.related_materials || []).map((p) => ({
      ...p,
      _type: 'relmat',
      _key: getQuantityKey('relmat', p.id),
      _label: p.product_article,
      _desc: p.description,
    })),
  ];

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="liberar-modal-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="liberar-modal-title">
          Liberar — Create Child Order from {orderCartData?.article}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ marginBottom: '20px' }}>
          <p>
            <strong>Shipping Date</strong>
          </p>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd.MM.yyyy"
          />
        </div>

        <div>
          <p>
            <strong>Products (enter quantity in pallets / units)</strong>
          </p>
          {allProducts.length === 0 ? (
            <p style={{ color: '#888' }}>No products in this order.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0' }}>
                  <th style={thStyle}>Article</th>
                  <th style={thStyle}>Description</th>
                  <th style={thStyle}>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {allProducts.map((p) => (
                  <tr key={p._key}>
                    <td style={tdStyle}>{p._label}</td>
                    <td style={tdStyle}>{p._desc}</td>
                    <td style={tdStyle}>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={quantities[p._key] ?? ''}
                        onChange={(e) =>
                          handleQuantityChange(p._key, e.target.value)
                        }
                        style={{ width: '100px' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleConfirm} disabled={loading}>
          {loading ? 'Creating...' : 'Confirm Order'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

const thStyle = {
  padding: '8px 12px',
  textAlign: 'left',
  borderBottom: '2px solid #ddd',
  fontWeight: '600',
};

const tdStyle = {
  padding: '8px 12px',
  borderBottom: '1px solid #eee',
};

export default LiberarModal;
