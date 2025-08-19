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

function Autoclave({ acData, batchFromBD, autoclaveCalendarData }) {
  const dispatch = useDispatch();
  const {
    setAutoclave,
    setQuantityPallets,
    autoclave,
    batchOrderIDs,
    setBatchOrderIDs,
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

  // сжать один ряд: непустые влево, пустые вправо
  const compactRowInPlace = (flat, rowIndex) => {
    const start = rowIndex * CELLS_PER_AUTOCLAVE;
    const end = start + CELLS_PER_AUTOCLAVE;
    const row = flat.slice(start, end);
    const used = row.filter((c) => !isEmpty(c));
    const pad = Array(CELLS_PER_AUTOCLAVE - used.length).fill({ ...EMPTY_CELL });
    const compacted = used.concat(pad);
    for (let i = 0; i < CELLS_PER_AUTOCLAVE; i++) flat[start + i] = compacted[i];
  };

  // сжать все ряды
  const compactAllRowsInPlace = (flat, rowsCount) => {
    for (let r = 0; r < rowsCount; r++) compactRowInPlace(flat, r);
  };

  // ---------- actions (без изменения длины массива) ----------
  const addArrayAfterId = () => {
    if (!selectedId) return;
    const found = batchDesigner?.find((el) => el?.id === selectedId);
    if (!found) return;
    const productId = found.id;

    setAutoclave((prev) => {
      const flat = prev.flat();

      // Хвост выбранной группы
      const lastIndex = flat.map((el) => el.id).lastIndexOf(selectedId);
      if (lastIndex === -1) {
        alert('Не найдено элементов с таким id');
        return prev;
      }

      // Ищем ПЕРВУЮ пустую ПОСЛЕ хвоста (глобально по автоклаву)
      let emptyIndex = -1;
      for (let i = lastIndex + 1; i < flat.length; i++) {
        if (!flat[i] || flat[i].id === null) {
          emptyIndex = i;
          break;
        }
      }
      if (emptyIndex === -1) {
        alert('No free slots available in autoclaves');
        return prev;
      }

      const source = { ...flat[lastIndex] };

      // СДВИГАЕМ хвост вправо на 1: [lastIndex+1 .. emptyIndex-1]
      for (let i = emptyIndex; i > lastIndex + 1; i--) {
        flat[i] = flat[i - 1];
      }
      // Ставим новый элемент СРАЗУ после группы
      flat[lastIndex + 1] = source;

      // Пересчёт и синхронизация
      const count = flat.filter((el) => el.id === productId).length;

      dispatch(
        updateBatchState({
          id: productId,
          cakes_in_batch: count,
          cakes_residue: 0,
        })
      );
      setQuantityPallets((prevQ) => ({ ...prevQ, [productId]: count * 3 }));
      setBatchOrderIDs((prevIDs) =>
        prevIDs.includes(productId) ? prevIDs : [...prevIDs, productId]
      );

      // Собираем обратно без изменения размеров
      const rows = [];
      const rowCount = prev.length;
      const CELLS_PER_AUTOCLAVE = 21;
      for (let r = 0; r < rowCount; r++) {
        const from = r * CELLS_PER_AUTOCLAVE;
        rows.push(flat.slice(from, from + CELLS_PER_AUTOCLAVE));
      }
      return rows;
    });
  };

  const deleteArrayById = () => {
    if (!selectedId) return;
    const found = batchDesigner?.find((el) => el?.id === selectedId);
    if (!found) return;
    const productId = found.id;

    setAutoclave((prev) => {
      const flat = prev.flat();
      const lastIndex = flat.map((el) => el.id).lastIndexOf(selectedId);
      if (lastIndex === -1) {
        alert('Не найдено элементов с таким id');
        return prev;
      }

      flat[lastIndex] = { ...EMPTY_CELL };

      const rowIndex = Math.floor(lastIndex / CELLS_PER_AUTOCLAVE);
      compactRowInPlace(flat, rowIndex);

      const count = flat.filter((el) => el.id === selectedId).length;
      const fromBD = batchFromBD?.find((el) => el.id === selectedId);
      const cakes_residue = fromBD?.cakes_residue ?? 0;

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
    const productId = found.id;

    setAutoclave((prev) => {
      const flat = prev.flat();

      // зануляем все вхождения выбранной партии
      for (let i = 0; i < flat.length; i++) {
        if (flat[i]?.id === selectedId) flat[i] = { ...EMPTY_CELL };
      }

      // сжимаем все ряды, чтобы пустые ушли в хвост каждого ряда
      compactAllRowsInPlace(flat, prev.length);

      const fromBD = batchFromBD?.find((el) => el.id === selectedId) || {};
      const { cakes_in_batch, cakes_residue } = fromBD;

      dispatch(updateBatchState({ id: productId, cakes_in_batch, cakes_residue }));
      setQuantityPallets((prevQ) => ({ ...prevQ, [productId]: 0 }));
      setBatchOrderIDs((prevIDs) => prevIDs.filter((x) => x !== productId));
      dispatch(unlockButton({ id: productId, isButtonLocked: false }));

      // собрать обратно без изменения размеров
      const rows = [];
      for (let r = 0; r < prev.length; r++) {
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

  const fillingAutoclave = () => {
    if (!selectedId) return;
    const found = batchDesigner?.find((el) => el?.id === selectedId);
    if (!found) return;
    const productId = found.id;

    setAutoclave((prev) => {
      const flat = prev.flat();

      let lastIndex = flat.map((el) => el.id).lastIndexOf(selectedId);
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

      const count = flat.filter((el) => el.id === productId).length;

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
