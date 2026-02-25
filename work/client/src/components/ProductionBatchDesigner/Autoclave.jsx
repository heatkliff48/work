// import { useOrderContext } from '#components/contexts/OrderContext.js';
// import { useProductsContext } from '#components/contexts/ProductContext.js';
// import {
//   unlockButton,
//   updateBatchState,
// } from '#components/redux/actions/batchDesignerAction.js';
// import {
//   addNewBatchOutside,
//   updateBatchOutside,
// } from '#components/redux/actions/batchOutsideAction.js';
// import { addNewAutoclaveCalendar } from '#components/redux/actions/warehouseAction.js';
// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';

// const CELLS_PER_AUTOCLAVE = 21;
// const EMPTY_CELL = { id: null, density: '', width: '' };

// function Autoclave({ acData, autoclaveCalendarData }) {
//   const dispatch = useDispatch();
//   const {
//     setAutoclave,
//     setQuantityPallets,
//     autoclave,
//     batchOrderIDs,
//     setBatchOrderIDs,
//     productionBatchDesigner,
//   } = useOrderContext();
//   const { latestProducts } = useProductsContext();

//   const [selectedId, setSelectedId] = useState(null);
//   const [selectedArticle, setSelectedArticle] = useState(null);
//   const [idColorMap, setIdColorMap] = useState({});
//   const [initialRowCount, setInitialRowCount] = useState(0);

//   const batchDesigner = useSelector((state) => state.batchDesigner);
//   const existingBatchOutside = useSelector((state) => state.batchOutside) || [];

//   const list_of_ordered_production = useSelector(
//     (state) => state.listOfOrderedProduction
//   );

//   const getClassForAutoclave = (num) => {
//     switch (num) {
//       case 0:
//         return 'cell-white';
//       case 1:
//         return 'cell-red';
//       case 2:
//         return 'cell-green';
//       case 3:
//         return 'cell-orange';
//       case 4:
//         return 'cell-black';
//       case 5:
//         return 'cell-yellow';
//       case 6:
//         return 'cell-gray';
//       case 7:
//         return 'cell-purple';
//       case 8:
//         return 'cell-blue';
//       case 9:
//         return 'cell-pink';
//       default:
//         return 'cell-white';
//     }
//   };

//   const cloneFlat = (flat) =>
//     flat.map((c) => (c && c.id !== null ? { ...c } : { ...EMPTY_CELL }));

//   const rebuildRows = (flat) => {
//     const capacity = initialRowCount * CELLS_PER_AUTOCLAVE;
//     const copy = flat.slice(0, capacity);
//     while (copy.length < capacity) copy.push({ ...EMPTY_CELL });

//     const out = [];
//     for (let i = 0; i < capacity; i += CELLS_PER_AUTOCLAVE) {
//       out.push(copy.slice(i, i + CELLS_PER_AUTOCLAVE));
//     }
//     return out;
//   };

//   const updateReduxForArticle = (flat, article) => {
//     const ids = batchDesigner
//       .filter((b) => b.product_article === article)
//       .map((b) => b.id);

//     ids.forEach((id) => {
//       const totalForId = batchDesigner.find((b) => b.id === id)?.total_cakes || 0;
//       const inBatch = flat.filter((c) => c && c.id === id).length;
//       const residue = Math.max(totalForId - inBatch, 0);

//       dispatch(
//         updateBatchState({
//           id,
//           cakes_in_batch: inBatch,
//           cakes_residue: residue,
//         })
//       );
//       dispatch(unlockButton({ id, isButtonLocked: residue === 0 }));
//       setQuantityPallets((prev) => ({ ...prev, [id]: inBatch * 3 }));
//       setBatchOrderIDs((prev) => (prev.includes(id) ? prev : [...prev, id]));
//     });
//   };

//   const articleHandler = (id) => {
//     const product_article = batchDesigner.find((el) => el.id == id)?.product_article;
//     setSelectedArticle(product_article);
//   };

//   const shipTs = (id) => {
//     const o = (list_of_ordered_production || []).find(
//       (x) => String(x.id) === String(id)
//     );
//     const d =
//       o?.date_of_dispatch || o?.date_of_shipping || o?.shipment_date || o?.date;
//     return d ? new Date(d).getTime() : 0;
//   };

//   const getGroupBySourceId = (id) =>
//     (productionBatchDesigner || []).find((g) =>
//       (g.sources || []).some((s) => s.id === id)
//     );

//   const getGroupIds = (id) =>
//     (getGroupBySourceId(id)?.sources || []).map((s) => s.id);

//   const getResidueById = (id) => {
//     const r = (batchDesigner || []).find((b) => b.id === id)?.cakes_residue;
//     return Number(r) || 0;
//   };

//   const getTotalById = (id) => {
//     const p = (batchDesigner || []).find((el) => el.id === id);
//     return Number(p?.total_cakes ?? 0);
//   };
//   const getInBatchById = (id) => {
//     const v = (batchDesigner || []).find((el) => el.id === id)?.cakes_in_batch;
//     return Number(v) || 0;
//   };

//   const pickSourceIdForAdd = (preferId) => {
//     const ids = getGroupIds(preferId);
//     if (!ids.length) return preferId ?? null;

//     const hasUnplaced = ids.some((id) => getResidueById(id) > 0);
//     const ascByDate = [...ids].sort((a, b) => shipTs(a) - shipTs(b));

//     if (hasUnplaced) {
//       for (const id of ascByDate) if (getResidueById(id) > 0) return id;
//       return ascByDate[0];
//     }
//     return ascByDate[ascByDate.length - 1];
//   };

//   const bumpOne = (id, delta) => {
//     if (!id) return;
//     const total = getTotalById(id);
//     const currIn = getInBatchById(id);
//     const nextIn = Math.max(0, currIn + delta);
//     const nextResidue = Math.max(total - nextIn, 0);

//     dispatch(
//       updateBatchState({ id, cakes_in_batch: nextIn, cakes_residue: nextResidue })
//     );
//     dispatch(unlockButton({ id, isButtonLocked: nextResidue === 0 }));
//     setQuantityPallets((prev) => ({ ...prev, [id]: nextIn * 3 }));
//     setBatchOrderIDs((prev) => (prev.includes(id) ? prev : [...prev, id]));
//   };

//   const assignColorToId = (id) => {
//     if (idColorMap[id] !== undefined) return idColorMap[id];
//     const nextColor = Object.keys(idColorMap).length % 10;
//     setIdColorMap((prevMap) => ({ ...prevMap, [id]: nextColor }));
//     return nextColor;
//   };

//   const isEmpty = (c) => !c || c.id === null;

//   const compactRowInPlace = (flat, rowIndex) => {
//     const start = rowIndex * CELLS_PER_AUTOCLAVE;
//     const end = start + CELLS_PER_AUTOCLAVE;
//     const row = flat.slice(start, end);
//     const used = row.filter((c) => !isEmpty(c));
//     const pad = Array(CELLS_PER_AUTOCLAVE - used.length).fill({ ...EMPTY_CELL });
//     const compacted = used.concat(pad);
//     for (let i = 0; i < CELLS_PER_AUTOCLAVE; i++) flat[start + i] = compacted[i];
//   };

//   const addArrayAfterId = () => {
//     if (!selectedId || !selectedArticle) return;

//     const idToUse = pickSourceIdForAdd(selectedId);
//     const group = getGroupBySourceId(selectedId);
//     const density = group?.density || '';
//     const width = group?.width || '';

//     setAutoclave((prev) => {
//       const flat = cloneFlat(prev.flat());

//       const tail = [...flat]
//         .map((c, i) => (c.article === selectedArticle ? i : -1))
//         .filter((i) => i !== -1)
//         .pop();

//       const insertAt =
//         tail !== undefined ? tail + 1 : flat.findIndex((c) => c.id === null);

//       if (insertAt === -1) return prev;

//       flat.splice(insertAt, 0, {
//         id: idToUse,
//         density,
//         width,
//         article: selectedArticle,
//       });
//       flat.length = initialRowCount * CELLS_PER_AUTOCLAVE;

//       updateReduxForArticle(flat, selectedArticle);

//       return rebuildRows(flat);
//     });
//   };

//   const deleteArrayById = () => {
//     if (!selectedId) return;
//     const found = batchDesigner?.find((el) => el?.id === selectedId);
//     if (!found) return;
//     const productId = found.id;
//     const targetArticle = found.product_article;

//     setAutoclave((prev) => {
//       const flat = prev.flat();

//       const lastIndex = flat.map((el) => el.article).lastIndexOf(targetArticle);
//       if (lastIndex === -1) {
//         alert('Не найдено элементов с таким id');
//         return prev;
//       }
//       flat[lastIndex] = { ...EMPTY_CELL };

//       const rowIndex = Math.floor(lastIndex / CELLS_PER_AUTOCLAVE);
//       compactRowInPlace(flat, rowIndex);

//       for (let r = rowIndex; r < prev.length - 1; r++) {
//         const start = r * CELLS_PER_AUTOCLAVE;
//         const nextStart = (r + 1) * CELLS_PER_AUTOCLAVE;

//         const row = flat.slice(start, start + CELLS_PER_AUTOCLAVE);
//         const nextRow = flat.slice(nextStart, nextStart + CELLS_PER_AUTOCLAVE);

//         const emptyCount = row.filter(isEmpty).length;
//         if (emptyCount === 0) continue;

//         const toMove = nextRow.filter((c) => !isEmpty(c)).slice(0, emptyCount);
//         if (toMove.length === 0) continue;

//         for (let i = 0; i < toMove.length; i++) {
//           const indexInNext = flat.findIndex(
//             (c, idx) =>
//               idx >= nextStart &&
//               idx < nextStart + CELLS_PER_AUTOCLAVE &&
//               c.id === toMove[i].id
//           );
//           if (indexInNext !== -1) flat[indexInNext] = { ...EMPTY_CELL };
//         }

//         let insertPos = start;
//         for (const c of toMove) {
//           while (!isEmpty(flat[insertPos])) insertPos++;
//           flat[insertPos] = { ...c };
//         }

//         compactRowInPlace(flat, r);
//         compactRowInPlace(flat, r + 1);
//       }

//       const count = flat.filter((el) => el.id === selectedId).length;
//       const total = getTotalById(productId);
//       const cakes_residue = Math.max(total - count, 0);

//       dispatch(
//         updateBatchState({
//           id: productId,
//           cakes_in_batch: count,
//           cakes_residue: cakes_residue <= count ? 0 : cakes_residue - count,
//         })
//       );
//       dispatch(
//         unlockButton({ id: productId, isButtonLocked: cakes_residue <= count })
//       );

//       setQuantityPallets((prevQ) => ({ ...prevQ, [productId]: count * 3 }));
//       setBatchOrderIDs((prevIDs) =>
//         prevIDs.includes(productId) ? prevIDs : [...prevIDs, productId]
//       );

//       return rebuildRows(flat);
//     });
//   };

//   const deleteBatchById = () => {
//     if (!selectedId) return;

//     const found = batchDesigner?.find((el) => el.id === selectedId);
//     if (!found) return;

//     const targetArticle = found.product_article;

//     setAutoclave((prev) => {
//       const flat = prev.flat();
//       const capacity = prev.length * CELLS_PER_AUTOCLAVE;

//       const removedById = new Map();
//       const kept = [];

//       for (let i = 0; i < flat.length; i++) {
//         const cell = flat[i];
//         if (cell?.article === targetArticle) {
//           if (cell?.id != null) {
//             removedById.set(cell.id, (removedById.get(cell.id) || 0) + 1);
//           }
//         } else {
//           kept.push(cell);
//         }
//       }

//       while (kept.length < capacity) kept.push({ ...EMPTY_CELL });

//       for (const [id, removed] of removedById.entries()) {
//         bumpOne(id, -removed);
//       }

//       setBatchOrderIDs((prevIDs) => prevIDs.filter((x) => !removedById.has(x)));

//       setSelectedId(null);

//       const rows = [];
//       for (let r = 0; r < prev.length; r++) {
//         const from = r * CELLS_PER_AUTOCLAVE;
//         rows.push(kept.slice(from, from + CELLS_PER_AUTOCLAVE));
//       }
//       return rows;
//     });
//   };

//   const fillingAutoclave = () => {
//     if (!selectedArticle) return;

//     setAutoclave((prev) => {
//       const flat = cloneFlat(prev.flat());
//       const tail = [...flat]
//         .map((c, i) => (c.article === selectedArticle ? i : -1))
//         .filter((i) => i !== -1)
//         .pop();

//       if (tail === undefined) return prev;

//       const rowStart = tail - (tail % CELLS_PER_AUTOCLAVE);
//       const rowEnd = rowStart + CELLS_PER_AUTOCLAVE;

//       let pos = tail + 1;
//       while (pos < rowEnd) {
//         if (flat[pos].id === null) {
//           flat[pos] = { ...flat[tail] };
//           pos++;
//         } else {
//           let empty = -1;
//           for (let i = pos; i < rowEnd; i++) {
//             if (flat[i].id === null) {
//               empty = i;
//               break;
//             }
//           }
//           if (empty === -1) break;
//           for (let i = empty; i > pos; i--) flat[i] = flat[i - 1];
//           flat[pos] = { ...flat[tail] };
//           pos++;
//         }
//       }

//       updateReduxForArticle(flat, selectedArticle);

//       return rebuildRows(flat);
//     });
//   };

//   const moveBatchLater = () => {
//     if (!selectedArticle) return;

//     setAutoclave((prev) => {
//       const original = prev.flat().map((c) => (c ? { ...c } : { ...EMPTY_CELL }));

//       const group = [];
//       const withoutGroup = [];

//       for (const c of original) {
//         if (c.article === selectedArticle) {
//           group.push(c);
//         } else {
//           withoutGroup.push(c);
//         }
//       }

//       if (group.length === 0) return prev;

//       while (withoutGroup.length < original.length) {
//         withoutGroup.push({ ...EMPTY_CELL });
//       }

//       let lastUsed = -1;
//       for (let i = 0; i < withoutGroup.length; i++) {
//         if (withoutGroup[i].id !== null) lastUsed = i;
//       }

//       const freeAfter = withoutGroup.length - (lastUsed + 1);

//       if (freeAfter < group.length) {
//         alert('Недостаточно места чтобы переместить эту партию позже');
//         return prev;
//       }

//       const insertAt = lastUsed + 1;

//       const result = [
//         ...withoutGroup.slice(0, insertAt),
//         ...group,
//         ...withoutGroup.slice(insertAt, withoutGroup.length - group.length),
//       ];

//       return rebuildRows(result);
//     });
//   };

//   const onSaveHandler = async () => {
//     const filledCount = Array.isArray(autoclave)
//       ? autoclave.flat().filter((cell) => cell.id !== null).length
//       : 0;

//     if (filledCount === 0 || filledCount % CELLS_PER_AUTOCLAVE !== 0) {
//       alert('Please fill the autoclave completely');
//       return;
//     }

//     const { quantity, date, produced_autoclave } = autoclaveCalendarData;
//     const new_produced_autoclave =
//       produced_autoclave + filledCount / CELLS_PER_AUTOCLAVE;

//     const newDataCalendar = [
//       {
//         quantity,
//         date,
//         produced_autoclave: new_produced_autoclave,
//       },
//     ];

//     dispatch(addNewAutoclaveCalendar(newDataCalendar));

//     let positionInBatch = 1;
//     const batchPositions = [];

//     batchOrderIDs?.forEach((id) => {
//       const product = batchDesigner.find((p) => p.id === id);
//       if (product) {
//         batchPositions.push({
//           product,
//           positionInBatch,
//         });
//         positionInBatch += product.cakes_in_batch;
//       }
//     });

//     const mergedNewPositions = batchPositions.reduce((acc, current) => {
//       const lastItem = acc[acc.length - 1];
//       const currentProduct = current.product;

//       if (
//         lastItem &&
//         lastItem.product.product_article === currentProduct.product_article &&
//         lastItem.product.id_list_of_ordered_production !== null &&
//         currentProduct.id_list_of_ordered_production !== null
//       ) {
//         lastItem.product.cakes_in_batch += currentProduct.cakes_in_batch;
//         lastItem.product.free_product_package += currentProduct.free_product_package;
//         lastItem.product.total_cakes += currentProduct.total_cakes;
//       } else {
//         acc.push({
//           product: { ...currentProduct },
//           positionInBatch: current.positionInBatch,
//         });
//       }
//       return acc;
//     }, []);

//     mergedNewPositions.forEach((newPosition) => {
//       const { product } = newPosition;

//       const existingRecord = existingBatchOutside.find(
//         (record) =>
//           record.product_article === product.product_article && record.date === date
//       );

//       if (existingRecord) {
//         const quantity_total =
//           newPosition.product.id_list_of_ordered_production !== null
//             ? list_of_ordered_production?.find(
//                 (order) => order.id == newPosition.product.id
//               )
//             : 0;

//         const m3InArray = latestProducts?.find(
//           (p) => p.article == product.product_article
//         )?.m3InArray;
//         const volumeBlockOnPallet = latestProducts?.find(
//           (p) => p.article == product.product_article
//         )?.volumeBlockOnPallet;

//         const updatedRecord = {
//           ...existingRecord,
//           quantity_pallets:
//             existingRecord.quantity_pallets +
//             product.cakes_in_batch * Math.floor(m3InArray / volumeBlockOnPallet),
//           quantity_free:
//             newPosition.product.id_list_of_ordered_production !== null &&
//             newPosition.product.cakes_in_batch &&
//             newPosition.product.total_cakes &&
//             newPosition.product.free_product_package >= 0
//               ? Math.max(
//                   0,
//                   newPosition.product.cakes_in_batch *
//                     Math.floor(m3InArray / volumeBlockOnPallet) -
//                     quantity_total?.quantity
//                 )
//               : newPosition.product.id_list_of_ordered_production == null
//               ? newPosition.product.cakes_in_batch *
//                   Math.floor(m3InArray / volumeBlockOnPallet) +
//                 existingRecord?.quantity_free
//               : 0,
//           position_in_autoclave: newPosition.positionInBatch,
//           id_list_of_ordered_production:
//             newPosition.product.id_list_of_ordered_production !== null
//               ? newPosition.product.id
//               : null,
//         };
//         dispatch(updateBatchOutside(updatedRecord));
//       } else {
//         const quantity_total =
//           newPosition.product.id_list_of_ordered_production !== null
//             ? list_of_ordered_production?.find(
//                 (order) => order.id == newPosition.product.id
//               )
//             : 0;

//         const m3InArray = latestProducts?.find(
//           (p) => p.article == product.product_article
//         )?.m3InArray;
//         const volumeBlockOnPallet = latestProducts?.find(
//           (p) => p.article == product.product_article
//         )?.volumeBlockOnPallet;

//         const newBatchOutside = {
//           product_article: product.product_article,
//           quantity_pallets:
//             product.cakes_in_batch * Math.floor(m3InArray / volumeBlockOnPallet),
//           quantity_free:
//             newPosition?.product?.id_list_of_ordered_production !== null &&
//             newPosition?.product?.cakes_in_batch &&
//             newPosition?.product?.total_cakes &&
//             newPosition?.product?.free_product_package >= 0
//               ? Math.max(
//                   0,
//                   newPosition.product.cakes_in_batch *
//                     Math.floor(m3InArray / volumeBlockOnPallet) -
//                     quantity_total?.quantity
//                 )
//               : newPosition.product.id_list_of_ordered_production == null
//               ? newPosition.product.cakes_in_batch *
//                   Math.floor(m3InArray / volumeBlockOnPallet) +
//                 existingRecord?.quantity_free
//               : 0,
//           position_in_autoclave: newPosition.positionInBatch,
//           id_list_of_ordered_production:
//             newPosition.product.id_list_of_ordered_production !== null
//               ? newPosition.product.id
//               : null,
//           date: date,
//         };
//         dispatch(addNewBatchOutside(newBatchOutside));
//       }
//     });

//     setBatchOrderIDs([]);

//     // let positionInBatch = 1;
//     // let batchPositions = [];

//     // batchOrderIDs?.forEach((id) => {
//     //   const product = batchDesigner.find((p) => p.id === id);
//     //   if (product) {
//     //     batchPositions.push({
//     //       product,
//     //       positionInBatch,
//     //     });
//     //     positionInBatch += product.cakes_in_batch;
//     //   }
//     // });

//     // const mergedBatchPositions = batchPositions.reduce((acc, current) => {
//     //   const lastItem = acc[acc.length - 1];
//     //   if (
//     //     lastItem &&
//     //     lastItem.product.product_article === current.product.product_article &&
//     //     lastItem.product.id_list_of_ordered_production !== null &&
//     //     current.product.id_list_of_ordered_production !== null
//     //   ) {
//     //     lastItem.product.cakes_in_batch += current.product.cakes_in_batch;
//     //     lastItem.product.free_product_package +=
//     //       current.product.free_product_package;
//     //     lastItem.product.total_cakes += current.product.total_cakes;
//     //   } else {
//     //     acc.push({
//     //       product: { ...current.product },
//     //       positionInBatch: current.positionInBatch,
//     //     });
//     //   }
//     //   return acc;
//     // }, []);

//     // mergedBatchPositions.forEach((position) => {
//     //   dispatch(
//     //     addNewBatchOutside({
//     //       product_article: position.product.product_article,
//     //       quantity_pallets: position.product.cakes_in_batch * 3,
//     // quantity_free:
//     //   position.product.id_list_of_ordered_production !== null &&
//     //   position.product.cakes_in_batch &&
//     //   position.product.total_cakes &&
//     //   position.product.free_product_package >= 0
//     //     ? (position.product.cakes_in_batch - position.product.total_cakes) *
//     //         3 +
//     //       position.product.free_product_package
//     //     : position.product.id_list_of_ordered_production == null
//     //     ? position.product.cakes_in_batch * 3
//     //     : null,
//     //       position_in_autoclave: position.positionInBatch,
//     //       id_list_of_ordered_production:
//     //         position.product.id_list_of_ordered_production !== null
//     //           ? position.product.id
//     //           : null,
//     //       date: '',
//     //     })
//     //   );
//     // });
//     // setBatchOrderIDs([]);
//   };

//   // const onSaveHandler = () => {
//   //   console.log('batch', batchDesigner);
//   // };

//   useEffect(() => {
//     setAutoclave(acData);
//     setInitialRowCount(Array.isArray(acData) ? acData.length : 0);
//   }, [acData, setAutoclave]);

//   useEffect(() => {
//     setBatchOrderIDs([]);
//   }, [setBatchOrderIDs]);

//   return (
//     <div>
//       <div className="autoclave-container">
//         {autoclave?.map((autoclaveRow, rowIndex) => (
//           <div key={rowIndex} className="autoclave-row">
//             <h3 className="autoclave-header">Автоклав {rowIndex + 1}</h3>
//             {autoclaveRow?.map((el, cellIndex) => (
//               <div
//                 key={cellIndex}
//                 className={`autoclave-cell ${getClassForAutoclave(
//                   assignColorToId(el?.id)
//                 )}`}
//                 onClick={() => {
//                   setSelectedId(el?.id);
//                   articleHandler(el?.id);
//                 }}
//               >
//                 {el.id !== null ? `${el.density}x${el.width}` : ''}
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>

//       <div className="autoclave-buttons-container">
//         {selectedArticle && <div>Выбран массив с article: {selectedArticle}</div>}
//         <button onClick={deleteBatchById}>Удалить партию</button>
//         <button onClick={deleteArrayById}>Удалить Массив</button>
//         <button onClick={addArrayAfterId}>Добавить массив</button>
//         <button onClick={moveBatchLater}>Поставить партию позже</button>
//         <button onClick={fillingAutoclave}>Заполнить Автоклав</button>
//         <button onClick={onSaveHandler}>Save</button>
//       </div>
//     </div>
//   );
// }

// export default Autoclave;

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
import { updateOrderToWarehouse } from '#components/redux/actions/orderToWarehouseAction.js';
import { addNewAutoclaveCalendar } from '#components/redux/actions/warehouseAction.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const CELLS_PER_AUTOCLAVE = 21;
const EMPTY_CELL = { id: null, density: '', width: '', article: '' };

function Autoclave({ acData, autoclaveCalendarData }) {
  const dispatch = useDispatch();
  const {
    setAutoclave,
    setQuantityPallets,
    autoclave,
    setBatchOrderIDs,
    productionBatchDesigner,
  } = useOrderContext();
  const { latestProducts } = useProductsContext();

  const batchDesigner = useSelector((state) => state.batchDesigner) || [];
  const existingBatchOutside = useSelector((state) => state.batchOutside) || [];
  const list_of_ordered_production = useSelector(
    (state) => state.listOfOrderedProduction,
  );

  const [selectedCell, setSelectedCell] = useState(null); // { id, article }
  const [idColorMap, setIdColorMap] = useState({});
  const [initialRowCount, setInitialRowCount] = useState(0);

  // чтобы не пересинхронизировать всё зря при первом setAutoclave(acData)
  const didInitRef = useRef(false);

  // ---------- UI helpers ----------
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
    if (id == null) return 0;
    if (idColorMap[id] !== undefined) return idColorMap[id];
    const nextColor = Object.keys(idColorMap).length % 10;
    setIdColorMap((prevMap) => ({ ...prevMap, [id]: nextColor }));
    return nextColor;
  };

  // ---------- data helpers ----------
  const isEmpty = (c) => !c || c.id === null;

  const toFlat = (rows) => {
    const flat = Array.isArray(rows) ? rows.flat() : [];
    // глубокая нормализация ячеек (чтобы не мутировать старые ссылки)
    return flat.map((c) => {
      if (!c || c.id == null) return { ...EMPTY_CELL };
      return {
        id: c.id ?? null,
        density: c.density ?? '',
        width: c.width ?? '',
        article: c.article ?? '',
      };
    });
  };

  useEffect(() => {
    console.log(batchDesigner, 'batchDesigner Autoclave.jsx line 804');
  }, [batchDesigner]);

  const rebuildRows = (flat) => {
    const capacity = initialRowCount * CELLS_PER_AUTOCLAVE;
    const outFlat = flat.slice(0, capacity);
    while (outFlat.length < capacity) outFlat.push({ ...EMPTY_CELL });

    const out = [];
    for (let i = 0; i < capacity; i += CELLS_PER_AUTOCLAVE) {
      out.push(outFlat.slice(i, i + CELLS_PER_AUTOCLAVE));
    }
    return out;
  };

  const shipTs = (id) => {
    const o = (list_of_ordered_production || []).find(
      (x) => String(x.id) === String(id),
    );
    const d =
      o?.date_of_dispatch || o?.date_of_shipping || o?.shipment_date || o?.date;
    return d ? new Date(d).getTime() : 0;
  };

  const getGroupBySourceId = (id) =>
    (productionBatchDesigner || []).find((g) =>
      (g.sources || []).some((s) => String(s.id) === String(id)),
    );

  const getGroupIds = (id) =>
    (getGroupBySourceId(id)?.sources || []).map((s) => s.id);

  const getResidueById = (id) => {
    const r = (batchDesigner || []).find(
      (b) => String(b.id) === String(id),
    )?.cakes_residue;
    return Number(r) || 0;
  };

  const pickSourceIdForAdd = (preferId) => {
    const ids = getGroupIds(preferId);
    if (!ids.length) return preferId ?? null;

    const hasUnplaced = ids.some((sid) => getResidueById(sid) > 0);
    const ascByDate = [...ids].sort((a, b) => shipTs(a) - shipTs(b));

    if (hasUnplaced) {
      for (const sid of ascByDate) if (getResidueById(sid) > 0) return sid;
      return ascByDate[0];
    }
    // если всё уже размещено — добавляем к последнему по отгрузке
    return ascByDate[ascByDate.length - 1];
  };

  // ---------- ONE SOURCE OF TRUTH SYNC ----------
  const syncFromAutoclave = (rows) => {
    const flat = toFlat(rows);

    console.log(flat, 'flat Autoclave.jsx line 863');

    // counts per source id (реальные id из list_of_ordered_production)
    const counts = new Map();
    for (const c of flat) {
      if (!c || c.id == null) continue;
      counts.set(c.id, (counts.get(c.id) || 0) + 1);
    }

    console.log(counts, 'counts Autoclave.jsx line 872');

    // обновляем Redux и контекстные derived-значения
    // 1) batchDesigner по каждому id: cakes_in_batch + residue + lock
    for (const b of batchDesigner) {
      console.log(b, 'b Autoclave.jsx line 873');
      const id = b.id;
      const inBatch = counts.get(id) || 0;
      // const inBatch = !b.id_ordered_product_to_warehouse
      //   ? counts.get(id) || 0
      //   : b.cakes_in_batch;
      const total = Number(b.total_cakes ?? 0);
      const residue = Math.max(total - inBatch, 0);

      dispatch(
        updateBatchState({
          id,
          cakes_in_batch: inBatch,
          cakes_residue: residue,
        }),
      );
      dispatch(unlockButton({ id, isButtonLocked: residue === 0 }));
    }

    // 2) quantityPallets + batchOrderIDs
    const ids = Array.from(counts.keys());

    setQuantityPallets((prev) => {
      const next = { ...(prev || {}) };
      // проставим только актуальные id
      for (const id of ids) next[id] = (counts.get(id) || 0) * 3;

      // по желанию можно чистить отсутствующие id:
      // for (const k of Object.keys(next)) if (!counts.has(Number(k))) delete next[k];

      return next;
    });

    setBatchOrderIDs(ids);
  };

  const didInitFromPropsRef = useRef(false);

  useEffect(() => {
    const isEmptyNow =
      !Array.isArray(autoclave) ||
      autoclave.length === 0 ||
      autoclave.flat().every((c) => !c || c.id == null);

    if (didInitFromPropsRef.current && !isEmptyNow) return;

    setAutoclave(acData);
    setInitialRowCount(Array.isArray(acData) ? acData.length : 0);

    didInitFromPropsRef.current = true;
    didInitRef.current = true;
  }, [acData]);

  useEffect(() => {
    if (!didInitRef.current) return;
    if (!Array.isArray(autoclave) || autoclave.length === 0) return;
    if (initialRowCount === 0) return;

    syncFromAutoclave(autoclave);
  }, [autoclave, initialRowCount]);

  const addArrayAfterSelected = () => {
    if (!selectedCell?.article || !selectedCell?.id) return;

    const preferId = selectedCell.id;
    const idToUse = pickSourceIdForAdd(preferId);

    // density/width лучше брать из products (чтобы не было undefined)
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
        alert('Нет свободного места');
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
  };

  const deleteOneArrayOfSelected = () => {
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
  };

  const deleteBatchBySelectedArticle = () => {
    if (!selectedCell?.article) return;

    setAutoclave((prev) => {
      const flat = toFlat(prev);
      const capacity = initialRowCount * CELLS_PER_AUTOCLAVE;

      const kept = flat.filter((c) => c.article !== selectedCell.article);
      while (kept.length < capacity) kept.push({ ...EMPTY_CELL });

      setSelectedCell(null);
      return rebuildRows(kept);
    });
  };

  const fillToRowEnd = () => {
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
  };

  const moveBatchLater = () => {
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
        alert('Недостаточно места чтобы переместить эту партию позже');
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
  };

  const clearAutoclaves = () => {
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
  };

  const saveOnServer = (filledCount) => {
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
        Math.floor(Number(m3InArray || 0) / Number(volumeBlockOnPallet || 1)) ||
          1,
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
      dispatch(
        updateOrderToWarehouse({
          id: newPosition.product.id_ordered_product_to_warehouse,
          quantity_allocated: product.cakes_in_batch * palletsPerArray,
        }),
      );
    });

    setSelectedCell(null);
    clearAutoclaves();
  };

  const onSaveHandler = async () => {
    const filledCount = Array.isArray(autoclave)
      ? autoclave.flat().filter((cell) => cell?.id !== null).length
      : 0;

    const isAutoclaveInvalid =
      filledCount === 0 || filledCount % CELLS_PER_AUTOCLAVE !== 0;

    if (isAutoclaveInvalid) {
      const override = window.confirm(
        'Autoclave is not fully filled. Override with password?',
      );

      if (!override) return;

      const password = prompt('Enter autoclave password:');
      if (!password) {
        alert('Password is required');
        return;
      }

      if (password !== process.env.REACT_APP_PASSWORD_FOR_AUTOCLAVE) {
        alert('Wrong password', process.env.REACT_APP_PASSWORD_FOR_AUTOCLAVE);
        return;
      }
      saveOnServer(filledCount);
    } else {
      saveOnServer(filledCount);
    }
  };

  const selectedLabel = useMemo(() => {
    if (!selectedCell?.article) return null;
    return `Выбран массив с article: ${selectedCell.article}`;
  }, [selectedCell]);

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
                  assignColorToId(el?.id),
                )}`}
                onClick={() => {
                  if (!el) return;
                  setSelectedCell({
                    id: el?.id ?? null,
                    article: el?.article ?? '',
                    density: el?.density ?? '',
                    width: el?.width ?? '',
                  });
                }}
              >
                {el?.id !== null ? `${el.density}x${el.width}` : ''}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="autoclave-buttons-container">
        {selectedLabel && <div>{selectedLabel}</div>}

        <button
          onClick={deleteBatchBySelectedArticle}
          disabled={!selectedCell?.article}
        >
          Удалить партию
        </button>

        <button
          onClick={deleteOneArrayOfSelected}
          disabled={!selectedCell?.article}
        >
          Удалить Массив
        </button>

        <button
          onClick={addArrayAfterSelected}
          disabled={!selectedCell?.article || !selectedCell?.id}
        >
          Добавить массив
        </button>

        <button onClick={moveBatchLater} disabled={!selectedCell?.article}>
          Поставить партию позже
        </button>

        <button
          onClick={fillToRowEnd}
          disabled={!selectedCell?.article || !selectedCell?.id}
        >
          Заполнить Автоклав
        </button>

        <button onClick={onSaveHandler}>Save</button>
      </div>
    </div>
  );
}

export default Autoclave;
