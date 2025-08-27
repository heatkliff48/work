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
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function ProductionBatchDesignerNew() {
  const dispatch = useDispatch();

  const { latestProducts } = useProductsContext();
  const { listOfOrderedCakes, autoclave_calendar, distributeToSources } =
    useWarehouseContext();
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
  const batchOutside = useSelector((state) => state.batchOutside);

  const [totalQuantity, setTotalQuantity] = useState(0);
  const [currId, setCurrId] = useState(null);
  const [acData, setAcData] = useState([]);
  const [autoclaveCount, setAutoclaveCount] = useState(0);
  const [autoclaveCalendarData, setAutoclaveCalendarData] = useState(0);

  const [pendingPlacement, setPendingPlacement] = useState(null); // { groupId, placed, sources }

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
  };

  const handleAddOnAutoclave = (row) => {
    setCurrId(row.id);
  };

  const addCakesData = useCallback(
    (prodBatchData) => {
      const {
        id,
        product_with_brack,
        article,
        quantity_cakes,
        quantity_in_batch,
        quantity_in_warehouse,
      } = prodBatchData;
      const m3InArray = latestProducts?.find((p) => p.article == article)?.m3InArray;
      const volumeBlockOnPallet = latestProducts?.find(
        (p) => p.article == article
      )?.volumeBlockOnPallet;

      const free_product_cakes = (
        Math.ceil(product_with_brack) - product_with_brack
      ).toFixed(2);
      const free_product_package = Math.floor(free_product_cakes * 3);

      const total_cakes = Math.ceil(product_with_brack);

      // pallets-per-array (как и при сохранении)
      const palletsPerArray = Math.max(
        1,
        Math.floor(m3InArray / volumeBlockOnPallet) || 1
      );

      const cakes_in_batch =
        quantity_in_batch == 0
          ? quantity_in_batch
          : Math.max(
              quantity_cakes -
                (quantity_in_warehouse + quantity_in_batch * palletsPerArray),
              0
            );

      // если есть готовое значение — берём его, иначе считаем от total_cakes
      const cakes_residue = Math.max(quantity_cakes - quantity_in_batch, 0);

      const updatedProdBatch = {
        ...prodBatchData,
        free_product_cakes,
        free_product_package,
        total_cakes,
        cakes_in_batch,
        cakes_residue,
      };

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
          article: '',
          density: '',
          width: '',
        };

      return {
        id: batch.id,
        article: batch.article,
        density: batch.density,
        width: batch.width,
      };
    });

    return transformedAutoclave.filter((item) => item !== null);
  };

  useEffect(() => {
    if (!latestProducts || !listOfOrderedCakes) return;

    const rightListOfOrdered = listOfOrderedCakes.filter((el) => {
      const { m3InArray, volumeBlockOnPallet } = latestProducts.find(
        (prod) => prod.article == el.product_article
      );
      return (
        el.quantity !== el.quantity_in_warehouse &&
        el.quantity >
          el.quantity_in_batch * Math.floor(m3InArray / volumeBlockOnPallet) +
            el.quantity_in_warehouse
      );
    });
    console.log('listOfOrderedCakes', listOfOrderedCakes);
    console.log('rightListOfOrdered', rightListOfOrdered);

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
      group.forEach(
        ({
          id,
          quantity,
          product_article,
          quantity_in_warehouse,
          quantity_cakes,
          quantity_in_batch,
        }) => {
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
            const palletsPerArray = Math.max(
              1,
              Math.floor(m3InArray / volumeBlockOnPallet) || 1
            );

            const rightQuantity =
              quantity -
              (quantity_in_warehouse + quantity_in_batch * palletsPerArray);
            const quantity_m3 = (rightQuantity * volumeBlockOnPallet).toFixed(2);

            const batch = addCakesData({
              id,
              product_article,
              width,
              density,
              quantity: rightQuantity,
              product_with_brack: (quantity / palletsPerArray + normOfBrack).toFixed(
                2
              ),
              quantity_m3,
              article,
              quantity_cakes,
              quantity_in_batch,
              quantity_in_warehouse,
            });
            prodBatch.push(batch);
            updatedTotalQuantity += rightQuantity;
          }
        }
      );
    });

    console.log('prodBatch', prodBatch);

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

    const reindexed = merged.map((item, index) => ({ ...item, id: index + 1 }));

    const visible = reindexed.filter((x) => (Number(x.cakes_residue) || 0) > 0);
    setProductonBatchDesigner(visible);

    setTotalQuantity(updatedTotalQuantity);

    const batchForAutoclave = prodBatch.filter(
      (x) => (Number(x.cakes_residue) || 0) > 0
    );
    const updatedAutoclaveData = transformAutoclaveData(
      emptyAutoclave,
      batchForAutoclave
    );

    const filledAutoclave = [];
    for (let i = 0; i < updatedAutoclaveData.length; i += 21) {
      filledAutoclave.push(updatedAutoclaveData.slice(i, i + 21));
    }

    setAcData(filledAutoclave);
  }, [latestProducts, listOfOrderedCakes, emptyAutoclave]);

  useEffect(() => {
    if (autoclave?.length === 0) return;

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
  //   if (currId === null) return;

  //   const groupRow = productionBatchDesigner.find((r) => r.id === currId);
  //   if (!groupRow) {
  //     setCurrId(null);
  //     return;
  //   }

  //   const { density, width, cakes_residue, product_article } = groupRow;

  //   // Синхронные источники прямо из Redux по этому артикулу
  //   const sources = batchDesigner
  //     .filter((b) => b.product_article === product_article)
  //     .map((b) => ({
  //       id: b.id,
  //       total_cakes: Number(b.total_cakes) || 0,
  //       cakes_in_batch: Number(b.cakes_in_batch) || 0,
  //       cakes_residue: Number(b.cakes_residue) || 0,
  //     }));

  //   setAutoclave((prevAutoclave) => {
  //     const rows = prevAutoclave.map((r) => [...r]);
  //     const flat = rows.flat();

  //     // свободные ячейки
  //     const freeIdx = [];
  //     for (let i = 0; i < flat.length; i++) {
  //       if (!flat[i]?.id) freeIdx.push(i);
  //     }
  //     if (freeIdx.length === 0) {
  //       alert('No free slots available in autoclaves');
  //       return prevAutoclave;
  //     }

  //     // сколько реально можем положить
  //     let remaining = Math.min(Number(cakes_residue) || 0, freeIdx.length);
  //     let placed = 0;
  //     let cursor = 0;

  //     // раскладываем именно по REAL id из sources
  //     for (const s of sources) {
  //       if (remaining <= 0) break;
  //       const sResidue = Math.max(
  //         (Number(s.total_cakes) || 0) - (Number(s.cakes_in_batch) || 0),
  //         Number(s.cakes_residue) || 0
  //       );
  //       const take = Math.min(sResidue, remaining);
  //       for (let k = 0; k < take; k++) {
  //         const idx = freeIdx[cursor++];
  //         flat[idx] = { id: s.id, density, width, article: product_article };
  //       }
  //       placed += take;
  //       remaining -= take;
  //     }

  //     // собираем матрицу обратно (по 21)
  //     const CELLS_PER_AUTOCLAVE = 21;
  //     const out = [];
  //     for (let i = 0; i < rows.length; i++) {
  //       const from = i * CELLS_PER_AUTOCLAVE;
  //       out.push(flat.slice(from, from + CELLS_PER_AUTOCLAVE));
  //     }

  //     // >>> ВАЖНО: сообщаем "сколько положили" во второй этап
  //     if (placed > 0) {
  //       setPendingPlacement({ groupId: currId, placed, sources });
  //     } else {
  //       // ничего не положили — сразу сбросим выбор
  //       setCurrId(null);
  //     }

  //     return out;
  //   });
  // }, [currId]);

  useEffect(() => {
    if (currId == null) return;

    const groupRow = productionBatchDesigner.find((r) => r.id === currId);
    if (!groupRow) return;

    const { density, width, cakes_residue, product_article } = groupRow;
    const CELLS_PER_AUTOCLAVE = 21;
    const EMPTY_CELL = () => ({});
    const isEmpty = (c) => !c || !c.id;

    const getColBounds = (idx) => {
      const start = idx - (idx % CELLS_PER_AUTOCLAVE);
      return { start, end: start + CELLS_PER_AUTOCLAVE - 1 };
    };

    // Пытаемся "открыть окно" размером size, начиная с start,
    // сдвигая всё ПРАВО от start внутри границ [bStart..bEnd].
    // Возвращает { ok, next } — next используется ТОЛЬКО если ok === true.
    const tryOpenWindowRight = (arr, start, size, bStart, bEnd) => {
      const a = arr.slice(); // чистая копия
      let insertPos = start;

      for (let step = 0; step < size; step++) {
        // ищем ПУСТУЮ ячейку справа внутри границ
        let emptyAt = -1;
        for (let i = bEnd; i >= insertPos; i--) {
          if (isEmpty(a[i])) {
            emptyAt = i;
            break;
          }
        }
        if (emptyAt === -1) {
          return { ok: false };
        }
        // сдвигаем блок [insertPos..emptyAt-1] на 1 вправо
        for (let j = emptyAt; j > insertPos; j--) {
          a[j] = a[j - 1];
        }
        a[insertPos] = EMPTY_CELL();
        insertPos += 1; // двигаем позицию для следующего шага окна
      }

      return { ok: true, next: a };
    };

    // Кладём подряд, распределяя по источникам этого артикула
    const sources = batchDesigner
      .filter((b) => b.product_article === product_article)
      .map((b) => ({
        id: b.id,
        total_cakes: Number(b.total_cakes) || 0,
        cakes_in_batch: Number(b.cakes_in_batch) || 0,
        cakes_residue: Number(b.cakes_residue) || 0,
      }));

    setAutoclave((prev) => {
      const rows = prev.map((r) => [...r]);
      const flat = rows.flat();

      // Сколько реально можем положить
      const freeTotal = flat.reduce((acc, c) => acc + (isEmpty(c) ? 1 : 0), 0);
      let remaining = Math.min(Number(cakes_residue) || 0, freeTotal);
      if (remaining <= 0) return prev;

      // Ищем последний индекс нашего артикула
      let lastSameIdx = -1;
      for (let i = flat.length - 1; i >= 0; i--) {
        if (flat[i]?.article === product_article) {
          lastSameIdx = i;
          break;
        }
      }

      // Хелпер вставки подряд в flat начиная с idx (без сдвигов, предполагая свободные)
      const placeSequentially = (startIdx, count) => {
        let idx = startIdx;
        let left = count;
        for (const s of sources) {
          if (left <= 0) break;
          const residue =
            Math.max(s.total_cakes - s.cakes_in_batch, s.cakes_residue) || 0;
          const take = Math.min(residue, left);
          for (let k = 0; k < take; k++) {
            flat[idx++] = { id: s.id, density, width, article: product_article };
          }
          left -= take;
        }
        return count - left; // фактически поставлено
      };

      let placed = 0;

      if (lastSameIdx >= 0) {
        // Вставляем СРАЗУ ПОСЛЕ последнего такого артикула и сдвигаем всё вправо,
        // строго внутри этого же автоклава.
        const insertAt = lastSameIdx + 1;
        const { start: bStart, end: bEnd } = getColBounds(insertAt);

        // Максимум сколько вообще влезет внутрь этого автоклава
        const freeHere = (() => {
          let n = 0;
          for (let i = insertAt; i <= bEnd; i++) if (isEmpty(flat[i])) n++;
          // Плюс то, что сможем «вытолкать» вправо за счёт других пустых
          // внутри тех же границ — tryOpenWindowRight это посчитает сам.
          return n + 0;
        })();

        // Пробуем открыть окно от remaining вниз до 1,
        // применяем ТОЛЬКО успешный вариант.
        let best = null;
        for (
          let want = Math.min(remaining, bEnd - insertAt + 1);
          want >= 1;
          want--
        ) {
          const trial = tryOpenWindowRight(flat, insertAt, want, bStart, bEnd);
          if (trial.ok) {
            best = { want, next: trial.next };
            break;
          }
        }

        if (best) {
          // применяем результат чистого сдвига
          for (let i = 0; i < flat.length; i++) flat[i] = best.next[i];
          // размещаем в открытое окно
          placed += placeSequentially(insertAt, Math.min(best.want, remaining));
          remaining -= placed;
        }
        // если не удалось открыть даже окно на 1 — ничего не трогаем (и не перезаписываем!)
      } else {
        // Такого артикула нет — кладём в первые свободные слоты (без сдвига)
        for (let i = 0; i < flat.length && remaining > 0; i++) {
          if (isEmpty(flat[i])) {
            placed += placeSequentially(i, 1);
            remaining -= 1;
          }
        }
      }

      if (placed === 0) return prev;

      // Собираем обратно по 21
      const out = [];
      for (let i = 0; i < rows.length; i++) {
        const from = i * CELLS_PER_AUTOCLAVE;
        out.push(flat.slice(from, from + CELLS_PER_AUTOCLAVE));
      }

      // Сообщаем системе учёта, что реально положили
      setPendingPlacement({ groupId: currId, placed, sources });
      return out;
    });
  }, [currId]);

  useEffect(() => {
    if (!pendingPlacement) return;
    const { groupId, placed, sources } = pendingPlacement;

    const { sources: newSources, placed: reallyPlaced } = distributeToSources(
      sources,
      placed,
      (s) => {
        // обновляем Redux для КАЖДОГО исходного заказа
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

    // мгновенно обновляем агрегированную строку
    setProductonBatchDesigner((prev) =>
      prev.map((item) => {
        if (item.id !== groupId) return item;
        return {
          ...item,
          cakes_in_batch: (item.cakes_in_batch || 0) + reallyPlaced,
          cakes_residue: Math.max((item.cakes_residue || 0) - reallyPlaced, 0),
          sources: newSources,
        };
      })
    );

    // очистка события и текущего выбора
    setPendingPlacement(null);
    setCurrId(null);
  }, [pendingPlacement]);

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
            <button
              onClick={() => handleAddOnAutoclave(row)}
              disabled={row.cakes_residue === 0}
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
        <Autoclave acData={acData} autoclaveCalendarData={autoclaveCalendarData} />
      </div>
    </div>
  );
}

export default ProductionBatchDesignerNew;
