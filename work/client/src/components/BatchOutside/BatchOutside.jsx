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
import '#components/Clients/ClientsInfo/clientsDrawer.css';
import '#components/Styles/table.css';
import './batchOutside.css';

const DATE_COLOR_CLASSES = ['bo-date--green', 'bo-date--amber', 'bo-date--blue', 'bo-date--red'];

// Same pattern RawMatConsumptionModalUPD uses to derive lotes_list "product" from a product description
const LOTES_PRODUCT_NAME_REGEX = /BAUBLOCK®\s+([^ ]+(?:\s+[^ ]+)?\s+\d*\.?\d+)/;

function buildGridColumns(rows, latestProducts, cellsPerAutoclave, autoclaveCalendar) {
  const productByArticle = new Map((latestProducts || []).map((p) => [p.article, p]));

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
    ]),
  );

  const order = Array.from(new Set([...byDate.keys(), ...scheduledByDate.keys()])).sort((a, b) =>
    String(a).localeCompare(String(b)),
  );

  const today = format(new Date(), 'yyyy-MM-dd');
  const columns = [];
  order.forEach((date, dateIndex) => {
    const colorClass = DATE_COLOR_CLASSES[dateIndex % DATE_COLOR_CLASSES.length];
    const dateRows = (byDate.get(date) || [])
      .slice()
      .sort((a, b) => a.position_in_autoclave - b.position_in_autoclave);

    const slots = [];
    dateRows.forEach((row) => {
      for (let i = 0; i < row.quantity_arrays; i++) slots.push(row.product_article);
    });

    const weekNumber = date ? getISOWeek(parseISO(date)) : null;
    const isHistory = dateRows.length > 0 && Boolean(dateRows[0].isHistory);

    let filledCount = 0;
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
      columns.push({ date, weekNumber, colorClass, cakeRows, isEmpty: false, isHistory });
      filledCount += 1;
    }

    // No planning slots in the past: an autoclave scheduled on a gone-by date can't be filled anymore
    const scheduled = date < today ? 0 : scheduledByDate.get(date) || 0;
    const emptyCount = Math.max(0, scheduled - filledCount);
    for (let e = 0; e < emptyCount; e++) {
      columns.push({ date, weekNumber, colorClass, cakeRows: [], isEmpty: true, isHistory: false });
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

  useEffect(() => {
    if (showPast && (!Array.isArray(lotesListBatches) || !lotesListBatches.length)) {
      dispatch(getLotesList());
    }
  }, [showPast]);

  // Past dates are gone from batch_outside, so rebuild them from lotes_list records:
  // each batch record becomes quantity_cakes filled slots on its production_date.
  const pastRows = useMemo(() => {
    if (!showPast || !Array.isArray(lotesListBatches)) return [];

    const productByName = new Map();
    (latestProducts || []).forEach((p) => {
      const match = p.description?.match(LOTES_PRODUCT_NAME_REGEX);
      if (match?.[1]) productByName.set(match[1], p);
    });

    const activeDates = new Set(
      newBatchOutside.map((row) => String(row.date).slice(0, 10)),
    );
    const today = format(new Date(), 'yyyy-MM-dd');

    return lotesListBatches
      .filter((item) => {
        const date = String(item?.production_date || '').slice(0, 10);
        return date && date < today && !activeDates.has(date);
      })
      .sort(
        (a, b) =>
          Number(a.batch_id) - Number(b.batch_id) ||
          Number(a.sub_batch_id) - Number(b.sub_batch_id) ||
          Number(a.id) - Number(b.id),
      )
      .map((item, index) => ({
        date: String(item.production_date).slice(0, 10),
        product_article: productByName.get(item.product)?.article,
        quantity_arrays: Number(item.quantity_cakes) || 0,
        position_in_autoclave: index + 1,
        isHistory: true,
      }));
  }, [showPast, lotesListBatches, latestProducts, newBatchOutside]);

  const gridColumns = useMemo(
    () =>
      buildGridColumns(
        [...pastRows, ...newBatchOutside],
        latestProducts,
        CELLS_PER_AUTOCLAVE,
        autoclave_calendar,
      ),
    [pastRows, newBatchOutside, latestProducts, CELLS_PER_AUTOCLAVE, autoclave_calendar],
  );

  const firstCurrentIndex = useMemo(
    () => gridColumns.findIndex((col) => !col.isHistory),
    [gridColumns],
  );

  // Cards of the same date share one framed group so a production day reads as a single block
  const groupedColumns = useMemo(() => {
    const groups = [];
    gridColumns.forEach((col, index) => {
      const last = groups[groups.length - 1];
      if (last && last.date === col.date) {
        last.cols.push({ col, index });
      } else {
        groups.push({
          date: col.date,
          colorClass: col.colorClass,
          isHistory: col.isHistory,
          cols: [{ col, index }],
        });
      }
    });
    return groups;
  }, [gridColumns]);

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
    if (col.isHistory) return;

    if (col.isEmpty) {
      navigate('/production_batch_designer_new', { state: { date: col.date } });
      return;
    }

    const confirmed = window.confirm(
      `The autoclave(s) on ${col.date} are already filled or partially filled. Do you really want to edit them?`,
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
            className={`cl-btn ${mode === 'list' ? 'cl-btn--primary' : 'cl-btn--ghost'}`}
            onClick={() => setMode('list')}
          >
            List
          </button>
          <button
            type="button"
            className={`cl-btn ${mode === 'grid' ? 'cl-btn--primary' : 'cl-btn--ghost'}`}
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
          {groupedColumns.map((group) => (
            <div
              className={`bo-date-group ${group.colorClass} ${
                group.isHistory ? 'bo-date-group--history' : ''
              }`}
              key={group.date}
            >
              {group.cols.map(({ col, index: colIndex }) => (
                <div
                  className={`bo-card ${col.isEmpty ? 'bo-card--empty' : ''} ${
                    col.isHistory ? 'bo-card--history' : ''
                  }`}
                  key={colIndex}
                  ref={colIndex === firstCurrentIndex ? firstCurrentCardRef : null}
                  role={col.isHistory ? undefined : 'button'}
                  tabIndex={col.isHistory ? undefined : 0}
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
                        {col.isHistory ? ' · Archive' : ''}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default BatchOutside;
