import ModalTable from '#components/Table/ModalTable.jsx';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import {
  addBatchState,
  unlockButton,
  updateBatchState,
} from '#components/redux/actions/batchDesignerAction.js';
import Autoclave from './Autoclave';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function ProductionBatchDesignerNew() {
  const dispatch = useDispatch();

  const { latestProducts } = useProductsContext();
  const { listOfOrderedCakes, autoclave_calendar } = useWarehouseContext();
  const {
    autoclave,
    setAutoclave,
    setQuantityPallets,
    productionBatchDesigner,
    setProductonBatchDesigner,
    setBatchOrderIDs,
  } = useOrderContext();
  const { productBatchModal, setProductBatchModal } = useModalContext();

  const batchDesigner = useSelector((state) => state.batchDesigner);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [currId, setCurrId] = useState(null);
  const [currArticle, setCurrArticle] = useState(null);
  const [acData, setAcData] = useState([]);
  const [batchFromBD, setBatchFromBD] = useState([]);
  const [autoclaveCount, setAutoclaveCount] = useState(0);
  const [autoclaveCalendarData, setAutoclaveCalendarData] = useState(0);

  const formatISO = (s) => {
    if (!s) return '—';
    // s в формате 'YYYY-MM-DD'
    const [y, m, d] = s.split('-').map(Number);
    const dt = new Date(y, (m || 1) - 1, d || 1);
    return dt.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  useEffect(() => {
    if (!Array.isArray(autoclave_calendar)) return;

    const today = new Date().toISOString().slice(0, 10);

    // Поддержим возможную опечатку "quantity" (как в вашем примере) и корректное "quantity"
    const nearest = autoclave_calendar
      .map((x) => ({
        ...x,
        qty: Number(x.quantity ?? 0),
        done: Number(x.quantity_of_complited ?? 0),
      }))
      .map((x) => ({ ...x, value: x.qty - x.done }))
      .filter((x) => x.value > 0 && typeof x.date === 'string' && x.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))[0];

    if (nearest && nearest.value > 0) {
      setAutoclaveCount(nearest.value);
      setAutoclaveCalendarData(nearest);
    } else {
      setAutoclaveCount(0);
    }
  }, [autoclave_calendar]);

  let countRef = useRef(0);
  const MAX_QUANTITY = 10405;
  const emptyAutoclave = useMemo(
    () =>
      Array.from({ length: autoclaveCount * 21 }, () => ({
        id_list_of_ordered_production: null,
        status: 0,
        quallty_check: 0,
      })),
    [autoclaveCount]
  );

  const headers = useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Product Article', accessor: 'product_article' },
      { Header: 'Ширина, мм', accessor: 'width' },
      { Header: 'Количество, паллет', accessor: 'quantity' },
      { Header: 'Продукт + Брак, массивов', accessor: 'product_with_brack' },
      { Header: 'Кол-во, м³', accessor: 'quantity_m3' },
      { Header: 'Свободная продукция, массив', accessor: 'free_product_cakes' },
      { Header: 'Свободная продукция, паллет', accessor: 'free_product_package' },
      { Header: 'Итоговое кол-во, массив', accessor: 'total_cakes' },
      { Header: 'Размещено, массив', accessor: 'cakes_in_batch' },
      { Header: 'Осталось разместить, массив', accessor: 'cakes_residue' },
    ],
    []
  );

  const addProductHandler = (prod_data) => {
    const { article, density, width } = prod_data;

    const maxId =
      (batchDesigner.reduce((max, item) => (item.id > max ? item.id : max), 0) ||
        0) + 1;

    setAutoclave((prevAutoclave) => {
      const flat = prevAutoclave.flat();

      const emptyIndex = flat.findIndex((cell) => !cell || cell.id === null);
      if (emptyIndex === -1) {
        alert('No free slots available in autoclaves');
        return prevAutoclave;
      }

      flat[emptyIndex] = { id: maxId, density, width };

      const countForThisId = flat.filter((c) => c && c.id === maxId).length;

      dispatch(
        addBatchState({
          id: maxId,
          id_list_of_ordered_production: null,
          product_article: article,
          cakes_in_batch: 1,
          cakes_residue: 0,
          total_cakes: 1,
        })
      );

      setQuantityPallets((prev) => ({ ...prev, [maxId]: countForThisId * 3 }));
      setBatchOrderIDs((prev) => (prev.includes(maxId) ? prev : [...prev, maxId]));

      const rows = [];
      const rowCount = prevAutoclave.length;
      const CELLS_PER_AUTOCLAVE = 21;
      for (let r = 0; r < rowCount; r++) {
        const from = r * CELLS_PER_AUTOCLAVE;
        rows.push(flat.slice(from, from + CELLS_PER_AUTOCLAVE));
      }
      return rows;
    });

    setBatchFromBD((prev) => [
      ...prev,
      {
        id: maxId,
        id_list_of_ordered_production: null,
        product_article: article,
        cakes_in_batch: 1,
        cakes_residue: 0,
      },
    ]);
  };

  // const handleAddOnAutoclave = (row) => {
  //   setCurrId(row.id);
  // };

  const handleAddOnAutoclave = (row) => {
    setCurrId(row.id); // как было
    setCurrArticle(row.product_article); // НОВОЕ
  };

  const distributeToSources = (sources, amount, onEachUpdate) => {
    let remaining = amount;
    const out = sources.map((s) => ({ ...s }));

    for (const s of out) {
      if (remaining <= 0) break;
      const residue =
        s.cakes_residue ??
        Math.max((s.total_cakes || 0) - (s.cakes_in_batch || 0), 0);
      const take = Math.min(residue, remaining);
      if (take <= 0) continue;

      s.cakes_in_batch = (s.cakes_in_batch || 0) + take;
      s.cakes_residue = Math.max(residue - take, 0);
      remaining -= take;

      onEachUpdate?.(s, take); // можно диспатчить прямо здесь
    }

    return { sources: out, placed: amount - remaining, leftover: remaining };
  };

  const addCakesData = useCallback(
    (prodBatchData) => {
      const { id, product_with_brack, article } = prodBatchData;

      const free_product_cakes = (
        Math.ceil(product_with_brack) - product_with_brack
      ).toFixed(2);
      const free_product_package = Math.floor(free_product_cakes * 3);

      const total_cakes = Math.ceil(product_with_brack);

      // ищем запись в batchDesigner ровно один раз
      const existing = batchDesigner.find((el) => el.id === id);

      // если записи нет — считаем, что размещено 0
      const cakes_in_batch = existing?.cakes_in_batch ?? 0;

      // если есть готовое значение — берём его, иначе считаем от total_cakes
      const cakes_residue =
        existing?.cakes_residue ?? Math.max(total_cakes - cakes_in_batch, 0);

      const updatedProdBatch = {
        ...prodBatchData,
        free_product_cakes,
        free_product_package,
        total_cakes,
        cakes_in_batch,
        cakes_residue,
      };

      setBatchFromBD((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === id);

        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            id,
            cakes_in_batch: 0,
            cakes_residue: total_cakes,
          };
          return updated;
        }

        return [...prev, { id, cakes_in_batch: 0, cakes_residue: total_cakes }];
      });

      const existingBatch = batchDesigner?.find((el) => el?.id === id);

      if (!existingBatch) {
        dispatch(
          addBatchState({
            id: prodBatchData.id,
            product_article: article,
            cakes_in_batch,
            cakes_residue,
            free_product_package,
            total_cakes,
          })
        );
      }

      if (cakes_in_batch > 0) {
        dispatch(
          unlockButton({
            id: prodBatchData.id,
            isButtonLocked: cakes_residue === 0,
          })
        );
      }

      return updatedProdBatch;
    },
    [emptyAutoclave, batchDesigner]
  );

  const transformAutoclaveData = (tAutoclave, prodBatchDesigner) => {
    if (!tAutoclave || !prodBatchDesigner) return [];

    const transformedAutoclave = tAutoclave.map((unit) => {
      const batch = prodBatchDesigner.find((prod) => {
        return prod.id === unit.id_list_of_ordered_production;
      });

      if (!batch)
        return {
          id: null,
          density: '',
          width: '',
        };

      return {
        id: batch.id,
        density: batch.density,
        width: batch.width,
      };
    });

    return transformedAutoclave.filter((item) => item !== null);
  };

  useEffect(() => {
    if (!latestProducts || !listOfOrderedCakes) return;

    const rightListOfOrdered = listOfOrderedCakes.filter(
      (el) =>
        el.quantity !== el.quantity_in_warehouse &&
        el.quantity > el.quantity_in_batch * 3 + el.quantity_in_warehouse
    );

    const groupedByArticle = rightListOfOrdered.reduce((acc, curr) => {
      if (!acc[curr.product_article]) {
        acc[curr.product_article] = [];
      }
      acc[curr.product_article].push({ ...curr });
      return acc;
    }, {});

    const prodBatch = [];
    let updatedTotalQuantity = totalQuantity;

    Object.keys(groupedByArticle).forEach((densityKey) => {
      const group = groupedByArticle[densityKey];
      group.forEach(({ id, quantity, product_article, quantity_in_warehouse }) => {
        const product = latestProducts.find((el) => el.article == product_article);
        const {
          volumeBlockOnPallet,
          density,
          normOfBrack,
          width,
          article,
          m3InArray,
        } = product;

        if (updatedTotalQuantity + quantity <= MAX_QUANTITY) {
          const rightQuantity = quantity - quantity_in_warehouse;
          const quantity_m3 = (rightQuantity * volumeBlockOnPallet).toFixed(2);

          const batch = addCakesData({
            id,
            product_article,
            width,
            density,
            quantity: rightQuantity,
            product_with_brack: (
              quantity / Math.floor(m3InArray / volumeBlockOnPallet) +
              normOfBrack
            ).toFixed(2),
            quantity_m3,
            article,
          });
          prodBatch.push(batch);
          updatedTotalQuantity += rightQuantity;
        }
      });
    });

    // 🔹 объединяем одинаковые артикулы и суммируем поля + запоминаем исходные заказы
    const mergedMap = prodBatch.reduce((acc, item) => {
      const key = item.product_article;
      if (!acc[key]) {
        acc[key] = {
          ...item,
          sources: [
            {
              id: item.id,
              total_cakes: Number(item.total_cakes) || 0,
              cakes_in_batch: Number(item.cakes_in_batch) || 0,
              cakes_residue: Number(item.cakes_residue) || 0,
            },
          ],
        };
      } else {
        acc[key].quantity =
          (Number(acc[key].quantity) || 0) + (Number(item.quantity) || 0);
        acc[key].product_with_brack =
          (Number(acc[key].product_with_brack) || 0) +
          (Number(item.product_with_brack) || 0);
        acc[key].quantity_m3 = (
          (Number(acc[key].quantity_m3) || 0) + (Number(item.quantity_m3) || 0)
        ).toFixed(2);
        acc[key].free_product_cakes =
          (Number(acc[key].free_product_cakes) || 0) +
          (Number(item.free_product_cakes) || 0);
        acc[key].free_product_package =
          (Number(acc[key].free_product_package) || 0) +
          (Number(item.free_product_package) || 0);
        acc[key].total_cakes =
          (Number(acc[key].total_cakes) || 0) + (Number(item.total_cakes) || 0);
        acc[key].cakes_in_batch =
          (Number(acc[key].cakes_in_batch) || 0) +
          (Number(item.cakes_in_batch) || 0);
        acc[key].cakes_residue =
          (Number(acc[key].cakes_residue) || 0) + (Number(item.cakes_residue) || 0);

        acc[key].sources.push({
          id: item.id,
          total_cakes: Number(item.total_cakes) || 0,
          cakes_in_batch: Number(item.cakes_in_batch) || 0,
          cakes_residue: Number(item.cakes_residue) || 0,
        });
      }
      return acc;
    }, {});

    const merged = Object.values(mergedMap);

    // можно оставить перенумерацию для UI
    const reindexed = merged.map((item, index) => ({ ...item, id: index + 1 }));
    setProductonBatchDesigner(reindexed);

    // setProductonBatchDesigner(prodBatch);
    setTotalQuantity(updatedTotalQuantity);

    const updatedAutoclaveData = transformAutoclaveData(emptyAutoclave, prodBatch);

    const filledAutoclave = [];
    for (let i = 0; i < updatedAutoclaveData.length; i += 21) {
      filledAutoclave.push(updatedAutoclaveData.slice(i, i + 21));
    }

    setAcData(filledAutoclave);
  }, [latestProducts, listOfOrderedCakes, emptyAutoclave]);

  // useEffect(() => {
  //   if (currId === null) return;

  //   setAutoclave((prevAutoclave) => {
  //     // копируем матрицу без изменения размеров
  //     const updatedAutoclave = prevAutoclave.map((row) => [...row]);
  //     const flat = updatedAutoclave.flat();

  //     const row = productionBatchDesigner.find((r) => r.id === currId);
  //     if (!row) {
  //       countRef.current = 0;
  //       return prevAutoclave;
  //     }

  //     const { id, density, width, cakes_residue } = row;

  //     // считаем доступную вместимость (пустые ячейки) ВНУТРИ УЖЕ СОЗДАННЫХ автоклавов
  //     const freeSpaces = flat.filter((cell) => !cell?.id).length;
  //     if (freeSpaces === 0) {
  //       alert('No free slots available in autoclaves'); // нет места вообще
  //       countRef.current = 0;
  //       return prevAutoclave;
  //     }

  //     // сколько нужно положить
  //     const required = Number(cakes_residue) || 0;
  //     // кладём ровно столько, сколько помещается
  //     const toPlace = Math.min(required, freeSpaces);

  //     // если не всё поместилось — предупредим
  //     if (toPlace < required) {
  //       alert(`Not enough autoclave capacity: placed ${toPlace} of ${required}.`);
  //     }

  //     // размещаем «слева направо, сверху вниз», не создавая новых рядов
  //     let placed = 0;
  //     for (let i = 0; i < updatedAutoclave.length && placed < toPlace; i++) {
  //       for (let j = 0; j < updatedAutoclave[i].length && placed < toPlace; j++) {
  //         if (!updatedAutoclave[i][j]?.id) {
  //           updatedAutoclave[i][j] = { id, density, width };
  //           placed++;
  //         }
  //       }
  //     }

  //     countRef.current = placed; // столько реально положили (второй эффект это использует)
  //     return updatedAutoclave;
  //   });
  // }, [currId]);

  useEffect(() => {
    if (currId === null) return;

    setAutoclave((prevAutoclave) => {
      // плоский список свободных слотов (индексы) внутри текущей матрицы автоклава
      const rows = prevAutoclave.map((r) => [...r]);
      const flat = rows.flat();
      const freeIdx = [];
      for (let i = 0; i < flat.length; i++) {
        if (!flat[i]?.id) freeIdx.push(i);
      }
      if (freeIdx.length === 0) {
        alert('No free slots available in autoclaves');
        countRef.current = 0;
        return prevAutoclave;
      }

      // агрегированная строка + источники
      const groupRow = productionBatchDesigner.find((r) => r.id === currId);
      if (!groupRow) {
        countRef.current = 0;
        return prevAutoclave;
      }
      const { density, width, cakes_residue, sources = [] } = groupRow;

      let remaining = Math.min(Number(cakes_residue) || 0, freeIdx.length);
      let placed = 0;
      let cursor = 0; // указывает на следующий свободный индекс в freeIdx

      // раскладываем по источникам: каждому кладём min(residue, remaining)
      for (const s of sources) {
        if (remaining <= 0) break;
        const sResidue = Math.max(
          (Number(s.total_cakes) || 0) - (Number(s.cakes_in_batch) || 0),
          Number(s.cakes_residue) || 0
        );
        const take = Math.min(sResidue, remaining);
        for (let k = 0; k < take; k++) {
          const idx = freeIdx[cursor++];
          flat[idx] = { id: s.id, density, width }; // КЛАДЁМ РЕАЛЬНЫЙ id ИЗ ИСТОЧНИКА
        }
        placed += take;
        remaining -= take;
      }

      // собираем обратно тем же размером (по 21 в ряд)
      const CELLS_PER_AUTOCLAVE = 21;
      const out = [];
      for (let i = 0; i < rows.length; i++) {
        const from = i * CELLS_PER_AUTOCLAVE;
        out.push(flat.slice(from, from + CELLS_PER_AUTOCLAVE));
      }
      countRef.current = placed;
      return out;
    });
  }, [currId]);

  useEffect(() => {
    if (autoclave.length === 0) return;

    setProductonBatchDesigner((prev) =>
      prev.map((item) => {
        const sameArticle = batchDesigner.filter(
          (b) => b.product_article === item.product_article
        );
        if (sameArticle.length === 0) return item;

        const sumInBatch = sameArticle.reduce(
          (acc, b) => acc + (Number(b.cakes_in_batch) || 0),
          0
        );
        const sumResidue = sameArticle.reduce(
          (acc, b) => acc + (Number(b.cakes_residue) || 0),
          0
        );

        const deltaCakes = sumInBatch - (Number(item.cakes_in_batch) || 0);
        const new_free_product_package =
          deltaCakes > 0
            ? (Number(item.free_product_package) || 0) + deltaCakes * 3
            : item.free_product_package;

        return {
          ...item,
          free_product_package: new_free_product_package,
          cakes_in_batch: sumInBatch,
          cakes_residue: sumResidue,
        };
      })
    );
  }, [batchDesigner]);

  // useEffect(() => {
  //   const currentCount =
  //     countRef.current === 0
  //       ? batchDesigner.find((el) => el.product_article === currId)?.cakes_residue ??
  //         0
  //       : countRef.current;

  //   setProductonBatchDesigner((prevBatch) => {
  //     let hasChanges = false;

  //     const updatedBatch = prevBatch.map((batchItem) => {
  //       if (batchItem.product_article === currId) {
  //         const { cakes_residue, cakes_in_batch, id } = batchItem;

  //         const new_cakes_in_batch = cakes_in_batch + currentCount;
  //         const new_cakes_residue = Math.max(cakes_residue - currentCount, 0);

  //         if (
  //           cakes_residue !== new_cakes_residue ||
  //           cakes_in_batch !== new_cakes_in_batch
  //         ) {
  //           hasChanges = true;
  //         }

  //         dispatch(
  //           updateBatchState({
  //             id,
  //             cakes_in_batch: new_cakes_in_batch,
  //             cakes_residue: new_cakes_residue,
  //           })
  //         );

  //         dispatch(
  //           unlockButton({
  //             id,
  //             isButtonLocked: new_cakes_residue === 0,
  //           })
  //         );

  //         setQuantityPallets((prev) => ({
  //           ...prev,
  //           [id]: new_cakes_in_batch * 3,
  //         }));

  //         setBatchOrderIDs((prev) => (prev.includes(id) ? prev : [...prev, id]));

  //         return {
  //           ...batchItem,
  //           cakes_in_batch: new_cakes_in_batch,
  //           cakes_residue: new_cakes_residue,
  //         };
  //       }
  //       return batchItem;
  //     });

  //     return hasChanges ? updatedBatch : prevBatch;
  //   });

  //   countRef.current = 0;
  //   setCurrId(null);
  // }, [currId]);

  useEffect(() => {
    if (currId === null) return;

    const currentCount =
      countRef.current === 0
        ? batchDesigner.find((el) => el.id === currId)?.cakes_residue ?? 0
        : countRef.current;

    // найдём строку-агрегат по currId
    const groupRow = productionBatchDesigner.find((r) => r.id === currId);
    const sources = groupRow?.sources || [];

    // распределяем по исходным заказам
    const { sources: newSources, placed } = distributeToSources(
      sources,
      currentCount,
      (s /* updated source */) => {
        // обновляем стор по КАЖДОМУ исходному заказу
        dispatch(
          updateBatchState({
            id: s.id,
            cakes_in_batch: s.cakes_in_batch,
            cakes_residue: s.cakes_residue,
          })
        );
        dispatch(unlockButton({ id: s.id, isButtonLocked: s.cakes_residue === 0 }));
        setQuantityPallets((prev) => ({
          ...prev,
          [s.id]: (s.cakes_in_batch || 0) * 3,
        }));
        setBatchOrderIDs((prev) => (prev.includes(s.id) ? prev : [...prev, s.id]));
      }
    );

    // моментально обновим агрегированную строку в таблице (для отзывчивости UI)
    setProductonBatchDesigner((prev) =>
      prev.map((item) => {
        if (item.id !== currId) return item;
        return {
          ...item,
          cakes_in_batch: (item.cakes_in_batch || 0) + placed,
          cakes_residue: Math.max((item.cakes_residue || 0) - placed, 0),
          sources: newSources,
        };
      })
    );

    countRef.current = 0;
    setCurrId(null);
  }, [currId]);

  const renderGroupedRows = useCallback(() => {
    let currentArticle = null;

    return productionBatchDesigner.flatMap((row, index) => {
      const rows = [];

      if (currentArticle !== row.product_article) {
        currentArticle = row.product_article;
        rows.push(
          <tr key={`group-${currentArticle}`} className="group-row">
            <td colSpan="14">Product: {currentArticle}</td>
          </tr>
        );
      }

      rows.push(
        <tr key={`row-${row.id}`}>
          {headers.map(({ accessor }) => {
            return <td key={accessor}>{row[accessor]}</td>;
          })}
          <td>
            {/* <button
              onClick={() => handleAddOnAutoclave(row)}
              disabled={
                batchDesigner?.find((el) => el.id === row.id)?.isButtonLocked
              }
            >
              Разместить
            </button> */}
            <button
              onClick={() => handleAddOnAutoclave(row)}
              disabled={row.cakes_residue === 0} // было: поиск по batchDesigner по id
            >
              Разместить
            </button>
          </td>
        </tr>
      );

      if (productionBatchDesigner[index + 1]?.product_article !== currentArticle) {
        rows.push(
          <tr key={`calc-${currentArticle}`} className="calculation-row">
            <td colSpan="14">Здесь будут расчеты для артикула: {currentArticle}</td>
          </tr>
        );
      }

      return rows;
    });
  }, [productionBatchDesigner]);

  return (
    <div style={{ display: 'flex' }}>
      {/* Таблица */}
      {productBatchModal && (
        <ModalTable
          isOpen={productBatchModal}
          toggle={() => setProductBatchModal(!productBatchModal)}
          data={latestProducts}
          onClickRow={addProductHandler}
        />
      )}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 8,
            justifyContent: 'space-between',
          }}
        >
          <button
            onClick={() => {
              setProductBatchModal(!productBatchModal);
            }}
            className="table_button"
          >
            Add product
          </button>

          <div style={{ fontWeight: 800, fontSize: '35px' }}>
            &nbsp;{formatISO(autoclaveCalendarData?.date)}
          </div>
        </div>
        <table>
          <thead>
            <tr>
              {headers.map(({ Header, accessor }) => (
                <th key={accessor}>{Header}</th>
              ))}
            </tr>
          </thead>
          <tbody>{renderGroupedRows()}</tbody>
        </table>
      </div>

      {/* Компонент Autoclave */}
      <div style={{ marginLeft: '20px' }}>
        <Autoclave
          acData={acData}
          batchFromBD={batchFromBD}
          autoclaveCalendarData={autoclaveCalendarData}
        />
      </div>
    </div>
  );
}

export default ProductionBatchDesignerNew;
