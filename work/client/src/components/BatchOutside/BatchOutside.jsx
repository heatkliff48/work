import Table from '#components/Table/Table';
import { TextSearchFilter } from '#components/Table/filters.js';
import { useAutoclaveContext } from '#components/contexts/AutoclaveContext.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '#components/Clients/ClientsInfo/clientsDrawer.css';
import '#components/Styles/table.css';
import './batchOutside.css';

const DATE_COLOR_CLASSES = ['bo-date--green', 'bo-date--amber', 'bo-date--blue', 'bo-date--red'];

function buildGridColumns(rows, latestProducts, cellsPerAutoclave) {
  const productByArticle = new Map((latestProducts || []).map((p) => [p.article, p]));

  const byDate = new Map();
  const order = [];
  rows.forEach((row) => {
    if (!byDate.has(row.date)) {
      byDate.set(row.date, []);
      order.push(row.date);
    }
    byDate.get(row.date).push(row);
  });

  const columns = [];
  order.forEach((date, dateIndex) => {
    const colorClass = DATE_COLOR_CLASSES[dateIndex % DATE_COLOR_CLASSES.length];
    const dateRows = byDate
      .get(date)
      .slice()
      .sort((a, b) => a.position_in_autoclave - b.position_in_autoclave);

    const slots = [];
    dateRows.forEach((row) => {
      for (let i = 0; i < row.quantity_arrays; i++) slots.push(row.product_article);
    });

    for (let i = 0; i < slots.length; i += cellsPerAutoclave) {
      const chunk = slots.slice(i, i + cellsPerAutoclave);
      const cakeRows = [];
      for (let n = 0; n < cellsPerAutoclave; n++) {
        const article = chunk[n];
        const product = article ? productByArticle.get(article) : null;
        cakeRows.push({
          no: n + 1,
          density: product ? product.density : '—',
          width: product ? product.width : '—',
        });
      }
      columns.push({ date, colorClass, cakeRows });
    }
  });

  return columns;
}

const BatchOutside = () => {
  const { latestProducts } = useProductsContext();
  const { CELLS_PER_AUTOCLAVE } = useAutoclaveContext();
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  const user = useSelector((state) => state.user);
  const batchOutside = useSelector((state) => state.batchOutside);

  const navigate = useNavigate();

  const [newBatchOutside, setNewBatchOutside] = useState([]);
  const [mode, setMode] = useState('list');

  const batch_outside_table = [
    {
      Header: 'Product ID',
      accessor: 'product_article',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Quantity, arrays',
      accessor: 'quantity_arrays',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Quantity, pallets',
      accessor: 'quantity_pallets',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Quantity free, pallets',
      accessor: 'quantity_free',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Position in autoclave',
      accessor: 'position_in_autoclave',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Date',
      accessor: 'date',
    },
  ];

  // const batchOutsideHandler = (id) => {
  //   const currBatch = batchOutside.find((el) => el.id === id);
  //   setCurrentBatchId(currBatch.id);
  //   setCurrentBatch(currBatch);
  //   const currOrderedProduction = currBatch?.id_list_of_ordered_production
  //     ? list_of_ordered_production.find(
  //         (el) => el.id === currBatch.id_list_of_ordered_production
  //       )
  //     : latestProducts.find((el) => el.article === currBatch.product_article);

  //   setCurrentOrderedProducts(currOrderedProduction);
  //   setModalShow(true);
  // };

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'production_plan');
      setUserAccess(access);

      if (!access.canRead) {
        navigate('/');
      }
    }
  }, [user, roles]);

  useEffect(() => {
    if (!latestProducts?.length) return;

    const results = batchOutside.map((item) => {
      const product = latestProducts.find((p) => p.article === item.product_article);
      if (!product) {
        return { ...item, quantity_arrays: 0 };
      }

      const m3InArray = Number(product.m3InArray) || 0;
      const volumeBlockOnPallet = Number(product.volumeBlockOnPallet) || 0;

      const palletsPerArray = Math.max(
        1,
        Math.floor(m3InArray / volumeBlockOnPallet) || 1,
      );

      const quantity_arrays = Math.ceil(item.quantity_pallets / palletsPerArray);

      return {
        ...item,
        quantity_arrays,
      };
    });

    setNewBatchOutside(results);
  }, [batchOutside, latestProducts]);

  const totalArrays = useMemo(
    () => newBatchOutside.reduce((sum, row) => sum + (row.quantity_arrays || 0), 0),
    [newBatchOutside],
  );

  const dateCount = useMemo(
    () => new Set(newBatchOutside.map((row) => row.date)).size,
    [newBatchOutside],
  );

  const gridColumns = useMemo(
    () => buildGridColumns(newBatchOutside, latestProducts, CELLS_PER_AUTOCLAVE),
    [newBatchOutside, latestProducts, CELLS_PER_AUTOCLAVE],
  );

  return (
    <div className="cl-page">
      <div className="cl-page__head">
        <div>
          <div className="cl-page__eyebrow">Production · Directory</div>
          <h1 className="cl-page__title">Batch calendar</h1>
        </div>
        <div className="cl-page__stats">
          <div className="cl-stat">
            <div className="cl-stat__num">{totalArrays}</div>
            <div className="cl-stat__label">Arrays scheduled</div>
          </div>
          <div className="cl-stat__divider" />
          <div className="cl-stat">
            <div className="cl-stat__num">{dateCount}</div>
            <div className="cl-stat__label">Production days</div>
          </div>
        </div>
      </div>

      <div className="cl-toolbar">
        <div className="bo-toggle">
          <button
            type="button"
            className={`cl-btn ${mode === 'list' ? 'cl-btn--primary' : 'cl-btn--ghost'}`}
            onClick={() => setMode('list')}
          >
            Список
          </button>
          <button
            type="button"
            className={`cl-btn ${mode === 'grid' ? 'cl-btn--primary' : 'cl-btn--ghost'}`}
            onClick={() => setMode('grid')}
          >
            Вид автоклавов
          </button>
        </div>
        <div className="cl-toolbar__spacer" />
        <div className="bo-caption">
          Автоклав — 21 массив. Плотность и размер — из каталога продукции по Product ID.
        </div>
      </div>

      {mode === 'list' && (
        <div className="bo-fade-in">
          <Table
            COLUMN_DATA={batch_outside_table}
            dataOfTable={newBatchOutside}
            tableName={'Batch calendar'}
            userAccess={userAccess}
            variant="card"
            hideTitle
            emptyTitle="No batches scheduled"
            emptySubtitle="Scheduled production batches will appear here."
            handleRowClick={(row) => {
              // batchOutsideHandler(row.original.id);
            }}
          />
        </div>
      )}

      {mode === 'grid' && (
        <div className="bo-grid bo-fade-in">
          {gridColumns.map((col, colIndex) => (
            <div className="bo-card" key={colIndex}>
              <div className={`bo-card__header ${col.colorClass}`}>{col.date}</div>
              <div className="bo-card__subhead">
                <div>№</div>
                <div>Density</div>
                <div>Size</div>
              </div>
              {col.cakeRows.map((cake) => (
                <div className="bo-card__row" key={cake.no}>
                  <div className="bo-card__row-no">{cake.no}</div>
                  <div className="bo-card__row-val">{cake.density}</div>
                  <div className="bo-card__row-val">{cake.width}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BatchOutside;
