import Table from '#components/Table/Table';
import { TextSearchFilter } from '#components/Table/filters.js';
import { useAutoclaveContext } from '#components/contexts/AutoclaveContext.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { format, getISOWeek, parseISO } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getLotesList } from '#components/redux/actions/lotesListAction.js';
import { getProducedAutoclaveCountForDate } from '#components/ProductionBatchDesigner/autoclaveScheduleUtils.js';
import '#components/Clients/ClientsInfo/clientsDrawer.css';
import '#components/Styles/table.css';
import './batchOutside.css';

const DATE_COLOR_CLASSES = [
  'bo-date--green',
  'bo-date--amber',
  'bo-date--blue',
  'bo-date--red',
];

// Same pattern RawMatConsumptionModalUPD uses to derive lotes_list "product" from a product description
const LOTES_PRODUCT_NAME_REGEX = /BAUBLOCK®\s+([^ ]+(?:\s+[^ ]+)?\s+\d*\.?\d+)/;

function buildGridColumns(
  rows,
  latestProducts,
  cellsPerAutoclave,
  autoclaveCalendar
) {
  const productByArticle = new Map(
    (latestProducts || []).map((p) => [p.article, p])
  );

  const byDate = new Map();
  rows.forEach((row) => {
    const rowDate = String(row.date).slice(0, 10);
    if (!byDate.has(rowDate)) byDate.set(rowDate, []);
    byDate.get(rowDate).push(row);
  });

  const scheduledByDate = new Map(
    (autoclaveCalendar || []).map((el) => [
      String(el.date).slice(0, 10),
      Number(el.scheduled_autoclaves) || 0,
    ])
  );

  const order = Array.from(
    new Set([...byDate.keys(), ...scheduledByDate.keys()])
  ).sort((a, b) => String(a).localeCompare(String(b)));

  const today = format(new Date(), 'yyyy-MM-dd');
  const columns = [];
  order.forEach((date, dateIndex) => {
    const colorClass = DATE_COLOR_CLASSES[dateIndex % DATE_COLOR_CLASSES.length];
    const dateRows = byDate.get(date) || [];

    // Produced cakes go in first: they physically went through the autoclaves
    // before anything that is still only planned for the same date.
    const slots = [];
    dateRows
      .filter((row) => row.isProduced)
      .forEach((row) => {
        for (let i = 0; i < row.quantity_arrays; i++) {
          slots.push({ article: row.product_article, produced: true });
        }
      });
    dateRows
      .filter((row) => !row.isProduced)
      .sort((a, b) => a.position_in_autoclave - b.position_in_autoclave)
      .forEach((row) => {
        for (let i = 0; i < row.quantity_arrays; i++) {
          slots.push({ article: row.product_article, produced: false });
        }
      });

    const weekNumber = date ? getISOWeek(parseISO(date)) : null;
    const isPast = date < today;

    let plannedCount = 0;
    let producedCount = 0;
    for (let i = 0; i < slots.length; i += cellsPerAutoclave) {
      const chunk = slots.slice(i, i + cellsPerAutoclave);
      // An autoclave is only locked once every cake in it has been cast; a
      // half-cast one still carries planned cakes and stays editable.
      const isProduced = chunk.every((slot) => slot.produced);
      const cakeRows = [];
      for (let n = 0; n < cellsPerAutoclave; n++) {
        const article = chunk[n]?.article;
        const product = article ? productByArticle.get(article) : null;
        cakeRows.push({
          no: n + 1,
          density: product ? product.density : '—',
          width: product ? product.width : '—',
        });
      }
      columns.push({
        date,
        weekNumber,
        colorClass,
        cakeRows,
        isEmpty: false,
        isProduced,
        isPast,
      });
      if (isProduced) producedCount += 1;
      else plannedCount += 1;
    }

    // No planning slots in the past: an autoclave scheduled on a gone-by date can't be filled anymore
    const scheduled = isPast ? 0 : scheduledByDate.get(date) || 0;
    // lotes_list may not have arrived yet, so fall back to the calendar's own
    // count of produced autoclaves — otherwise a produced one would show up as a
    // free slot for as long as the fetch takes.
    const produced = Math.max(
      producedCount,
      getProducedAutoclaveCountForDate(autoclaveCalendar, date, cellsPerAutoclave)
    );
    const emptyCount = Math.max(0, scheduled - plannedCount - produced);
    for (let e = 0; e < emptyCount; e++) {
      columns.push({
        date,
        weekNumber,
        colorClass,
        cakeRows: [],
        isEmpty: true,
        isProduced: false,
        isPast,
      });
    }
  });

  return columns;
}

const BatchOutside = () => {
  const { latestProducts } = useProductsContext();
  const { CELLS_PER_AUTOCLAVE } = useAutoclaveContext();
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();
  const { autoclave_calendar } = useWarehouseContext();

  const user = useSelector((state) => state.user);
  const batchOutside = useSelector((state) => state.batchOutside);
  const lotesListBatches = useSelector((state) => state.lotesListBatches);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [newBatchOutside, setNewBatchOutside] = useState([]);
  const [mode, setMode] = useState('grid');
  const [showPast, setShowPast] = useState(false);

  const gridRef = useRef(null);
  const firstCurrentCardRef = useRef(null);

  const batch_outside_table = [
    {
      Header: 'Product ID',
      accessor: 'product_article',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Cakes, qty',
      accessor: 'quantity_arrays',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Pallets, qty',
      accessor: 'quantity_pallets',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Free pallets, qty',
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
        Math.floor(m3InArray / volumeBlockOnPallet) || 1
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
    [newBatchOutside]
  );

  const dateCount = useMemo(
    () => new Set(newBatchOutside.map((row) => row.date)).size,
    [newBatchOutside]
  );

  // Produced autoclaves are rebuilt from lotes_list, so the grid needs it loaded
  // up front, not only once past days are toggled on.
  useEffect(() => {
    if (!Array.isArray(lotesListBatches) || !lotesListBatches.length) {
      dispatch(getLotesList());
    }
  }, [showPast]);

  // Finishing a batch in Casting deletes its batch_outside row, so produced
  // autoclaves are rebuilt from lotes_list records instead: each batch record
  // becomes quantity_cakes filled slots on its production_date. A batch that is
  // still being cast keeps its batch_outside row, so it is matched back by
  // batch_id and skipped here rather than counted on both sides.
  const producedRows = useMemo(() => {
    if (!Array.isArray(lotesListBatches)) return [];

    const productByName = new Map();
    (latestProducts || []).forEach((p) => {
      const match = p.description?.match(LOTES_PRODUCT_NAME_REGEX);
      if (match?.[1]) productByName.set(match[1], p);
    });

    const castingBatchIds = new Set(
      newBatchOutside
        .filter((row) => row.batch_id != null)
        .map((row) => String(row.batch_id))
    );

    return lotesListBatches
      .filter((item) => {
        const date = String(item?.production_date || '').slice(0, 10);
        return date && !castingBatchIds.has(String(item.batch_id));
      })
      .sort(
        (a, b) =>
          Number(a.batch_id) - Number(b.batch_id) ||
          Number(a.sub_batch_id) - Number(b.sub_batch_id) ||
          Number(a.id) - Number(b.id)
      )
      .map((item) => ({
        date: String(item.production_date).slice(0, 10),
        product_article: productByName.get(item.product)?.article,
        quantity_arrays: Number(item.quantity_cakes) || 0,
        isProduced: true,
      }));
  }, [lotesListBatches, latestProducts, newBatchOutside]);

  // Produced autoclaves on today's and future dates are always shown — the day's
  // plan only reads correctly with them in place. Older ones stay behind the
  // "Show past days" toggle.
  const visibleProducedRows = useMemo(() => {
    if (showPast) return producedRows;
    const today = format(new Date(), 'yyyy-MM-dd');
    return producedRows.filter((row) => row.date >= today);
  }, [producedRows, showPast]);

  const gridColumns = useMemo(
    () =>
      buildGridColumns(
        [...visibleProducedRows, ...newBatchOutside],
        latestProducts,
        CELLS_PER_AUTOCLAVE,
        autoclave_calendar
      ),
    [
      visibleProducedRows,
      newBatchOutside,
      latestProducts,
      CELLS_PER_AUTOCLAVE,
      autoclave_calendar,
    ]
  );

  const firstCurrentIndex = useMemo(
    () => gridColumns.findIndex((col) => !col.isPast),
    [gridColumns]
  );

  // When history is shown, start the view at the current dates so the past sits to the left;
  // when it is hidden again, return to the start of the grid
  useEffect(() => {
    if (mode !== 'grid') return;
    const grid = gridRef.current;
    if (!grid) return;

    if (!showPast) {
      grid.scrollLeft = 0;
      return;
    }

    const first = firstCurrentCardRef.current;
    if (!first) return;

    grid.scrollLeft =
      first.getBoundingClientRect().left -
      grid.getBoundingClientRect().left +
      grid.scrollLeft;
  }, [mode, showPast, firstCurrentIndex]);

  const handleAutoclaveCardClick = (col) => {
    if (col.isProduced) return;

    if (col.isEmpty) {
      navigate('/production_batch_designer_new', { state: { date: col.date } });
      return;
    }

    const confirmed = window.confirm(
      `The autoclave(s) on ${col.date} are already filled or partially filled. Do you really want to edit them?`
    );
    if (!confirmed) return;

    navigate('/production_batch_designer_new', {
      state: { date: col.date, editMode: true },
    });
  };

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
            <div className="cl-stat__label">Cakes scheduled</div>
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
            className={`cl-btn ${
              mode === 'list' ? 'cl-btn--primary' : 'cl-btn--ghost'
            }`}
            onClick={() => setMode('list')}
          >
            List
          </button>
          <button
            type="button"
            className={`cl-btn ${
              mode === 'grid' ? 'cl-btn--primary' : 'cl-btn--ghost'
            }`}
            onClick={() => setMode('grid')}
          >
            Autoclave view
          </button>
        </div>
        <div className="cl-toolbar__spacer" />
        {mode === 'grid' && (
          <label className="bo-history-toggle">
            <input
              type="checkbox"
              checked={showPast}
              onChange={(e) => setShowPast(e.target.checked)}
            />
            Show past days
          </label>
        )}
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
        <div className="bo-grid bo-fade-in" ref={gridRef}>
          {gridColumns.map((col, colIndex) => (
            <div
              className={`bo-card ${col.isEmpty ? 'bo-card--empty' : ''} ${
                col.isProduced ? 'bo-card--history' : ''
              }`}
              key={colIndex}
              ref={colIndex === firstCurrentIndex ? firstCurrentCardRef : null}
              role={col.isProduced ? undefined : 'button'}
              tabIndex={col.isProduced ? undefined : 0}
              onClick={() => handleAutoclaveCardClick(col)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleAutoclaveCardClick(col);
                }
              }}
            >
              <div className={`bo-card__header ${col.colorClass}`}>
                {col.date}
                {col.weekNumber != null && (
                  <span className="bo-card__week">
                    Week {col.weekNumber}
                    {col.isProduced ? ' · Produced' : ''}
                  </span>
                )}
              </div>
              {col.isEmpty ? (
                <div className="bo-card__empty-state">
                  <span className="bo-card__empty-icon">+</span>
                  <span className="bo-card__empty-text">Empty autoclave</span>
                  <span className="bo-card__empty-sub">Click to plan</span>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BatchOutside;
