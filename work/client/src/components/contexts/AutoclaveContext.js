import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOrderContext } from './OrderContext.js';
import { useProductsContext } from './ProductContext.js';
import {
  unlockButton,
  updateBatchState,
} from '#components/redux/actions/batchDesignerAction.js';
import {
  addNewBatchOutside,
  updateBatchOutside,
  deleteBatchOutside,
} from '#components/redux/actions/batchOutsideAction.js';
import { updateOrderToWarehouse } from '#components/redux/actions/orderToWarehouseAction.js';
import { addNewAutoclaveCalendar } from '#components/redux/actions/warehouseAction.js';

const CELLS_PER_AUTOCLAVE = 21;
const EMPTY_CELL = { id: null, density: '', width: '', article: '' };

const AutoclaveContext = createContext();

export const useAutoclaveContext = () => {
  const context = useContext(AutoclaveContext);
  if (!context)
    throw new Error(
      'useAutoclaveContext must be used within AutoclaveProvider',
    );
  return context;
};

export const AutoclaveContextProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { setQuantityPallets, setBatchOrderIDs, productionBatchDesigner } =
    useOrderContext();
  const { latestProducts } = useProductsContext();

  const batchDesigner = useSelector((state) => state.batchDesigner) || [];
  const existingBatchOutside = useSelector((state) => state.batchOutside) || [];
  const list_of_ordered_production = useSelector(
    (state) => state.listOfOrderedProduction,
  );

  // Состояния автоклава
  const [autoclave, setAutoclave] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [initialRowCount, setInitialRowCount] = useState(0);
  const [autoclaveCalendarData, setAutoclaveCalendarData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const autoclave_calendar = useSelector((state) => state.autoclave_calendar);

  useEffect(() => {
    setAutoclaveCalendarData(autoclave_calendar);
  }, [autoclave_calendar]);

  const resetAutocalveState = () => {
    setAutoclave([]);
    setInitialRowCount(0);
    setSelectedCell(null);
    setAutoclaveCalendarData(null);
    setIsEditMode(false);
  };

  // ---------- Вспомогательные функции (копируем из старого Autoclave) ----------
  const toFlat = useCallback((rows) => {
    const flat = Array.isArray(rows) ? rows.flat() : [];
    return flat.map((c) => {
      if (!c || c.id == null) return { ...EMPTY_CELL };
      return {
        id: c.id ?? null,
        density: c.density ?? '',
        width: c.width ?? '',
        article: c.article ?? '',
      };
    });
  }, []);

  const rebuildRows = useCallback(
    (flat) => {
      const capacity = initialRowCount * CELLS_PER_AUTOCLAVE;
      const outFlat = flat.slice(0, capacity);
      while (outFlat.length < capacity) outFlat.push({ ...EMPTY_CELL });
      const out = [];
      for (let i = 0; i < capacity; i += CELLS_PER_AUTOCLAVE) {
        out.push(outFlat.slice(i, i + CELLS_PER_AUTOCLAVE));
      }
      return out;
    },
    [initialRowCount],
  );

  const shipTs = useCallback(
    (id) => {
      const o = (list_of_ordered_production || []).find(
        (x) => String(x.id) === String(id),
      );
      const d =
        o?.date_of_dispatch ||
        o?.date_of_shipping ||
        o?.shipment_date ||
        o?.date;
      return d ? new Date(d).getTime() : 0;
    },
    [list_of_ordered_production],
  );

  const getGroupBySourceId = useCallback(
    (id) => {
      return (productionBatchDesigner || []).find((g) =>
        (g.sources || []).some((s) => String(s.id) === String(id)),
      );
    },
    [productionBatchDesigner],
  );

  const getGroupIds = useCallback(
    (id) => {
      return (getGroupBySourceId(id)?.sources || []).map((s) => s.id);
    },
    [getGroupBySourceId],
  );

  const getResidueById = useCallback(
    (id) => {
      const r = (batchDesigner || []).find(
        (b) => String(b.id) === String(id),
      )?.cakes_residue;
      return Number(r) || 0;
    },
    [batchDesigner],
  );

  const pickSourceIdForAdd = useCallback(
    (preferId) => {
      const ids = getGroupIds(preferId);
      if (!ids.length) return preferId ?? null;

      const hasUnplaced = ids.some((sid) => getResidueById(sid) > 0);
      const ascByDate = [...ids].sort((a, b) => shipTs(a) - shipTs(b));

      if (hasUnplaced) {
        for (const sid of ascByDate) if (getResidueById(sid) > 0) return sid;
        return ascByDate[0];
      }
      return ascByDate[ascByDate.length - 1];
    },
    [getGroupIds, getResidueById, shipTs],
  );

  const addArrayAfterSelected = useCallback(() => {
    if (!selectedCell?.article || !selectedCell?.id) return;

    const preferId = selectedCell.id;
    const idToUse = pickSourceIdForAdd(preferId);

    const product = latestProducts?.find(
      (p) => p.article === selectedCell.article,
    );
    const density = product?.density ?? selectedCell.density ?? '';
    const width = product?.width ?? selectedCell.width ?? '';

    setAutoclave((prev) => {
      const flat = toFlat(prev);
      const capacity = initialRowCount * CELLS_PER_AUTOCLAVE;

      const lastEmpty = [...flat]
        .map((c, i) => (c.id == null ? i : -1))
        .filter((i) => i !== -1)
        .pop();
      if (lastEmpty === undefined) {
        alert('No free space available');
        return prev;
      }

      const tail = [...flat]
        .map((c, i) => (c.article === selectedCell.article ? i : -1))
        .filter((i) => i !== -1)
        .pop();

      const insertAt =
        tail !== undefined ? tail + 1 : flat.findIndex((c) => c.id == null);

      const next = flat.slice();
      next.splice(insertAt, 0, {
        id: idToUse,
        density,
        width,
        article: selectedCell.article,
      });

      const idxToRemove = (() => {
        for (let i = next.length - 1; i >= 0; i--) {
          if (next[i]?.id == null) return i;
        }
        return -1;
      })();

      if (idxToRemove === -1) return prev;

      next.splice(idxToRemove, 1);
      next.length = capacity;

      return rebuildRows(next);
    });
  }, [
    selectedCell,
    pickSourceIdForAdd,
    latestProducts,
    toFlat,
    initialRowCount,
    rebuildRows,
  ]);

  const deleteOneArrayOfSelected = useCallback(() => {
    if (!selectedCell?.article) return;

    setAutoclave((prev) => {
      const flat = toFlat(prev);
      const idx = flat.map((c) => c.article).lastIndexOf(selectedCell.article);
      if (idx === -1) return prev;

      flat[idx] = { ...EMPTY_CELL };
      const used = flat.filter((c) => c.id != null);
      const capacity = initialRowCount * CELLS_PER_AUTOCLAVE;
      while (used.length < capacity) used.push({ ...EMPTY_CELL });

      return rebuildRows(used);
    });
  }, [selectedCell, toFlat, initialRowCount, rebuildRows]);

  const deleteBatchBySelectedArticle = useCallback(() => {
    if (!selectedCell?.article) return;

    setAutoclave((prev) => {
      const flat = toFlat(prev);
      const capacity = initialRowCount * CELLS_PER_AUTOCLAVE;
      const kept = flat.filter((c) => c.article !== selectedCell.article);
      while (kept.length < capacity) kept.push({ ...EMPTY_CELL });
      setSelectedCell(null);
      return rebuildRows(kept);
    });
  }, [selectedCell, toFlat, initialRowCount, rebuildRows]);

  const fillToRowEnd = useCallback(() => {
    if (!selectedCell?.article || !selectedCell?.id) return;

    const preferId = selectedCell.id;
    const idToUse = pickSourceIdForAdd(preferId);
    const group = getGroupBySourceId(preferId);
    const density = group?.density || selectedCell.density || '';
    const width = group?.width || selectedCell.width || '';

    setAutoclave((prev) => {
      const flat = toFlat(prev);
      const tail = [...flat]
        .map((c, i) => (c.article === selectedCell.article ? i : -1))
        .filter((i) => i !== -1)
        .pop();
      if (tail === undefined) return prev;

      const rowStart = tail - (tail % CELLS_PER_AUTOCLAVE);
      const rowEnd = rowStart + CELLS_PER_AUTOCLAVE;
      const nextFlat = flat.slice();

      let pos = tail + 1;
      while (pos < rowEnd) {
        if (nextFlat[pos].id === null) {
          nextFlat[pos] = {
            id: idToUse,
            density,
            width,
            article: selectedCell.article,
          };
          pos++;
        } else {
          let empty = -1;
          for (let i = pos; i < rowEnd; i++) {
            if (nextFlat[i].id === null) {
              empty = i;
              break;
            }
          }
          if (empty === -1) break;
          for (let i = empty; i > pos; i--) nextFlat[i] = nextFlat[i - 1];
          nextFlat[pos] = {
            id: idToUse,
            density,
            width,
            article: selectedCell.article,
          };
          pos++;
        }
      }
      return rebuildRows(nextFlat);
    });
  }, [
    selectedCell,
    pickSourceIdForAdd,
    getGroupBySourceId,
    toFlat,
    rebuildRows,
  ]);

  const moveBatchLater = useCallback(() => {
    if (!selectedCell?.article) return;

    setAutoclave((prev) => {
      const flat = toFlat(prev);
      const group = flat.filter((c) => c.article === selectedCell.article);
      const without = flat.filter((c) => c.article !== selectedCell.article);
      if (group.length === 0) return prev;

      while (without.length < flat.length) without.push({ ...EMPTY_CELL });

      let lastUsed = -1;
      for (let i = 0; i < without.length; i++) {
        if (without[i].id !== null) lastUsed = i;
      }
      const freeAfter = without.length - (lastUsed + 1);
      if (freeAfter < group.length) {
        alert('Not enough space to move this batch later');
        return prev;
      }

      const insertAt = lastUsed + 1;
      const result = [
        ...without.slice(0, insertAt),
        ...group,
        ...without.slice(insertAt, without.length - group.length),
      ];
      return rebuildRows(result);
    });
  }, [selectedCell, toFlat, rebuildRows]);

  const clearAutoclaves = useCallback(() => {
    const emptyRows = Array.from({ length: initialRowCount }, () =>
      Array.from({ length: CELLS_PER_AUTOCLAVE }, () => ({ ...EMPTY_CELL })),
    );
    setAutoclave(emptyRows);
    setBatchOrderIDs([]);
    setQuantityPallets({});

    batchDesigner.forEach((b) => {
      dispatch(
        updateBatchState({
          id: b.id,
          cakes_in_batch: 0,
          cakes_residue: b.total_cakes,
        }),
      );
      dispatch(unlockButton({ id: b.id, isButtonLocked: false }));
    });
  }, [
    initialRowCount,
    setBatchOrderIDs,
    setQuantityPallets,
    batchDesigner,
    dispatch,
  ]);

  const saveOnServer = useCallback(
    (filledCount) => {
      if (!autoclaveCalendarData) return;
      const producedDelta = Math.ceil(filledCount / CELLS_PER_AUTOCLAVE);
      const { quantity, date, produced_autoclave } = autoclaveCalendarData;
      const new_produced_autoclave =
        Number(produced_autoclave || 0) + producedDelta;

      dispatch(
        addNewAutoclaveCalendar([
          { quantity, date, produced_autoclave: new_produced_autoclave },
        ]),
      );

      const flat = toFlat(autoclave);
      const idsInOrder = [];
      for (const c of flat) {
        if (c?.id == null) continue;
        if (!idsInOrder.includes(c.id)) idsInOrder.push(c.id);
      }

      let positionInBatch = 1;
      const batchPositions = [];
      idsInOrder.forEach((id) => {
        const product = batchDesigner.find((p) => p.id === id);
        if (product) {
          batchPositions.push({ product, positionInBatch });
          positionInBatch += Number(product.cakes_in_batch || 0);
        }
      });

      const mergedNewPositions = batchPositions.reduce((acc, current) => {
        const lastItem = acc[acc.length - 1];
        const currentProduct = current.product;
        if (
          lastItem &&
          lastItem.product.product_article === currentProduct.product_article &&
          lastItem.product.id_list_of_ordered_production !== null &&
          currentProduct.id_list_of_ordered_production !== null
        ) {
          lastItem.product.cakes_in_batch += currentProduct.cakes_in_batch;
          lastItem.product.free_product_package +=
            currentProduct.free_product_package;
          lastItem.product.total_cakes += currentProduct.total_cakes;
        } else {
          acc.push({
            product: { ...currentProduct },
            positionInBatch: current.positionInBatch,
          });
        }
        return acc;
      }, []);

      mergedNewPositions.forEach((newPosition) => {
        const { product } = newPosition;
        const existingRecord = existingBatchOutside.find(
          (record) =>
            record.product_article === product.product_article &&
            record.date === date,
        );

        const quantity_total =
          newPosition.product.id_list_of_ordered_production !== null
            ? list_of_ordered_production?.find(
                (order) => order.id == newPosition.product.id,
              )
            : 0;

        const m3InArray = latestProducts?.find(
          (p) => p.article == product.product_article,
        )?.m3InArray;
        const volumeBlockOnPallet = latestProducts?.find(
          (p) => p.article == product.product_article,
        )?.volumeBlockOnPallet;
        const palletsPerArray = Math.max(
          1,
          Math.floor(
            Number(m3InArray || 0) / Number(volumeBlockOnPallet || 1),
          ) || 1,
        );

        if (existingRecord) {
          const updatedRecord = {
            ...existingRecord,
            quantity_pallets:
              existingRecord.quantity_pallets +
              product.cakes_in_batch * palletsPerArray,
            quantity_free:
              newPosition.product.id_list_of_ordered_production !== null &&
              newPosition.product.cakes_in_batch &&
              newPosition.product.total_cakes &&
              newPosition.product.free_product_package >= 0
                ? Math.max(
                    0,
                    newPosition.product.cakes_in_batch * palletsPerArray -
                      quantity_total?.quantity,
                  )
                : newPosition.product.id_list_of_ordered_production == null
                  ? newPosition.product.cakes_in_batch * palletsPerArray +
                    (existingRecord?.quantity_free || 0)
                  : 0,
            position_in_autoclave: newPosition.positionInBatch,
            id_list_of_ordered_production:
              newPosition.product.id_list_of_ordered_production !== null
                ? newPosition.product.id
                : null,
            id_ordered_product_to_warehouse:
              newPosition.product.id_ordered_product_to_warehouse ?? null,
          };
          dispatch(updateBatchOutside(updatedRecord));
        } else {
          const newBatchOutside = {
            product_article: product.product_article,
            quantity_pallets: product.cakes_in_batch * palletsPerArray,
            quantity_free:
              newPosition?.product?.id_list_of_ordered_production !== null &&
              newPosition?.product?.cakes_in_batch &&
              newPosition?.product?.total_cakes &&
              newPosition?.product?.free_product_package >= 0
                ? Math.max(
                    0,
                    newPosition.product.cakes_in_batch * palletsPerArray -
                      quantity_total?.quantity,
                  )
                : newPosition.product.id_list_of_ordered_production == null
                  ? newPosition.product.cakes_in_batch * palletsPerArray
                  : 0,
            position_in_autoclave: newPosition.positionInBatch,
            id_list_of_ordered_production:
              newPosition.product.id_list_of_ordered_production !== null
                ? newPosition.product.id
                : null,
            date,
            id_ordered_product_to_warehouse:
              newPosition.product.id_ordered_product_to_warehouse ?? null,
          };
          dispatch(addNewBatchOutside(newBatchOutside));
        }
        if (newPosition.product.id_ordered_product_to_warehouse) {
          dispatch(
            updateOrderToWarehouse({
              id: newPosition.product.id_ordered_product_to_warehouse,
              quantity_allocated: product.cakes_in_batch * palletsPerArray,
            }),
          );
        }
      });

      setSelectedCell(null);
      setIsEditMode(false);
      clearAutoclaves();
    },
    [
      autoclave,
      autoclaveCalendarData,
      batchDesigner,
      existingBatchOutside,
      list_of_ordered_production,
      latestProducts,
      dispatch,
      toFlat,
      clearAutoclaves,
    ],
  );

  // Полноценное редактирование уже сохранённых позиций batchOutside для конкретной
  // даты: старые записи на дату удаляются и создаются заново по текущей раскладке
  // автоклава, а не мержатся поверх (как в обычном saveOnServer).
  const saveEditedDateToServer = useCallback(
    (filledCount) => {
      if (!autoclaveCalendarData) return;
      const { date } = autoclaveCalendarData;

      const oldRecordsForDate = existingBatchOutside.filter(
        (r) => r.date === date,
      );

      const flat = toFlat(autoclave);
      const idsInOrder = [];
      for (const c of flat) {
        if (c?.id == null) continue;
        if (!idsInOrder.includes(c.id)) idsInOrder.push(c.id);
      }

      let positionInBatch = 1;
      const batchPositions = [];
      idsInOrder.forEach((id) => {
        const product = batchDesigner.find((p) => p.id === id);
        if (product) {
          batchPositions.push({ product, positionInBatch });
          positionInBatch += Number(product.cakes_in_batch || 0);
        }
      });

      const mergedNewPositions = batchPositions.reduce((acc, current) => {
        const lastItem = acc[acc.length - 1];
        const currentProduct = current.product;
        if (
          lastItem &&
          lastItem.product.product_article === currentProduct.product_article &&
          lastItem.product.id_list_of_ordered_production !== null &&
          currentProduct.id_list_of_ordered_production !== null
        ) {
          lastItem.product.cakes_in_batch += currentProduct.cakes_in_batch;
          lastItem.product.free_product_package +=
            currentProduct.free_product_package;
          lastItem.product.total_cakes += currentProduct.total_cakes;
        } else {
          acc.push({
            product: { ...currentProduct },
            positionInBatch: current.positionInBatch,
          });
        }
        return acc;
      }, []);

      // Для позиций, связанных со складским заказом, считаем чистую дельту
      // аллокации (старое значение по этой дате вычитаем, новое добавляем),
      // т.к. updateOrderToWarehouse на сервере суммирует переданное значение.
      const orderDelta = new Map();
      oldRecordsForDate.forEach((rec) => {
        if (rec.id_ordered_product_to_warehouse) {
          orderDelta.set(
            rec.id_ordered_product_to_warehouse,
            (orderDelta.get(rec.id_ordered_product_to_warehouse) || 0) -
              Number(rec.quantity_pallets || 0),
          );
        }
      });

      oldRecordsForDate.forEach((rec) => dispatch(deleteBatchOutside(rec.id)));

      mergedNewPositions.forEach((newPosition) => {
        const { product } = newPosition;

        const quantity_total =
          newPosition.product.id_list_of_ordered_production !== null
            ? list_of_ordered_production?.find(
                (order) => order.id == newPosition.product.id,
              )
            : 0;

        const m3InArray = latestProducts?.find(
          (p) => p.article == product.product_article,
        )?.m3InArray;
        const volumeBlockOnPallet = latestProducts?.find(
          (p) => p.article == product.product_article,
        )?.volumeBlockOnPallet;
        const palletsPerArray = Math.max(
          1,
          Math.floor(
            Number(m3InArray || 0) / Number(volumeBlockOnPallet || 1),
          ) || 1,
        );

        const quantity_pallets = product.cakes_in_batch * palletsPerArray;

        const quantity_free =
          newPosition.product.id_list_of_ordered_production !== null &&
          newPosition.product.cakes_in_batch &&
          newPosition.product.total_cakes &&
          newPosition.product.free_product_package >= 0
            ? Math.max(0, quantity_pallets - quantity_total?.quantity)
            : newPosition.product.id_list_of_ordered_production == null
              ? quantity_pallets
              : 0;

        dispatch(
          addNewBatchOutside({
            product_article: product.product_article,
            quantity_pallets,
            quantity_free,
            position_in_autoclave: newPosition.positionInBatch,
            id_list_of_ordered_production:
              newPosition.product.id_list_of_ordered_production !== null
                ? newPosition.product.id
                : null,
            date,
            id_ordered_product_to_warehouse:
              newPosition.product.id_ordered_product_to_warehouse ?? null,
          }),
        );

        if (newPosition.product.id_ordered_product_to_warehouse) {
          orderDelta.set(
            newPosition.product.id_ordered_product_to_warehouse,
            (orderDelta.get(
              newPosition.product.id_ordered_product_to_warehouse,
            ) || 0) + quantity_pallets,
          );
        }
      });

      orderDelta.forEach((delta, orderId) => {
        if (!delta) return;
        dispatch(
          updateOrderToWarehouse({ id: orderId, quantity_allocated: delta }),
        );
      });

      const totalAutoclavesForDate = Math.ceil(
        filledCount / CELLS_PER_AUTOCLAVE,
      );
      dispatch(
        addNewAutoclaveCalendar([
          {
            ...autoclaveCalendarData,
            produced_autoclave: totalAutoclavesForDate,
          },
        ]),
      );

      setSelectedCell(null);
      setIsEditMode(false);
      clearAutoclaves();
    },
    [
      autoclave,
      autoclaveCalendarData,
      batchDesigner,
      existingBatchOutside,
      list_of_ordered_production,
      latestProducts,
      dispatch,
      toFlat,
      clearAutoclaves,
    ],
  );

  const confirmFullAutoclaves = useCallback((filledCount) => {
    const isAutoclaveInvalid =
      filledCount === 0 || filledCount % CELLS_PER_AUTOCLAVE !== 0;
    if (!isAutoclaveInvalid) return true;

    const override = window.confirm(
      'Autoclave is not fully filled. Override with password?',
    );
    if (!override) return false;
    const password = prompt('Enter autoclave password:');
    if (!password) {
      alert('Password is required');
      return false;
    }
    if (password !== process.env.REACT_APP_PASSWORD_FOR_AUTOCLAVE) {
      console.log(
        process.env,
        'process.env.REACT_APP_PASSWORD_FOR_AUTOCLAVE AutoclaveContext.js line 683',
      );
      alert('Wrong password');
      return false;
    }
    return true;
  }, []);

  const onSaveHandler = useCallback(async () => {
    const filledCount = Array.isArray(autoclave)
      ? autoclave.flat().filter((cell) => cell?.id !== null).length
      : 0;

    if (!confirmFullAutoclaves(filledCount)) return false;

    saveOnServer(filledCount);
    return true;
  }, [autoclave, saveOnServer, confirmFullAutoclaves]);

  const onSaveEditHandler = useCallback(async () => {
    const filledCount = Array.isArray(autoclave)
      ? autoclave.flat().filter((cell) => cell?.id !== null).length
      : 0;

    if (!confirmFullAutoclaves(filledCount)) return false;

    saveEditedDateToServer(filledCount);
    return true;
  }, [autoclave, saveEditedDateToServer, confirmFullAutoclaves]);

  const syncFromAutoclave = useCallback(
    (rows) => {
      const flat = toFlat(rows);

      const counts = new Map();

      for (const c of flat) {
        if (!c || c.id == null) continue;
        counts.set(c.id, (counts.get(c.id) || 0) + 1);
      }

      for (const b of batchDesigner) {
        const id = b.id;
        const inBatch = counts.get(id) || 0;
        const total = Number(b.total_cakes ?? 0);
        const residue = Math.max(total - inBatch, 0);
        const shouldBeLocked = residue === 0;

        const currentInBatch = Number(b.cakes_in_batch || 0);
        const currentResidue = Number(b.cakes_residue || 0);

        if (currentInBatch !== inBatch || currentResidue !== residue) {
          dispatch(
            updateBatchState({
              id,
              cakes_in_batch: inBatch,
              cakes_residue: residue,
            }),
          );
        }

        if (b.isButtonLocked !== shouldBeLocked) {
          dispatch(
            unlockButton({
              id,
              isButtonLocked: shouldBeLocked,
            }),
          );
        }
      }

      const ids = Array.from(counts.keys());

      setQuantityPallets((prev) => {
        const next = { ...(prev || {}) };

        for (const id of ids) {
          next[id] = (counts.get(id) || 0) * 3;
        }

        for (const key of Object.keys(next)) {
          const numericKey = Number(key);
          if (!counts.has(numericKey)) {
            delete next[key];
          }
        }

        return next;
      });

      setBatchOrderIDs(ids);
    },
    [toFlat, batchDesigner, dispatch, setQuantityPallets, setBatchOrderIDs],
  );

  useEffect(() => {
    if (!Array.isArray(autoclave)) return;
    if (autoclave.length === 0) return;
    if (initialRowCount === 0) return;

    syncFromAutoclave(autoclave);
  }, [autoclave, initialRowCount, syncFromAutoclave]);

  const value = useMemo(
    () => ({
      autoclave,
      setAutoclave,
      selectedCell,
      setSelectedCell,
      initialRowCount,
      setInitialRowCount,
      autoclaveCalendarData,
      syncFromAutoclave,
      setAutoclaveCalendarData,
      addArrayAfterSelected,
      deleteOneArrayOfSelected,
      deleteBatchBySelectedArticle,
      fillToRowEnd,
      moveBatchLater,
      clearAutoclaves,
      onSaveHandler,
      onSaveEditHandler,
      isEditMode,
      setIsEditMode,
      CELLS_PER_AUTOCLAVE,
      resetAutocalveState,
    }),
    [
      autoclave,
      selectedCell,
      initialRowCount,
      autoclaveCalendarData,
      syncFromAutoclave,
      addArrayAfterSelected,
      deleteOneArrayOfSelected,
      deleteBatchBySelectedArticle,
      fillToRowEnd,
      moveBatchLater,
      clearAutoclaves,
      onSaveHandler,
      onSaveEditHandler,
      isEditMode,
      resetAutocalveState,
    ],
  );

  return (
    <AutoclaveContext.Provider value={value}>
      {children}
    </AutoclaveContext.Provider>
  );
};
