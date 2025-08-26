import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import {
  unlockButton,
  updateBatchState,
} from '#components/redux/actions/batchDesignerAction.js';
import {
  addNewBatchOutside,
  updateBatchOutside,
} from '#components/redux/actions/batchOutsideAction.js';
import { addNewAutoclaveCalendar } from '#components/redux/actions/warehouseAction.js';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const CELLS_PER_AUTOCLAVE = 21;
const EMPTY_CELL = { id: null, density: '', width: '' };

function Autoclave({ acData, autoclaveCalendarData }) {
  const dispatch = useDispatch();
  const {
    setAutoclave,
    setQuantityPallets,
    autoclave,
    batchOrderIDs,
    setBatchOrderIDs,
    productionBatchDesigner,
  } = useOrderContext();
  const { latestProducts } = useProductsContext();

  const [selectedId, setSelectedId] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [idColorMap, setIdColorMap] = useState({});
  const [initialRowCount, setInitialRowCount] = useState(0);

  const batchDesigner = useSelector((state) => state.batchDesigner);
  const existingBatchOutside = useSelector((state) => state.batchOutside) || [];

  const list_of_ordered_production = useSelector(
    (state) => state.listOfOrderedProduction
  );

  const getClassForAutoclave = (num) => {
    switch (num) {
      case 0:
        return 'cell-white';
      case 1:
        return 'cell-red';
      case 2:
        return 'cell-green';
      case 3:
        return 'cell-orange';
      case 4:
        return 'cell-black';
      case 5:
        return 'cell-yellow';
      case 6:
        return 'cell-gray';
      case 7:
        return 'cell-purple';
      case 8:
        return 'cell-blue';
      case 9:
        return 'cell-pink';
      default:
        return 'cell-white';
    }
  };

  // ——— helpers для "прилегания" к группе ———
  const articleHandler = (id) => {
    const product_article = batchDesigner.find((el) => el.id == id)?.product_article;
    setSelectedArticle(product_article);
  };
  // ——— helpers для "прилегания" к группе ———
  const getColBounds = (idx) => {
    const start = idx - (idx % CELLS_PER_AUTOCLAVE);
    return { start, end: start + CELLS_PER_AUTOCLAVE };
  };

  const findTailIndex = (flat, id) => {
    for (let i = flat.length - 1; i >= 0; i--) {
      if (flat[i]?.id === id) return i;
    }
    return -1;
  };

  const insertAdjacentToTail = (flat, tailIdx, payload) => {
    if (tailIdx < 0) return false;
    const { start, end } = getColBounds(tailIdx);

    // ищем первую пустую ПОСЛЕ хвоста внутри этой колонки
    let empty = -1;
    for (let i = tailIdx + 1; i < end; i++) {
      if (!flat[i] || flat[i].id == null) {
        empty = i;
        break;
      }
    }
    if (empty === -1) return false;

    // сдвиг внутри колонки только от хвоста до найденной пустоты
    for (let i = empty; i > tailIdx + 1; i--) flat[i] = flat[i - 1];
    flat[tailIdx + 1] = payload;
    return true;
  };

  const shipTs = (id) => {
    const o = (list_of_ordered_production || []).find(
      (x) => String(x.id) === String(id)
    );
    const d =
      o?.date_of_dispatch || o?.date_of_shipping || o?.shipment_date || o?.date;
    return d ? new Date(d).getTime() : 0;
  };

  const getGroupBySourceId = (id) =>
    (productionBatchDesigner || []).find((g) =>
      (g.sources || []).some((s) => s.id === id)
    );

  const getGroupIds = (id) =>
    (getGroupBySourceId(id)?.sources || []).map((s) => s.id);

  const getResidueById = (id) => {
    const r = (batchDesigner || []).find((b) => b.id === id)?.cakes_residue;
    return Number(r) || 0;
  };

  const getTotalById = (id) => {
    const p = (batchDesigner || []).find((el) => el.id === id);
    return Number(p?.total_cakes ?? 0);
  };
  const getInBatchById = (id) => {
    const v = (batchDesigner || []).find((el) => el.id === id)?.cakes_in_batch;
    return Number(v) || 0;
  };

  const pickSourceIdForAdd = (preferId) => {
    const ids = getGroupIds(preferId);
    if (!ids.length) return preferId ?? null;

    const hasUnplaced = ids.some((id) => getResidueById(id) > 0);
    const ascByDate = [...ids].sort((a, b) => shipTs(a) - shipTs(b));

    if (hasUnplaced) {
      for (const id of ascByDate) if (getResidueById(id) > 0) return id;
      return ascByDate[0];
    }
    // все размещены — добавляем в самый поздний заказ
    return ascByDate[ascByDate.length - 1];
  };

  const bumpOne = (id, delta) => {
    if (!id) return;
    const total = getTotalById(id); // план
    const currIn = getInBatchById(id); // сейчас
    const nextIn = Math.max(0, currIn + delta); // разрешаем > total (переразмещение)
    const nextResidue = Math.max(total - nextIn, 0); // residue растёт только ниже цели

    dispatch(
      updateBatchState({ id, cakes_in_batch: nextIn, cakes_residue: nextResidue })
    );
    dispatch(unlockButton({ id, isButtonLocked: nextResidue === 0 }));
    setQuantityPallets((prev) => ({ ...prev, [id]: nextIn * 3 }));
    setBatchOrderIDs((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const assignColorToId = (id) => {
    if (idColorMap[id] !== undefined) return idColorMap[id];
    const nextColor = Object.keys(idColorMap).length % 10;
    setIdColorMap((prevMap) => ({ ...prevMap, [id]: nextColor }));
    return nextColor;
  };

  const flatAutoclave = (rows) => rows.flat();

  const rowsFromFlat = (flat) => {
    const capacity = initialRowCount * CELLS_PER_AUTOCLAVE;
    const copy = flat.slice(0, capacity);

    while (copy.length < capacity) copy.push({ ...EMPTY_CELL });
    const out = [];
    for (let i = 0; i < capacity; i += CELLS_PER_AUTOCLAVE) {
      out.push(copy.slice(i, i + CELLS_PER_AUTOCLAVE));
    }
    return out;
  };

  const isEmpty = (c) => !c || c.id === null;

  const compactRowInPlace = (flat, rowIndex) => {
    const start = rowIndex * CELLS_PER_AUTOCLAVE;
    const end = start + CELLS_PER_AUTOCLAVE;
    const row = flat.slice(start, end);
    const used = row.filter((c) => !isEmpty(c));
    const pad = Array(CELLS_PER_AUTOCLAVE - used.length).fill({ ...EMPTY_CELL });
    const compacted = used.concat(pad);
    for (let i = 0; i < CELLS_PER_AUTOCLAVE; i++) flat[start + i] = compacted[i];
  };

  const addArrayAfterId = () => {
    if (!selectedId) return;

    // 1) выбираем заказ, в пользу которого добавляем (по твоей логике по дате)
    const idToUse = pickSourceIdForAdd(
      selectedId,
      productionBatchDesigner,
      batchDesigner
    );
    if (!idToUse) return;

    // 2) параметры плит (берём у группы; у всех sources они одинаковые)
    const group = getGroupBySourceId(selectedId);
    const density = group?.density || '';
    const width = group?.width || '';

    setAutoclave((prev) => {
      const flat = prev.flat();
      const payload = { id: idToUse, density, width };

      // 3) сначала пробуем "прилечь" к СВОЕЙ группе (idToUse)
      let inserted = false;
      let tail = findTailIndex(flat, idToUse);
      if (tail !== -1) {
        inserted = insertAdjacentToTail(flat, tail, payload);
      }

      // 4) если своей группы ещё нет — прилегаем к ВЫДЕЛЕННОЙ (визуальной) группе
      if (!inserted) {
        const selTail = findTailIndex(flat, selectedId);
        if (selTail !== -1) inserted = insertAdjacentToTail(flat, selTail, payload);
      }

      // 5) если и это не удалось (в колонках нет места после хвостов) —
      // ставим в первую глобальную пустую (и считчики всё равно увеличиваем)
      if (!inserted) {
        const firstEmpty = flat.findIndex((c) => !c || c.id == null);
        if (firstEmpty !== -1) {
          flat[firstEmpty] = payload;
          inserted = true;
        }
      }

      // 6) счётчики обновляем ВСЕГДА (можно класть сверх плана)
      bumpOne(idToUse, +1);
      setSelectedId(idToUse);

      return inserted ? rowsFromFlat(flat) : prev;
    });
  };

  const deleteArrayById = () => {
    if (!selectedId) return;
    const found = batchDesigner?.find((el) => el?.id === selectedId);
    if (!found) return;
    const productId = found.id;

    setAutoclave((prev) => {
      const flat = prev.flat();

      // удаляем ПОСЛЕДНЕЕ вхождение
      const lastIndex = flat
        .map((el) => el.article)
        .lastIndexOf(found.product_article);
      if (lastIndex === -1) {
        alert('Не найдено элементов с таким id');
        return prev;
      }

      flat[lastIndex] = { ...EMPTY_CELL };

      const rowIndex = Math.floor(lastIndex / CELLS_PER_AUTOCLAVE);
      compactRowInPlace(flat, rowIndex);

      const count = flat.filter((el) => el.id === selectedId).length;
      // Берём план (total) из batchDesigner, а не из локального snapshot
      const total = getTotalById(productId);
      const cakes_residue = Math.max(total - count, 0);

      if (cakes_residue <= count) {
        dispatch(
          updateBatchState({
            id: productId,
            cakes_in_batch: count,
            cakes_residue: 0,
          })
        );

        dispatch(unlockButton({ id: productId, isButtonLocked: true }));
      } else {
        dispatch(
          updateBatchState({
            id: productId,
            cakes_in_batch: count,
            cakes_residue: cakes_residue - count,
          })
        );
        dispatch(unlockButton({ id: productId, isButtonLocked: false }));
      }

      setQuantityPallets((prevQ) => ({ ...prevQ, [productId]: count * 3 }));
      setBatchOrderIDs((prevIDs) =>
        prevIDs.includes(productId) ? prevIDs : [...prevIDs, productId]
      );

      const rows = [];
      const rowCount = prev.length;
      for (let r = 0; r < rowCount; r++) {
        const from = r * CELLS_PER_AUTOCLAVE;
        rows.push(flat.slice(from, from + CELLS_PER_AUTOCLAVE));
      }

      return rows;
    });
  };

  const deleteBatchById = () => {
    if (!selectedId) return;

    const found = batchDesigner?.find((el) => el.id === selectedId);
    if (!found) return;

    // будем убирать всю партию по артикулу
    const targetArticle = found.product_article;

    setAutoclave((prev) => {
      const flat = prev.flat();
      const capacity = prev.length * CELLS_PER_AUTOCLAVE;

      // 1) Считаем, сколько ячеек какого id удалили
      const removedById = new Map();
      const kept = [];

      for (let i = 0; i < flat.length; i++) {
        const cell = flat[i];
        if (cell?.article === targetArticle) {
          // копим статистику по конкретным заказам внутри этой партии
          if (cell?.id != null) {
            removedById.set(cell.id, (removedById.get(cell.id) || 0) + 1);
          }
          // просто пропускаем — тем самым мы "сдвигаем всё влево" глобально
        } else {
          kept.push(cell);
        }
      }

      // 2) Добиваем пустыми до исходной ёмкости
      while (kept.length < capacity) kept.push({ ...EMPTY_CELL });

      // 3) Обновляем счётчики по всем затронутым id (-removed)
      for (const [id, removed] of removedById.entries()) {
        bumpOne(id, -removed);
      }

      // 4) Чистим выбранный id из списка сохранённых позиций
      setBatchOrderIDs((prevIDs) => prevIDs.filter((x) => !removedById.has(x)));

      // 5) Сбрасываем выделение и собираем ряды из глобально скомпактированного флата
      setSelectedId(null);

      const rows = [];
      for (let r = 0; r < prev.length; r++) {
        const from = r * CELLS_PER_AUTOCLAVE;
        rows.push(kept.slice(from, from + CELLS_PER_AUTOCLAVE));
      }
      return rows;
    });
  };

  const fillingAutoclave = () => {
    if (!selectedId) return;
    const found = batchDesigner?.find((el) => el?.id === selectedId);
    if (!found) return;
    const productId = found.id;

    setAutoclave((prev) => {
      const flat = prev.flat();

      let lastIndex = flat
        .map((el) => el.article)
        .lastIndexOf(found.product_article);
      if (lastIndex === -1) {
        alert('Не найдено элементов с таким id');
        return prev;
      }

      const rowStart = lastIndex - (lastIndex % CELLS_PER_AUTOCLAVE);
      const rowEnd = rowStart + CELLS_PER_AUTOCLAVE;
      const source = { ...flat[lastIndex] };

      // идём по позициям справа от хвоста в пределах текущего ряда
      for (let pos = lastIndex + 1; pos < rowEnd; pos++) {
        // если пусто — просто ставим
        if (!flat[pos] || flat[pos].id === null) {
          flat[pos] = { ...source };
          lastIndex = pos;
          continue;
        }

        // иначе ищем ближайшую пустую дальше в этом ряду
        let empty = -1;
        for (let j = pos; j < rowEnd; j++) {
          if (!flat[j] || flat[j].id === null) {
            empty = j;
            break;
          }
        }

        if (empty === -1) {
          // в ряду больше нет места
          break;
        }

        // сдвигаем хвост на 1 вправо: [pos .. empty-1] -> [pos+1 .. empty]
        for (let k = empty; k > pos; k--) {
          flat[k] = flat[k - 1];
        }
        // вставляем копию рядом с группой
        flat[pos] = { ...source };
        lastIndex = pos; // хвост группы сместился
      }

      const count = flat.filter((el) => el.article === found.product_article).length;

      dispatch(
        updateBatchState({
          id: selectedId,
          cakes_in_batch: count,
          cakes_residue: 0,
        })
      );

      setQuantityPallets((prevQ) => ({ ...prevQ, [productId]: count * 3 }));
      setBatchOrderIDs((prevIDs) =>
        prevIDs.includes(productId) ? prevIDs : [...prevIDs, productId]
      );

      // собираем обратно фиксированным размером
      const rows = [];
      const rowCount = prev.length;
      for (let r = 0; r < rowCount; r++) {
        const from = r * CELLS_PER_AUTOCLAVE;
        rows.push(flat.slice(from, from + CELLS_PER_AUTOCLAVE));
      }

      return rows;
    });
  };

  const moveBatchLater = () => {
    if (!selectedId) return;

    setAutoclave((prev) => {
      const flat = flatAutoclave(prev);

      const indicesSelected = [];
      const rest = [];
      flat.forEach((el, i) => {
        if (el?.id === selectedId) indicesSelected.push(i);
        else rest.push(i);
      });

      if (!indicesSelected.length) return prev;

      const lastOtherIndex = rest.length ? rest[rest.length - 1] : -1;

      const before = rest.filter((i) => i <= lastOtherIndex);
      const after = rest.filter((i) => i > lastOtherIndex);
      const newIndexOrder = [...before, ...indicesSelected, ...after];

      const copy = flat.slice();
      const newFlat = newIndexOrder.map((idx) => copy[idx]);

      return rowsFromFlat(newFlat);
    });
  };

  const onSaveHandler = async () => {
    const filledCount = Array.isArray(autoclave)
      ? autoclave.flat().filter((cell) => cell.id !== null).length
      : 0;

    if (filledCount === 0 || filledCount % CELLS_PER_AUTOCLAVE !== 0) {
      alert('Please fill the autoclave completely');
      return;
    }

    const { quantity, date, quantity_of_complited } = autoclaveCalendarData;
    const new_quantity_of_complited =
      quantity_of_complited + filledCount / CELLS_PER_AUTOCLAVE;

    const newDataCalendar = [
      {
        quantity,
        date,
        quantity_of_complited: new_quantity_of_complited,
      },
    ];

    dispatch(addNewAutoclaveCalendar(newDataCalendar));

    // Формируем новые позиции для batchOutside
    let positionInBatch = 1;
    const batchPositions = [];

    batchOrderIDs?.forEach((id) => {
      const product = batchDesigner.find((p) => p.id === id);
      if (product) {
        batchPositions.push({
          product,
          positionInBatch,
        });
        positionInBatch += product.cakes_in_batch;
      }
    });

    // 5. Объединяем новые записи между собой (если артикул и дата совпадают)
    const mergedNewPositions = batchPositions.reduce((acc, current) => {
      const lastItem = acc[acc.length - 1];
      const currentProduct = current.product;

      if (
        lastItem &&
        lastItem.product.product_article === currentProduct.product_article &&
        lastItem.product.id_list_of_ordered_production !== null &&
        currentProduct.id_list_of_ordered_production !== null
      ) {
        // Объединяем с предыдущей записью
        lastItem.product.cakes_in_batch += currentProduct.cakes_in_batch;
        lastItem.product.free_product_package += currentProduct.free_product_package;
        lastItem.product.total_cakes += currentProduct.total_cakes;
      } else {
        // Добавляем новую запись
        acc.push({
          product: { ...currentProduct },
          positionInBatch: current.positionInBatch,
        });
      }
      return acc;
    }, []);

    // 6. Для каждой объединённой новой записи:
    mergedNewPositions.forEach((newPosition) => {
      const { product } = newPosition;

      // Ищем совпадение в существующих записях (по артикулу и дате)
      const existingRecord = existingBatchOutside.find(
        (record) =>
          record.product_article === product.product_article && record.date === date
      );

      if (existingRecord) {
        // ОБНОВЛЯЕМ существующую запись

        const quantity_total =
          newPosition.product.id_list_of_ordered_production !== null
            ? list_of_ordered_production?.find(
                (order) => order.id == newPosition.product.id
              )
            : 0;

        const m3InArray = latestProducts?.find(
          (p) => p.article == product.product_article
        )?.m3InArray;
        const volumeBlockOnPallet = latestProducts?.find(
          (p) => p.article == product.product_article
        )?.volumeBlockOnPallet;

        const updatedRecord = {
          ...existingRecord,
          quantity_pallets:
            existingRecord.quantity_pallets +
            product.cakes_in_batch * Math.floor(m3InArray / volumeBlockOnPallet),
          quantity_free:
            newPosition.product.id_list_of_ordered_production !== null &&
            newPosition.product.cakes_in_batch &&
            newPosition.product.total_cakes &&
            newPosition.product.free_product_package >= 0
              ? Math.max(
                  0,
                  newPosition.product.cakes_in_batch *
                    Math.floor(m3InArray / volumeBlockOnPallet) -
                    quantity_total?.quantity
                )
              : newPosition.product.id_list_of_ordered_production == null
              ? newPosition.product.cakes_in_batch *
                  Math.floor(m3InArray / volumeBlockOnPallet) +
                existingRecord.quantity_free
              : 0,
          position_in_autoclave: newPosition.positionInBatch,
          id_list_of_ordered_production:
            newPosition.product.id_list_of_ordered_production !== null
              ? newPosition.product.id
              : null,
        };
        dispatch(updateBatchOutside(updatedRecord));
      } else {
        const quantity_total =
          newPosition.product.id_list_of_ordered_production !== null
            ? list_of_ordered_production?.find(
                (order) => order.id == newPosition.product.id
              )
            : 0;

        const m3InArray = latestProducts?.find(
          (p) => p.article == product.product_article
        )?.m3InArray;
        const volumeBlockOnPallet = latestProducts?.find(
          (p) => p.article == product.product_article
        )?.volumeBlockOnPallet;

        const newBatchOutside = {
          product_article: product.product_article,
          quantity_pallets:
            product.cakes_in_batch * Math.floor(m3InArray / volumeBlockOnPallet),
          quantity_free:
            newPosition?.product?.id_list_of_ordered_production !== null &&
            newPosition?.product?.cakes_in_batch &&
            newPosition?.product?.total_cakes &&
            newPosition?.product?.free_product_package >= 0
              ? Math.max(
                  0,
                  newPosition.product.cakes_in_batch *
                    Math.floor(m3InArray / volumeBlockOnPallet) -
                    quantity_total?.quantity
                )
              : newPosition.product.id_list_of_ordered_production == null
              ? newPosition.product.cakes_in_batch *
                  Math.floor(m3InArray / volumeBlockOnPallet) +
                existingRecord.quantity_free
              : 0,
          position_in_autoclave: newPosition.positionInBatch,
          id_list_of_ordered_production:
            newPosition.product.id_list_of_ordered_production !== null
              ? newPosition.product.id
              : null,
          date: date,
        };
        dispatch(addNewBatchOutside(newBatchOutside));
      }
    });

    setBatchOrderIDs([]);

    // let positionInBatch = 1;
    // let batchPositions = [];

    // batchOrderIDs?.forEach((id) => {
    //   const product = batchDesigner.find((p) => p.id === id);
    //   if (product) {
    //     batchPositions.push({
    //       product,
    //       positionInBatch,
    //     });
    //     positionInBatch += product.cakes_in_batch;
    //   }
    // });

    // const mergedBatchPositions = batchPositions.reduce((acc, current) => {
    //   const lastItem = acc[acc.length - 1];
    //   if (
    //     lastItem &&
    //     lastItem.product.product_article === current.product.product_article &&
    //     lastItem.product.id_list_of_ordered_production !== null &&
    //     current.product.id_list_of_ordered_production !== null
    //   ) {
    //     lastItem.product.cakes_in_batch += current.product.cakes_in_batch;
    //     lastItem.product.free_product_package +=
    //       current.product.free_product_package;
    //     lastItem.product.total_cakes += current.product.total_cakes;
    //   } else {
    //     acc.push({
    //       product: { ...current.product },
    //       positionInBatch: current.positionInBatch,
    //     });
    //   }
    //   return acc;
    // }, []);

    // mergedBatchPositions.forEach((position) => {
    //   dispatch(
    //     addNewBatchOutside({
    //       product_article: position.product.product_article,
    //       quantity_pallets: position.product.cakes_in_batch * 3,
    // quantity_free:
    //   position.product.id_list_of_ordered_production !== null &&
    //   position.product.cakes_in_batch &&
    //   position.product.total_cakes &&
    //   position.product.free_product_package >= 0
    //     ? (position.product.cakes_in_batch - position.product.total_cakes) *
    //         3 +
    //       position.product.free_product_package
    //     : position.product.id_list_of_ordered_production == null
    //     ? position.product.cakes_in_batch * 3
    //     : null,
    //       position_in_autoclave: position.positionInBatch,
    //       id_list_of_ordered_production:
    //         position.product.id_list_of_ordered_production !== null
    //           ? position.product.id
    //           : null,
    //       date: '',
    //     })
    //   );
    // });
    // setBatchOrderIDs([]);
  };

  // const onSaveHandler = () => {
  //   console.log('batch', batchDesigner);
  // };

  useEffect(() => {
    setAutoclave(acData);
    setInitialRowCount(Array.isArray(acData) ? acData.length : 0);
  }, [acData, setAutoclave]);

  useEffect(() => {
    setBatchOrderIDs([]);
  }, [setBatchOrderIDs]);

  return (
    <div>
      <div className="autoclave-container">
        {autoclave?.map((autoclaveRow, rowIndex) => (
          <div key={rowIndex} className="autoclave-row">
            <h3 className="autoclave-header">Автоклав {rowIndex + 1}</h3>
            {autoclaveRow?.map((el, cellIndex) => (
              <div
                key={cellIndex}
                className={`autoclave-cell ${getClassForAutoclave(
                  assignColorToId(el?.id)
                )}`}
                onClick={() => {
                  setSelectedId(el?.id);
                  articleHandler(el?.id);
                }}
              >
                {el.id !== null ? `${el.density}x${el.width}` : ''}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="autoclave-buttons-container">
        {selectedArticle && <div>Выбран массив с article: {selectedArticle}</div>}
        <button onClick={deleteBatchById}>Удалить партию</button>
        <button onClick={deleteArrayById}>Удалить Массив</button>
        <button onClick={addArrayAfterId}>Добавить массив</button>
        <button onClick={moveBatchLater}>Поставить партию позже</button>
        <button onClick={fillingAutoclave}>Заполнить Автоклав</button>
        <button onClick={onSaveHandler}>Save</button>
      </div>
    </div>
  );
}

export default Autoclave;
