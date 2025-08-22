import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
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

function Autoclave({ acData, batchFromBD, autoclaveCalendarData }) {
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

  // пытаемся достать дату отгрузки из нескольких возможных полей
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

  // Исходные значения "как было при загрузке" (для полного отката)
  const getOriginalById = (id) => {
    const x = (batchFromBD || []).find((el) => el.id === id);
    const orig_in = Number(x?.cakes_in_batch ?? 0);
    const orig_total = Number(x?.total_cakes ?? 0);
    const // если в исходнике не было residue — восстановим формулой total - in
      orig_res =
        x?.cakes_residue != null
          ? Number(x.cakes_residue)
          : Math.max(orig_total - orig_in, 0);
    return { inBatch: orig_in, residue: orig_res };
  };

  // Сколько по плану (цель)
  const getTotalById = (id) => {
    const p = (batchDesigner || []).find((el) => el.id === id);
    return Number(p?.total_cakes ?? 0);
  };
  const getInBatchById = (id) => {
    const v = (batchDesigner || []).find((el) => el.id === id)?.cakes_in_batch;
    return Number(v) || 0;
  };

  // Обновить несколько id за один проход (избегаем "по 1" в одном тике)
  const applyDeltaBatch = (deltaById /* { [id]: +N / -N } */) => {
    Object.entries(deltaById).forEach(([rawId, delta]) => {
      const id = Number(rawId);
      if (!id || !delta) return;

      const total = getTotalById(id);
      const curr = getInBatchById(id);
      const nextIn = Math.max(0, curr + delta); // можно > total (переразмещение)
      const nextRes = Math.max(total - nextIn, 0); // residue растёт только ниже цели

      dispatch(
        updateBatchState({ id, cakes_in_batch: nextIn, cakes_residue: nextRes })
      );
      dispatch(unlockButton({ id, isButtonLocked: nextRes === 0 }));
      setQuantityPallets((prev) => ({ ...prev, [id]: nextIn * 3 }));
      setBatchOrderIDs((prev) => (prev.includes(id) ? prev : [...prev, id]));
    });
  };

  // ДОБАВЛЕНИЕ: если есть неразмещённые — берём самую ближайшую дату среди тех, у кого residue > 0;
  // если все размещены — берём самую позднюю дату (последний элемент).
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

  // УДАЛЕНИЕ: всегда целимся в «последний по дате» из группы, у которого реально стоит хоть один массив в автоклаве
  const pickSourceIdForRemove = (preferId, flatCells) => {
    const ids = getGroupIds(preferId);
    const descByDate = [...ids].sort((a, b) => shipTs(a) - shipTs(b)).reverse();
    for (const id of descByDate) {
      if (flatCells?.some((c) => c?.id === id)) return id;
    }
    return descByDate[0] ?? null;
  };

  // атомарное изменение одного заказа с учётом цели (total_cakes)
  // ВАЖНО: удаление сверх цели НЕ увеличивает residue — формула сама это гарантирует.
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

  // const isEmpty = (c) => !c || c.id === null;

  // // сжать один ряд: непустые влево, пустые вправо
  // const compactRowInPlace = (flat, rowIndex) => {
  //   const start = rowIndex * CELLS_PER_AUTOCLAVE;
  //   const end = start + CELLS_PER_AUTOCLAVE;
  //   const row = flat.slice(start, end);
  //   const used = row.filter((c) => !isEmpty(c));
  //   const pad = Array(CELLS_PER_AUTOCLAVE - used.length).fill({ ...EMPTY_CELL });
  //   const compacted = used.concat(pad);
  //   for (let i = 0; i < CELLS_PER_AUTOCLAVE; i++) flat[start + i] = compacted[i];
  // };

  // // сжать все ряды
  // const compactAllRowsInPlace = (flat, rowsCount) => {
  //   for (let r = 0; r < rowsCount; r++) compactRowInPlace(flat, r);
  // };

  // ---------- actions (без изменения длины массива) ----------
  // const addArrayAfterId = () => {
  //   if (!selectedId) return;
  //   const found = batchDesigner?.find((el) => el?.id === selectedId);
  //   if (!found) return;
  //   const productId = found.id;

  //   setAutoclave((prev) => {
  //     const flat = prev.flat();

  //     // Хвост выбранной группы
  //     const lastIndex = flat.map((el) => el.id).lastIndexOf(selectedId);
  //     if (lastIndex === -1) {
  //       alert('Не найдено элементов с таким id');
  //       return prev;
  //     }

  //     // Ищем ПЕРВУЮ пустую ПОСЛЕ хвоста (глобально по автоклаву)
  //     let emptyIndex = -1;
  //     for (let i = lastIndex + 1; i < flat.length; i++) {
  //       if (!flat[i] || flat[i].id === null) {
  //         emptyIndex = i;
  //         break;
  //       }
  //     }
  //     if (emptyIndex === -1) {
  //       alert('No free slots available in autoclaves');
  //       return prev;
  //     }

  //     const source = { ...flat[lastIndex] };

  //     // СДВИГАЕМ хвост вправо на 1: [lastIndex+1 .. emptyIndex-1]
  //     for (let i = emptyIndex; i > lastIndex + 1; i--) {
  //       flat[i] = flat[i - 1];
  //     }
  //     // Ставим новый элемент СРАЗУ после группы
  //     flat[lastIndex + 1] = source;

  //     // Пересчёт и синхронизация
  //     // const count = flat.filter((el) => el.id === productId).length;

  //     // dispatch(
  //     //   updateBatchState({
  //     //     id: productId,
  //     //     cakes_in_batch: count,
  //     //     cakes_residue: 0,
  //     //   })
  //     // );
  //     // setQuantityPallets((prevQ) => ({ ...prevQ, [productId]: count * 3 }));
  //     // setBatchOrderIDs((prevIDs) =>
  //     //   prevIDs.includes(productId) ? prevIDs : [...prevIDs, productId]
  //     // );

  //     applyDelta(productId, +1);

  //     // Собираем обратно без изменения размеров
  //     const rows = [];
  //     const rowCount = prev.length;
  //     const CELLS_PER_AUTOCLAVE = 21;
  //     for (let r = 0; r < rowCount; r++) {
  //       const from = r * CELLS_PER_AUTOCLAVE;
  //       rows.push(flat.slice(from, from + CELLS_PER_AUTOCLAVE));
  //     }
  //     return rows;
  //   });
  // };

  // const deleteArrayById = () => {
  //   if (!selectedId) return;
  //   const found = batchDesigner?.find((el) => el?.id === selectedId);
  //   if (!found) return;
  //   const productId = found.id;

  //   setAutoclave((prev) => {
  //     const flat = prev.flat();
  //     const lastIndex = flat.map((el) => el.id).lastIndexOf(selectedId);
  //     if (lastIndex === -1) {
  //       alert('Не найдено элементов с таким id');
  //       return prev;
  //     }

  //     flat[lastIndex] = { ...EMPTY_CELL };

  //     const rowIndex = Math.floor(lastIndex / CELLS_PER_AUTOCLAVE);
  //     compactRowInPlace(flat, rowIndex);

  //     // const count = flat.filter((el) => el.id === selectedId).length;
  //     // const fromBD = batchFromBD?.find((el) => el.id === selectedId);
  //     // const cakes_residue = fromBD?.cakes_residue ?? 0;

  //     // if (cakes_residue <= count) {
  //     //   dispatch(
  //     //     updateBatchState({
  //     //       id: productId,
  //     //       cakes_in_batch: count,
  //     //       cakes_residue: 0,
  //     //     })
  //     //   );
  //     //   dispatch(unlockButton({ id: productId, isButtonLocked: true }));
  //     // } else {
  //     //   dispatch(
  //     //     updateBatchState({
  //     //       id: productId,
  //     //       cakes_in_batch: count,
  //     //       cakes_residue: cakes_residue - count,
  //     //     })
  //     //   );
  //     //   dispatch(unlockButton({ id: productId, isButtonLocked: false }));
  //     // }

  //     // setQuantityPallets((prevQ) => ({ ...prevQ, [productId]: count * 3 }));
  //     // setBatchOrderIDs((prevIDs) =>
  //     //   prevIDs.includes(productId) ? prevIDs : [...prevIDs, productId]
  //     // );
  //     applyDelta(productId, -1);

  //     const rows = [];
  //     const rowCount = prev.length;
  //     for (let r = 0; r < rowCount; r++) {
  //       const from = r * CELLS_PER_AUTOCLAVE;
  //       rows.push(flat.slice(from, from + CELLS_PER_AUTOCLAVE));
  //     }
  //     return rows;
  //   });
  // };

  // const deleteBatchById = () => {
  //   if (!selectedId) return;
  //   const found = batchDesigner?.find((el) => el.id === selectedId);
  //   if (!found) return;
  //   const productId = found.id;

  //   setAutoclave((prev) => {
  //     const flat = prev.flat();

  //     const toRemove = flat.filter((c) => c?.id === selectedId).length;

  //     // зануляем все вхождения выбранной партии
  //     for (let i = 0; i < flat.length; i++) {
  //       if (flat[i]?.id === selectedId) flat[i] = { ...EMPTY_CELL };
  //     }

  //     // сжимаем все ряды, чтобы пустые ушли в хвост каждого ряда
  //     compactAllRowsInPlace(flat, prev.length);

  //     // const fromBD = batchFromBD?.find((el) => el.id === selectedId) || {};
  //     // const { cakes_in_batch, cakes_residue } = fromBD;

  //     // dispatch(updateBatchState({ id: productId, cakes_in_batch, cakes_residue }));
  //     // setQuantityPallets((prevQ) => ({ ...prevQ, [productId]: 0 }));
  //     // setBatchOrderIDs((prevIDs) => prevIDs.filter((x) => x !== productId));
  //     // dispatch(unlockButton({ id: productId, isButtonLocked: false }));

  //     applyDelta(productId, -toRemove);

  //     // собрать обратно без изменения размеров
  //     const rows = [];
  //     for (let r = 0; r < prev.length; r++) {
  //       const from = r * CELLS_PER_AUTOCLAVE;
  //       rows.push(flat.slice(from, from + CELLS_PER_AUTOCLAVE));
  //     }
  //     return rows;
  //   });
  // };

  // const fillingAutoclave = () => {
  //   if (!selectedId) return;
  //   const found = batchDesigner?.find((el) => el?.id === selectedId);
  //   if (!found) return;
  //   const productId = found.id;

  //   setAutoclave((prev) => {
  //     const flat = prev.flat();

  //     let lastIndex = flat.map((el) => el.id).lastIndexOf(selectedId);
  //     if (lastIndex === -1) {
  //       alert('Не найдено элементов с таким id');
  //       return prev;
  //     }

  //     const rowStart = lastIndex - (lastIndex % CELLS_PER_AUTOCLAVE);
  //     const rowEnd = rowStart + CELLS_PER_AUTOCLAVE;
  //     const source = { ...flat[lastIndex] };

  //     let added = 0;
  //     // идём по позициям справа от хвоста в пределах текущего ряда
  //     for (let pos = lastIndex + 1; pos < rowEnd; pos++) {
  //       // если пусто — просто ставим
  //       if (!flat[pos] || flat[pos].id === null) {
  //         flat[pos] = { ...source };
  //         lastIndex = pos;
  //         added++;
  //         continue;
  //       }

  //       // иначе ищем ближайшую пустую дальше в этом ряду
  //       let empty = -1;
  //       for (let j = pos; j < rowEnd; j++) {
  //         if (!flat[j] || flat[j].id === null) {
  //           empty = j;
  //           break;
  //         }
  //       }

  //       if (empty === -1) {
  //         // в ряду больше нет места
  //         break;
  //       }

  //       // сдвигаем хвост на 1 вправо: [pos .. empty-1] -> [pos+1 .. empty]
  //       for (let k = empty; k > pos; k--) {
  //         flat[k] = flat[k - 1];
  //       }
  //       // вставляем копию рядом с группой
  //       flat[pos] = { ...source };
  //       lastIndex = pos; // хвост группы сместился
  //       added++;
  //     }

  //     // const count = flat.filter((el) => el.id === productId).length;

  //     // dispatch(
  //     //   updateBatchState({
  //     //     id: selectedId,
  //     //     cakes_in_batch: count,
  //     //     cakes_residue: 0,
  //     //   })
  //     // );

  //     // setQuantityPallets((prevQ) => ({ ...prevQ, [productId]: count * 3 }));
  //     // setBatchOrderIDs((prevIDs) =>
  //     //   prevIDs.includes(productId) ? prevIDs : [...prevIDs, productId]
  //     // );
  //     if (added > 0) applyDelta(productId, +added);

  //     // собираем обратно фиксированным размером
  //     const rows = [];
  //     const rowCount = prev.length;
  //     for (let r = 0; r < rowCount; r++) {
  //       const from = r * CELLS_PER_AUTOCLAVE;
  //       rows.push(flat.slice(from, from + CELLS_PER_AUTOCLAVE));
  //     }
  //     return rows;
  //   });
  // };

  const addArrayAfterId = () => {
    if (!selectedId) return;

    const group = getGroupBySourceId(selectedId);
    const density = group?.density || '';
    const width = group?.width || '';

    const idToUse = pickSourceIdForAdd(selectedId);

    setAutoclave((prev) => {
      const flat = flatAutoclave(prev);
      const firstFree = flat.findIndex((c) => !c?.id);

      if (firstFree !== -1) {
        const next = flat.slice();
        next[firstFree] = { id: idToUse, density, width };
        bumpOne(idToUse, +1);
        return rowsFromFlat(next);
      }

      // мест нет — всё равно считаем это валидным добавлением (обновляем счётчики)
      bumpOne(idToUse, +1);
      return prev;
    });
  };

  const deleteArrayById = () => {
    if (!selectedId) return;

    setAutoclave((prev) => {
      const flat = flatAutoclave(prev);
      const idToUse = pickSourceIdForRemove(selectedId, flat);
      if (!idToUse) return prev;

      // ищем «последний по дате» id в разметке, проходя с конца
      let idx = -1;
      for (let i = flat.length - 1; i >= 0; i--) {
        if (flat[i]?.id === idToUse) {
          idx = i;
          break;
        }
      }
      if (idx === -1) return prev;

      const copy = flat.slice();
      copy[idx] = { ...EMPTY_CELL };

      // компактируем только тот ряд, где удаляли
      const row = Math.floor(idx / CELLS_PER_AUTOCLAVE);
      const start = row * CELLS_PER_AUTOCLAVE;
      const chunk = copy
        .slice(start, start + CELLS_PER_AUTOCLAVE)
        .filter((c) => c?.id);
      while (chunk.length < CELLS_PER_AUTOCLAVE) chunk.push({ ...EMPTY_CELL });
      for (let i = 0; i < CELLS_PER_AUTOCLAVE; i++) copy[start + i] = chunk[i];

      bumpOne(idToUse, -1);

      // чтобы «Удалить массив» можно было жать подряд
      const nextId = pickSourceIdForRemove(selectedId, copy);
      setSelectedId(nextId);

      return rowsFromFlat(copy);
    });
  };

  const deleteBatchById = () => {
    if (!selectedId) return;

    setAutoclave((prev) => {
      const flat = flatAutoclave(prev);
      const ids = getGroupIds(selectedId);
      if (!ids.length) return prev;

      // очистить все ячейки группы
      const copy = flat.slice();
      for (let i = 0; i < copy.length; i++) {
        if (ids.includes(copy[i]?.id)) copy[i] = { ...EMPTY_CELL };
      }

      // компактнуть каждую колонку
      const cols = Math.ceil(copy.length / CELLS_PER_AUTOCLAVE);
      for (let c = 0; c < cols; c++) {
        const from = c * CELLS_PER_AUTOCLAVE;
        const chunk = copy
          .slice(from, from + CELLS_PER_AUTOCLAVE)
          .filter((x) => x?.id);
        while (chunk.length < CELLS_PER_AUTOCLAVE) chunk.push({ ...EMPTY_CELL });
        for (let i = 0; i < CELLS_PER_AUTOCLAVE; i++) copy[from + i] = chunk[i];
      }

      // откатить Redux к исходным значениям по каждому исходному заказу
      for (const id of ids) {
        const { inBatch, residue } = getOriginalById(id);
        dispatch(
          updateBatchState({ id, cakes_in_batch: inBatch, cakes_residue: residue })
        );
        dispatch(unlockButton({ id, isButtonLocked: residue === 0 }));
        setQuantityPallets((prev) => ({ ...prev, [id]: inBatch * 3 }));
        setBatchOrderIDs((prev) => (prev.includes(id) ? prev : [...prev, id]));
      }

      setSelectedId(null);
      return rowsFromFlat(copy);
    });
  };

  const fillingAutoclave = () => {
    if (!selectedId) return;

    const group = getGroupBySourceId(selectedId);
    const density = group?.density || '';
    const width = group?.width || '';

    setAutoclave((prev) => {
      const flat = flatAutoclave(prev);

      // найдём любую ячейку выбранного id, чтобы определить текущий автоклав (ряд из 21)
      const anyIdx = flat.map((c) => c?.id).lastIndexOf(selectedId);
      if (anyIdx === -1) return prev;

      const rowStart = anyIdx - (anyIdx % CELLS_PER_AUTOCLAVE);
      const rowEnd = rowStart + CELLS_PER_AUTOCLAVE;

      // все пустые позиции в ЭТОМ автоклаве
      const emptyPos = [];
      for (let i = rowStart; i < rowEnd; i++) {
        if (!flat[i] || flat[i].id === null) emptyPos.push(i);
      }
      if (emptyPos.length === 0) return prev;

      // кого пополняем: если есть неразмещённые — ближайшая дата, иначе — самая поздняя
      const idToUse =
        typeof pickSourceIdForAdd === 'function'
          ? pickSourceIdForAdd(selectedId)
          : selectedId;

      // рисуем в матрице сразу все ячейки…
      const next = flat.slice();
      for (const pos of emptyPos) next[pos] = { id: idToUse, density, width };

      // …и одним батчем обновляем счётчики (+кол-во пустых мест)
      applyDeltaBatch({ [idToUse]: emptyPos.length });

      return rowsFromFlat(next);
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
                onClick={() => setSelectedId(el?.id)}
              >
                {el.id !== null ? `${el.density}x${el.width}` : ''}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="autoclave-buttons-container">
        {selectedId && <div>Выбран массив с id: {selectedId}</div>}
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
