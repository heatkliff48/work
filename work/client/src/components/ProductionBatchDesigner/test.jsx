import { useOrderContext } from '#components/contexts/OrderContext.js';
import {
  unlockButton,
  updateBatchState,
} from '#components/redux/actions/batchDesignerAction.js';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const CELLS_PER_AUTOCLAVE = 21;
const EMPTY_CELL = { id: null, density: '', width: '', article: '' };

function Autoclave({ acData }) {
  const dispatch = useDispatch();
  const {
    setAutoclave,
    setQuantityPallets,
    autoclave,
    setBatchOrderIDs,
    productionBatchDesigner,
  } = useOrderContext();

  const [selectedId, setSelectedId] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [initialRowCount, setInitialRowCount] = useState(0);

  const batchDesigner = useSelector((state) => state.batchDesigner);

  const cloneFlat = (flat) =>
    flat.map((c) => (c && c.id !== null ? { ...c } : { ...EMPTY_CELL }));

  const rebuildRows = (flat) => {
    const capacity = initialRowCount * CELLS_PER_AUTOCLAVE;
    const copy = flat.slice(0, capacity);
    while (copy.length < capacity) copy.push({ ...EMPTY_CELL });

    const out = [];
    for (let i = 0; i < capacity; i += CELLS_PER_AUTOCLAVE) {
      out.push(copy.slice(i, i + CELLS_PER_AUTOCLAVE));
    }
    return out;
  };

  const countByArticle = (flat, article) =>
    flat.filter((c) => c && c.article === article).length;

  const updateReduxForArticle = (flat, article) => {
    const ids = batchDesigner
      .filter((b) => b.product_article === article)
      .map((b) => b.id);

    const total = countByArticle(flat, article);

    ids.forEach((id) => {
      const totalForId = batchDesigner.find((b) => b.id === id)?.total_cakes || 0;
      const inBatch = flat.filter((c) => c && c.id === id).length;
      const residue = Math.max(totalForId - inBatch, 0);

      dispatch(
        updateBatchState({
          id,
          cakes_in_batch: inBatch,
          cakes_residue: residue,
        })
      );
      dispatch(unlockButton({ id, isButtonLocked: residue === 0 }));
      setQuantityPallets((prev) => ({ ...prev, [id]: inBatch * 3 }));
      setBatchOrderIDs((prev) => (prev.includes(id) ? prev : [...prev, id]));
    });
  };

  const getGroupBySourceId = (id) =>
    (productionBatchDesigner || []).find((g) =>
      (g.sources || []).some((s) => s.id === id)
    );

  const pickSourceIdForAdd = (preferId) => {
    const group = getGroupBySourceId(preferId);
    if (!group) return preferId;

    const sources = group.sources || [];
    const withResidue = sources.find((s) => s.cakes_residue > 0);
    return withResidue ? withResidue.id : sources[sources.length - 1]?.id;
  };

  const addArrayAfterId = () => {
    if (!selectedId || !selectedArticle) return;

    const idToUse = pickSourceIdForAdd(selectedId);
    const group = getGroupBySourceId(selectedId);
    const density = group?.density || '';
    const width = group?.width || '';

    setAutoclave((prev) => {
      const flat = cloneFlat(prev.flat());

      const tail = [...flat]
        .map((c, i) => (c.article === selectedArticle ? i : -1))
        .filter((i) => i !== -1)
        .pop();

      const insertAt =
        tail !== undefined ? tail + 1 : flat.findIndex((c) => c.id === null);

      if (insertAt === -1) return prev;

      flat.splice(insertAt, 0, {
        id: idToUse,
        density,
        width,
        article: selectedArticle,
      });
      flat.length = initialRowCount * CELLS_PER_AUTOCLAVE;

      updateReduxForArticle(flat, selectedArticle);

      return rebuildRows(flat);
    });
  };

  const fillingAutoclave = () => {
    if (!selectedArticle) return;

    setAutoclave((prev) => {
      const flat = cloneFlat(prev.flat());
      const tail = [...flat]
        .map((c, i) => (c.article === selectedArticle ? i : -1))
        .filter((i) => i !== -1)
        .pop();

      if (tail === undefined) return prev;

      const rowStart = tail - (tail % CELLS_PER_AUTOCLAVE);
      const rowEnd = rowStart + CELLS_PER_AUTOCLAVE;

      let pos = tail + 1;
      while (pos < rowEnd) {
        if (flat[pos].id === null) {
          flat[pos] = { ...flat[tail] };
          pos++;
        } else {
          let empty = -1;
          for (let i = pos; i < rowEnd; i++) {
            if (flat[i].id === null) {
              empty = i;
              break;
            }
          }
          if (empty === -1) break;
          for (let i = empty; i > pos; i--) flat[i] = flat[i - 1];
          flat[pos] = { ...flat[tail] };
          pos++;
        }
      }

      updateReduxForArticle(flat, selectedArticle);

      return rebuildRows(flat);
    });
  };

  useEffect(() => {
    setAutoclave(acData);
    setInitialRowCount(Array.isArray(acData) ? acData.length : 0);
  }, [acData]);

  return (
    <div>
      <div className="autoclave-container">
        {autoclave?.map((row, rowIndex) => (
          <div key={rowIndex} className="autoclave-row">
            <h3>Автоклав {rowIndex + 1}</h3>
            {row.map((el, i) => (
              <div
                key={i}
                className="autoclave-cell"
                onClick={() => {
                  setSelectedId(el.id);
                  setSelectedArticle(el.article);
                }}
              >
                {el.id ? `${el.density}x${el.width}` : ''}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div>
        {selectedArticle && <div>Выбран артикул: {selectedArticle}</div>}
        <button onClick={addArrayAfterId}>Добавить массив</button>
        <button onClick={fillingAutoclave}>Заполнить автоклав</button>
      </div>
    </div>
  );
}

export default Autoclave;
