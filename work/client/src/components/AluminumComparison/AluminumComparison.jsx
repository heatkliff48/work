import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from '#components/Table/Table';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';
import { getLotesList } from '#components/redux/actions/lotesListAction.js';
import { getApiUrl } from '#utils/getApiUrl.js';

const round2 = (value) =>
  Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;

const formatKg = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return '0.00';
  return num.toFixed(2);
};

const formatSignedKg = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return '0.00';
  if (num > 0) return `+${num.toFixed(2)}`;
  return num.toFixed(2);
};

const parseNumeric = (val) => {
  if (val === null || val === undefined || val === '') return null;
  const num = Number(String(val).replace(',', '.'));
  return Number.isFinite(num) ? num : null;
};

function AluminumComparison() {
  const dispatch = useDispatch();
  const lotesListBatches = useSelector((state) => state.lotesListBatches);
  const { list_of_recipes = [] } = useRecipeContext();

  const [consumptions, setConsumptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState(null);

  const fetchConsumptions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(
        `${getApiUrl()}/rawMaterialsWarehouse/batch_aluminum_consumption`,
        { withCredentials: true },
      );
      setConsumptions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch batch aluminum consumptions:', err);
      setError('Failed to load actual aluminum consumption data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    dispatch(getLotesList());
    fetchConsumptions();
  }, [dispatch, fetchConsumptions]);

  const handleRefresh = () => {
    dispatch(getLotesList());
    fetchConsumptions();
  };

  const recipesByArticle = useMemo(() => {
    const map = new Map();
    (Array.isArray(list_of_recipes) ? list_of_recipes : []).forEach((r) => {
      if (r?.article != null) {
        map.set(String(r.article), r);
      }
    });
    return map;
  }, [list_of_recipes]);

  const comparisonRows = useMemo(() => {
    const batchesMap = new Map();

    const ensureBatch = (batchId) => {
      const key = String(batchId);
      if (!batchesMap.has(key)) {
        batchesMap.set(key, {
          batch_id: Number(batchId),
          production_date: '',
          productsSet: new Set(),
          recipesSet: new Set(),
          cakes_qty: 0,
          recipe_alu_1: 0,
          recipe_alu_2: 0,
          recipe_total: 0,
          recipe_by_type: {},
          subBatches: [],
          actual_total: 0,
          actual_by_type: {},
          actual_entries: [],
        });
      }
      return batchesMap.get(key);
    };

    (Array.isArray(lotesListBatches) ? lotesListBatches : []).forEach((row) => {
      if (!row || row.batch_id == null) return;
      const entry = ensureBatch(row.batch_id);

      if (!entry.production_date && row.production_date) {
        entry.production_date = String(row.production_date);
      }
      if (row.product) {
        entry.productsSet.add(String(row.product));
      }
      if (row.recipe) {
        entry.recipesSet.add(String(row.recipe));
      }

      const start = Number(row.cake_id_start);
      const finish = Number(row.cake_id_finish);
      const fallbackCakes =
        Number.isFinite(start) && Number.isFinite(finish) && finish >= start
          ? finish - start + 1
          : 0;
      const cakes = Number(row.quantity_cakes) || fallbackCakes;

      const baseRecipe =
        !row.custom_recipe && row.recipe
          ? recipesByArticle.get(String(row.recipe))
          : null;

      const alu1PerCake =
        parseNumeric(row.aluminum_paste) ??
        parseNumeric(baseRecipe?.aluminum_paste) ??
        0;
      const alu2PerCake =
        parseNumeric(row.aluminum_paste_2) ??
        parseNumeric(baseRecipe?.aluminum_paste_2) ??
        0;

      const rowAlu1 = round2(alu1PerCake * cakes);
      const rowAlu2 = round2(alu2PerCake * cakes);
      const rowTotal = round2(rowAlu1 + rowAlu2);

      entry.cakes_qty += cakes;
      entry.recipe_alu_1 = round2(entry.recipe_alu_1 + rowAlu1);
      entry.recipe_alu_2 = round2(entry.recipe_alu_2 + rowAlu2);
      entry.recipe_total = round2(entry.recipe_total + rowTotal);

      if (rowAlu1 > 0 && row.aluminum_type) {
        const t1 = String(row.aluminum_type);
        entry.recipe_by_type[t1] = round2((entry.recipe_by_type[t1] || 0) + rowAlu1);
      }
      if (rowAlu2 > 0 && row.aluminum_2_type) {
        const t2 = String(row.aluminum_2_type);
        entry.recipe_by_type[t2] = round2((entry.recipe_by_type[t2] || 0) + rowAlu2);
      }

      entry.subBatches.push({
        id: row.id,
        sub_batch_id: row.sub_batch_id,
        production_date: row.production_date || '',
        product: row.product || '',
        recipe: row.recipe || '',
        cakes,
        alu1PerCake,
        alu2PerCake,
        alu1Type: row.aluminum_type || '',
        alu2Type: row.aluminum_2_type || '',
        rowAlu1,
        rowAlu2,
        rowTotal,
      });
    });

    (Array.isArray(consumptions) ? consumptions : []).forEach((item) => {
      if (!item || item.batch_id == null) return;
      const entry = ensureBatch(item.batch_id);
      const qty = parseNumeric(item.quantity) || 0;
      const aluType = item.aluminum_type ? String(item.aluminum_type) : 'Unknown';

      if (!entry.production_date && item.date) {
        entry.production_date = String(item.date);
      }

      entry.actual_total = round2(entry.actual_total + qty);
      entry.actual_by_type[aluType] = round2(
        (entry.actual_by_type[aluType] || 0) + qty,
      );
      entry.actual_entries.push(item);
    });

    return Array.from(batchesMap.values())
      .map((entry) => {
        const diff = round2(entry.actual_total - entry.recipe_total);
        const diffPercent =
          entry.recipe_total > 0
            ? round2((diff / entry.recipe_total) * 100)
            : null;

        const actualTypesSummary = Object.entries(entry.actual_by_type)
          .map(([type, qty]) => `${type}: ${formatKg(qty)} kg`)
          .join(', ');

        entry.subBatches.sort(
          (a, b) => Number(a.sub_batch_id || 0) - Number(b.sub_batch_id || 0),
        );

        return {
          batch_id: entry.batch_id,
          production_date: entry.production_date,
          product: Array.from(entry.productsSet).join(', '),
          recipe: Array.from(entry.recipesSet).join(', '),
          cakes_qty: entry.cakes_qty,
          recipe_alu_1: entry.recipe_alu_1,
          recipe_alu_2: entry.recipe_alu_2,
          recipe_total: entry.recipe_total,
          actual_total: entry.actual_total,
          diff,
          diff_percent: diffPercent,
          actual_types_summary: actualTypesSummary,
          actual_by_type: entry.actual_by_type,
          recipe_by_type: entry.recipe_by_type,
          subBatches: entry.subBatches,
          actual_entries: entry.actual_entries,
        };
      })
      .sort((a, b) => b.batch_id - a.batch_id);
  }, [lotesListBatches, consumptions, recipesByArticle]);

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return comparisonRows.filter((row) => {
      if (statusFilter === 'with_actual' && row.actual_entries.length === 0) {
        return false;
      }
      if (statusFilter === 'without_actual' && row.actual_entries.length > 0) {
        return false;
      }
      if (statusFilter === 'discrepancy' && Math.abs(row.diff) < 0.01) {
        return false;
      }

      if (dateFrom && (!row.production_date || row.production_date < dateFrom)) {
        return false;
      }
      if (dateTo && (!row.production_date || row.production_date > dateTo)) {
        return false;
      }

      if (q) {
        const haystack = [
          row.batch_id,
          row.production_date,
          row.product,
          row.recipe,
          row.actual_types_summary,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [comparisonRows, searchQuery, dateFrom, dateTo, statusFilter]);

  const summary = useMemo(() => {
    let totalRecipe = 0;
    let totalActual = 0;
    let totalCakes = 0;

    filteredRows.forEach((row) => {
      totalRecipe += row.recipe_total;
      totalActual += row.actual_total;
      totalCakes += row.cakes_qty;
    });

    totalRecipe = round2(totalRecipe);
    totalActual = round2(totalActual);
    const totalDiff = round2(totalActual - totalRecipe);
    const totalDiffPercent =
      totalRecipe > 0 ? round2((totalDiff / totalRecipe) * 100) : null;

    return {
      batchesCount: filteredRows.length,
      totalCakes,
      totalRecipe,
      totalActual,
      totalDiff,
      totalDiffPercent,
    };
  }, [filteredRows]);

  const columns = useMemo(
    () => [
      {
        Header: 'Batch ID',
        accessor: 'batch_id',
      },
      {
        Header: 'Date',
        accessor: 'production_date',
        Cell: ({ value }) => value || '—',
      },
      {
        Header: 'Product',
        accessor: 'product',
        Cell: ({ value }) => value || '—',
      },
      {
        Header: 'Recipe',
        accessor: 'recipe',
        Cell: ({ value }) => value || '—',
      },
      {
        Header: 'Cakes, qty',
        accessor: 'cakes_qty',
      },
      {
        Header: 'Recipe Alu 1 (kg)',
        accessor: 'recipe_alu_1',
        Cell: ({ value }) => formatKg(value),
      },
      {
        Header: 'Recipe Alu 2 (kg)',
        accessor: 'recipe_alu_2',
        Cell: ({ value }) => formatKg(value),
      },
      {
        Header: 'Recipe Total (kg)',
        accessor: 'recipe_total',
        Cell: ({ value }) => <strong>{formatKg(value)}</strong>,
      },
      {
        Header: 'Actual Total (kg)',
        accessor: 'actual_total',
        Cell: ({ row, value }) => (
          <div>
            <strong>{formatKg(value)}</strong>
            {row.original.actual_types_summary ? (
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {row.original.actual_types_summary}
              </div>
            ) : (
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                No write-offs
              </div>
            )}
          </div>
        ),
      },
      {
        Header: 'Diff (Actual - Recipe, kg)',
        accessor: 'diff',
        Cell: ({ value }) => {
          const color =
            value > 0.009 ? '#dc2626' : value < -0.009 ? '#16a34a' : '#475569';
          return (
            <span style={{ color, fontWeight: 600 }}>
              {formatSignedKg(value)}
            </span>
          );
        },
      },
      {
        Header: 'Diff (%)',
        accessor: 'diff_percent',
        Cell: ({ value }) => {
          if (value === null || value === undefined) return '—';
          const color =
            value > 0.009 ? '#dc2626' : value < -0.009 ? '#16a34a' : '#475569';
          return (
            <span style={{ color, fontWeight: 600 }}>
              {value > 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`}
            </span>
          );
        },
      },
    ],
    [],
  );

  const diffColor =
    summary.totalDiff > 0.009
      ? '#dc2626'
      : summary.totalDiff < -0.009
        ? '#16a34a'
        : '#0f172a';

  return (
    <div style={{ padding: '16px 20px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '12px 16px',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Batches / Cakes
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700 }}>
            {summary.batchesCount}{' '}
            <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748b' }}>
              ({summary.totalCakes} cakes)
            </span>
          </div>
        </div>

        <div
          style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '12px 16px',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Recipe Aluminum (Lotes List)
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a' }}>
            {formatKg(summary.totalRecipe)} kg
          </div>
        </div>

        <div
          style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '12px 16px',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Actual Aluminum (BatchAluminumConsumptions)
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a' }}>
            {formatKg(summary.totalActual)} kg
          </div>
        </div>

        <div
          style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '12px 16px',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Total Difference (Actual - Recipe)
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: diffColor }}>
            {formatSignedKg(summary.totalDiff)} kg
            {summary.totalDiffPercent !== null && (
              <span style={{ fontSize: '0.9rem', marginLeft: '6px' }}>
                ({summary.totalDiffPercent > 0 ? '+' : ''}
                {summary.totalDiffPercent.toFixed(1)}%)
              </span>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '12px',
          }}
        >
          {error}
        </div>
      )}

      <Table
        COLUMN_DATA={columns}
        dataOfTable={filteredRows}
        variant="card"
        hideTitle
        emptyTitle="No batches match your filters"
        emptySubtitle="Try clearing the search query or date range."
        handleRowClick={(row) => setSelectedBatch(row.original)}
        renderToolbar={() => (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '10px 14px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                alignItems: 'center',
              }}
            >
              <input
                type="text"
                className="form-control form-control-sm"
                style={{ width: '230px' }}
                placeholder="Search batch, product, recipe, type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                className="form-select form-select-sm"
                style={{ width: '190px' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All batches</option>
                <option value="with_actual">With actual write-offs</option>
                <option value="without_actual">No actual write-offs</option>
                <option value="discrepancy">With discrepancy</option>
              </select>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>From:</span>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>To:</span>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              {(searchQuery || dateFrom || dateTo || statusFilter !== 'all') && (
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => {
                    setSearchQuery('');
                    setDateFrom('');
                    setDateTo('');
                    setStatusFilter('all');
                  }}
                >
                  Reset
                </Button>
              )}
            </div>
            <Button
              size="sm"
              variant="primary"
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        )}
      />

      <Modal
        show={Boolean(selectedBatch)}
        onHide={() => setSelectedBatch(null)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Batch #{selectedBatch?.batch_id} — Aluminum Comparison
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBatch && (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px',
                  marginBottom: '16px',
                  padding: '10px 12px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Recipe Total
                  </div>
                  <div style={{ fontWeight: 700 }}>
                    {formatKg(selectedBatch.recipe_total)} kg
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Actual Total
                  </div>
                  <div style={{ fontWeight: 700 }}>
                    {formatKg(selectedBatch.actual_total)} kg
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Difference (Actual - Recipe)
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      color:
                        selectedBatch.diff > 0.009
                          ? '#dc2626'
                          : selectedBatch.diff < -0.009
                            ? '#16a34a'
                            : '#475569',
                    }}
                  >
                    {formatSignedKg(selectedBatch.diff)} kg
                    {selectedBatch.diff_percent !== null &&
                      ` (${selectedBatch.diff_percent > 0 ? '+' : ''}${selectedBatch.diff_percent.toFixed(1)}%)`}
                  </div>
                </div>
              </div>

              <h6 style={{ marginBottom: '8px' }}>
                Recipe Breakdown (Lotes List)
              </h6>
              {selectedBatch.subBatches.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                  No records in Lotes List for this batch.
                </p>
              ) : (
                <div className="table-responsive" style={{ marginBottom: '16px' }}>
                  <table className="table table-sm table-bordered">
                    <thead>
                      <tr>
                        <th>Sub-batch</th>
                        <th>Date</th>
                        <th>Product</th>
                        <th>Recipe</th>
                        <th>Cakes</th>
                        <th>Alu 1/cake</th>
                        <th>Alu 2/cake</th>
                        <th>Total (kg)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBatch.subBatches.map((sb, idx) => (
                        <tr key={sb.id || idx}>
                          <td>{sb.sub_batch_id ?? '—'}</td>
                          <td>{sb.production_date || '—'}</td>
                          <td>{sb.product || '—'}</td>
                          <td>{sb.recipe || '—'}</td>
                          <td>{sb.cakes}</td>
                          <td>
                            {sb.alu1PerCake}
                            {sb.alu1Type ? ` (${sb.alu1Type})` : ''}
                          </td>
                          <td>
                            {sb.alu2PerCake}
                            {sb.alu2Type ? ` (${sb.alu2Type})` : ''}
                          </td>
                          <td>
                            <strong>{formatKg(sb.rowTotal)}</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <h6 style={{ marginBottom: '8px' }}>
                Actual Write-offs (BatchAluminumConsumptions)
              </h6>
              {selectedBatch.actual_entries.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                  No aluminum write-offs recorded for this batch.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm table-bordered">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Aluminum Type</th>
                        <th>Quantity (kg)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBatch.actual_entries.map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td>{item.id}</td>
                          <td>{item.date || '—'}</td>
                          <td>{item.aluminum_type}</td>
                          <td>
                            <strong>{formatKg(item.quantity)}</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedBatch(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AluminumComparison;
