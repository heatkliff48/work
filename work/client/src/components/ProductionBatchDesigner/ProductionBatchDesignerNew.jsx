import ModalTable from '#components/Table/ModalTable.jsx';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { addBatchState } from '#components/redux/actions/batchDesignerAction.js';
import AddOrderedProduct from './AddOrderedProduct';
import Autoclave from './Autoclave';
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import ProductionBatchFooter from './ProductionBatchFooter';
import { useAutoclaveContext } from '#components/contexts/AutoclaveContext.js';
import {
  computeQuantityArrays,
  getBatchOutsideRowsForDate,
  getFilledAutoclaveCountForDate,
} from './autoclaveScheduleUtils';

function ProductionBatchDesignerNew() {
  const dispatch = useDispatch();
  const location = useLocation();

  const { latestProducts } = useProductsContext();
  const { productBatchModal, setProductBatchModal } = useModalContext();
  const {
    autoclave,
    setAutoclave: setAutoclaveFromContext,
    setInitialRowCount,
    CELLS_PER_AUTOCLAVE,
    autoclaveCalendarData,
    setAutoclaveCalendarData,
    setSelectedCell,
    setIsEditMode,
  } = useAutoclaveContext();
  const { listOfOrderedCakes, autoclave_calendar } = useWarehouseContext();

  const {
    productionBatchDesigner,
    setProductonBatchDesigner,
    setBatchOrderIDs,
    setQuantityPallets,
  } = useOrderContext();

  const batchDesigner = useSelector((state) => state.batchDesigner) || [];
  const batchOutsideRedux = useSelector((state) => state.batchOutside) || [];

  // Дата и режим редактирования приходят из Batch calendar (клик по ячейке
  // автоклава на конкретную дату): пустая ячейка -> заполнение, заполненная
  // (после подтверждения) -> полноценное редактирование.
  const targetDate = location.state?.date ?? null;
  const editModeRequested = Boolean(location.state?.editMode);

  const [totalQuantity, setTotalQuantity] = useState(0);
  const [autoclaveCount, setAutoclaveCount] = useState(0);

  const [acData, setAcData] = useState([]);

  const didInitAutoclaveRef = useRef(false);
  const didInitEditRef = useRef(false);

  const [orderedProductBatchModal, setOrderedProductBatchModal] = useState(false);

  const formatISO = (s) => {
    if (!s) return '—';
    const [y, m, d] = s.split('-').map(Number);
    const dt = new Date(y, (m || 1) - 1, d || 1);
    return dt.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // AutoclaveContext живёт выше <Routes> и переживает переходы между
  // страницами. isEditMode и выбранная ячейка могли остаться от предыдущей
  // сессии конструктора (другая дата/режим) — сбрасываем их при каждом новом
  // монтировании; autoclave/autoclaveCalendarData сами пересчитываются
  // нижеследующими эффектами.
  useEffect(() => {
    didInitAutoclaveRef.current = false;
    didInitEditRef.current = false;
    setAutoclaveFromContext([]);
    setInitialRowCount(0);
    setSelectedCell(null);
    setIsEditMode(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Автовыбор ближайшей даты с недозаполненным планом — используется только
  // когда конструктор открыт без конкретной даты (обычная навигация).
  useEffect(() => {
    if (targetDate) return;
    if (!Array.isArray(autoclaveCalendarData)) return;

    const today = new Date().toISOString().slice(0, 10);

    const nearest = autoclaveCalendarData
      .map((x) => ({
        ...x,
        qty: Number(x.scheduled_autoclaves ?? 0),
        done: Number(x.produced_autoclave ?? 0),
      }))
      .map((x) => ({ ...x, value: x.qty - x.done }))
      .filter((x) => x.value > 0 && typeof x.date === 'string' && x.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))[0];

    if (nearest && nearest.value > 0) {
      setAutoclaveCount(nearest.value);
      setAutoclaveCalendarData(nearest);
    } else {
      setAutoclaveCount(0);
      setAutoclaveCalendarData(null);
    }
  }, [targetDate, autoclaveCalendarData]);

  // Конкретная дата, выбранная в Batch calendar: считаем сколько автоклавов
  // на эту дату ещё пустые (режим заполнения) либо сколько всего карточек
  // (пустых + заполненных) нужно показать (режим редактирования).
  useEffect(() => {
    if (!targetDate) return;

    const record = (autoclave_calendar || []).find(
      (el) => String(el.date).slice(0, 10) === targetDate,
    );
    const scheduled = Number(record?.scheduled_autoclaves) || 0;
    const filledCards = getFilledAutoclaveCountForDate(
      batchOutsideRedux,
      latestProducts,
      targetDate,
      CELLS_PER_AUTOCLAVE,
    );
    const emptyCards = Math.max(0, scheduled - filledCards);

    setIsEditMode(editModeRequested);
    setAutoclaveCount(editModeRequested ? Math.max(filledCards, scheduled) : emptyCards);

    if (autoclaveCalendarData?.date !== targetDate) {
      setAutoclaveCalendarData(
        record ?? { date: targetDate, scheduled_autoclaves: 0, produced_autoclave: 0 },
      );
    }
  }, [
    targetDate,
    editModeRequested,
    autoclave_calendar,
    batchOutsideRedux,
    latestProducts,
    CELLS_PER_AUTOCLAVE,
    autoclaveCalendarData,
    setAutoclaveCalendarData,
    setIsEditMode,
  ]);

  const MAX_QUANTITY = 10405;

  const emptyAutoclave = useMemo(
    () =>
      Array.from({ length: autoclaveCount * CELLS_PER_AUTOCLAVE }, () => ({
        id_list_of_ordered_production: null,
        status: 0,
        quallty_check: 0,
      })),
    [autoclaveCount],
  );

  const headers = useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Product Article', accessor: 'product_article' },
      { Header: 'Width, mm', accessor: 'width' },
      { Header: 'Density, kg/m³', accessor: 'density' },
      { Header: 'Pallets, qty', accessor: 'quantity' },
      { Header: 'Product + Defect, cakes', accessor: 'product_with_brack' },
      { Header: 'Qty, m³', accessor: 'quantity_m3' },
      //{ Header: 'Свободная продукция, массив', accessor: 'free_product_cakes' },
      {
        Header: 'Free product, pallets',
        accessor: 'free_product_package',
      },
      { Header: 'Total cakes, qty', accessor: 'total_cakes' },
      { Header: 'Placed cakes, qty', accessor: 'cakes_in_batch' },
      { Header: 'Remaining cakes to place, qty', accessor: 'cakes_residue' },
    ],
    [],
  );

  const transformAutoclaveData = (tAutoclave, prodBatchDesigner) => {
    if (!tAutoclave || !prodBatchDesigner) return [];

    const transformed = tAutoclave.map((unit) => {
      const batch = prodBatchDesigner.find(
        (prod) => prod.id === unit.id_list_of_ordered_production,
      );

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

    return transformed.filter((item) => item !== null);
  };

  const addProductHandler = (prod_data) => {
    const { article, density, width, m3InArray, volumeBlockOnPallet, normOfBrack } =
      prod_data;

    const maxId =
      (batchDesigner.reduce((max, item) => (item.id > max ? item.id : max), 0) ||
        0) + 1;

    setAutoclaveFromContext((prevAutoclave) => {
      const prevRows = Array.isArray(prevAutoclave) ? prevAutoclave : [];
      const flat = prevRows
        .flat()
        .map((c) => (c && c.id != null ? { ...c } : { id: null }));

      const emptyIndex = flat.findIndex((cell) => !cell || cell.id === null);
      if (emptyIndex === -1) {
        alert('No free slots available in autoclaves');
        return prevAutoclave;
      }

      flat[emptyIndex] = { id: maxId, density, width, article };

      const palletsPerArray = Math.max(
        1,
        Math.floor(Number(m3InArray || 0) / Number(volumeBlockOnPallet || 1)) || 1,
      );

      const product_with_brack = (
        1 / palletsPerArray +
        Number(normOfBrack || 0)
      ).toFixed(2);
      const free_product_cakes = (
        Math.ceil(product_with_brack) - product_with_brack
      ).toFixed(2);
      const free_product_package = Math.floor(free_product_cakes * palletsPerArray);
      const total_cakes = Math.ceil(product_with_brack);

      dispatch(
        addBatchState({
          id: maxId,
          id_list_of_ordered_production: null,
          product_article: article,
          cakes_in_batch: 0,
          cakes_residue: total_cakes,
          total_cakes,
          free_product_package,
          free_product_cakes,
        }),
      );

      setQuantityPallets((prev) => ({ ...(prev || {}), [maxId]: 3 }));
      setBatchOrderIDs((prev) =>
        Array.isArray(prev) && prev.includes(maxId)
          ? prev
          : [...(prev || []), maxId],
      );

      const rows = [];
      for (let r = 0; r < prevRows.length; r++) {
        const from = r * CELLS_PER_AUTOCLAVE;
        rows.push(flat.slice(from, from + CELLS_PER_AUTOCLAVE));
      }
      return rows;
    });
  };

  const addOrderedProductHandler = (prod_data) => {
    const product = latestProducts.find(
      (prod) => prod.article === prod_data.product_article,
    );

    console.log(prod_data, 'prod_data ProductionBatchDesignerNew.jsx line 219');

    const { article, density, width, m3InArray, volumeBlockOnPallet, normOfBrack } =
      product;

    const palletsPerArray = Math.max(
      1,
      Math.floor(Number(m3InArray || 0) / Number(volumeBlockOnPallet || 1)) || 1,
    );

    const product_with_brack = (
      (prod_data.quantity_pallets -
        prod_data.quantity_allocated -
        prod_data.quantity_produced) /
        palletsPerArray +
      Number(normOfBrack || 0)
    ).toFixed(2);

    const free_product_cakes = (
      Math.ceil(product_with_brack) - product_with_brack
    ).toFixed(2);

    const free_product_package = Math.floor(free_product_cakes * palletsPerArray);

    const total_cakes = Math.ceil(product_with_brack);

    const maxId =
      (batchDesigner.reduce((max, item) => (item.id > max ? item.id : max), 0) ||
        0) + total_cakes;

    setAutoclaveFromContext((prevAutoclave) => {
      const prevRows = Array.isArray(prevAutoclave) ? prevAutoclave : [];
      const flat = prevRows
        .flat()
        .map((c) => (c && c.id != null ? { ...c } : { id: null }));

      const emptyIndices = [];
      for (let i = 0; i < flat.length; i++) {
        if (!flat[i] || flat[i].id === null) {
          emptyIndices.push(i);
        }
      }

      let totalCakes = total_cakes;

      if (emptyIndices.length < total_cakes) {
        // alert(
        //   `Not enough free slots. Need ${total_cakes} slots, but only ${emptyIndices.length} available.`,
        // );
        // return prevAutoclave;
        totalCakes = emptyIndices.length;
      }

      for (let j = 0; j < totalCakes; j++) {
        const targetIndex = emptyIndices[j];
        flat[targetIndex] = {
          id: maxId - (totalCakes - 1),
          density,
          width,
          article,
        };
      }

      dispatch(
        addBatchState({
          id: maxId - (totalCakes - 1),
          id_list_of_ordered_production: null,
          id_ordered_product_to_warehouse: prod_data.id,
          product_article: article,
          cakes_in_batch: totalCakes,
          cakes_residue: 0,
          total_cakes: totalCakes,
          free_product_package,
          free_product_cakes,
        }),
      );

      setQuantityPallets((prev) => ({
        ...(prev || {}),
        [maxId - (totalCakes - 1)]:
          prod_data.quantity_pallets - prod_data.quantity_allocated,
      }));

      setBatchOrderIDs((prev) =>
        Array.isArray(prev) && prev.includes(maxId - (totalCakes - 1))
          ? prev
          : [...(prev || []), maxId - (totalCakes - 1)],
      );

      const rows = [];
      for (let r = 0; r < prevRows.length; r++) {
        const from = r * CELLS_PER_AUTOCLAVE;
        rows.push(flat.slice(from, from + CELLS_PER_AUTOCLAVE));
      }
      return rows;
    });
  };

  const addCakesData = useCallback(
    (prodBatchData) => {
      const { id, product_with_brack, article, palletsPerArray } = prodBatchData;

      const free_product_cakes = (
        Math.ceil(product_with_brack) - product_with_brack
      ).toFixed(2);
      const free_product_package = Math.floor(free_product_cakes * palletsPerArray);
      const total_cakes = Math.ceil(product_with_brack);

      const cakes_in_batch = 0;
      const cakes_residue = Math.max(total_cakes - cakes_in_batch, 0);

      const updated = {
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
            id,
            product_article: article,
            cakes_in_batch,
            cakes_residue,
            free_product_package,
            total_cakes,
          }),
        );
      }

      return updated;
    },
    [batchDesigner, dispatch],
  );

  useEffect(() => {
    if (!latestProducts || !listOfOrderedCakes) return;

    const rightListOfOrdered = listOfOrderedCakes.filter((el) => {
      const product = latestProducts.find(
        (prod) => prod.article == el.product_article,
      );
      if (!product) return false;

      const { m3InArray, volumeBlockOnPallet } = product;
      const palletsPerArray = Math.max(
        1,
        Math.floor(Number(m3InArray || 0) / Number(volumeBlockOnPallet || 1)) || 1,
      );

      return (
        el.quantity !== el.quantity_in_warehouse &&
        el.quantity >
          el.quantity_in_batch * palletsPerArray + el.quantity_in_warehouse
      );
    });

    const groupedByArticle = rightListOfOrdered.reduce((acc, curr) => {
      if (!acc[curr.product_article]) acc[curr.product_article] = [];
      acc[curr.product_article].push({ ...curr });
      return acc;
    }, {});

    const prodBatch = [];
    let updatedTotalQuantity = 0;

    Object.keys(groupedByArticle).forEach((articleKey) => {
      const group = groupedByArticle[articleKey];

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
          if (!product) return;

          const {
            volumeBlockOnPallet,
            density,
            normOfBrack,
            width,
            article,
            m3InArray,
          } = product;

          if (updatedTotalQuantity + quantity > MAX_QUANTITY) return;

          const palletsPerArray = Math.max(
            1,
            Math.floor(Number(m3InArray || 0) / Number(volumeBlockOnPallet || 1)) ||
              1,
          );

          const rightQuantity =
            quantity - (quantity_in_warehouse + quantity_in_batch * palletsPerArray);

          const quantity_m3 = (
            rightQuantity * Number(volumeBlockOnPallet || 0)
          ).toFixed(2);

          const batch = addCakesData({
            id,
            product_article,
            width,
            density,
            quantity: rightQuantity,
            product_with_brack: (
              rightQuantity / palletsPerArray +
              Number(normOfBrack || 0)
            ).toFixed(2),
            quantity_m3,
            article,
            quantity_cakes,
            quantity_in_batch,
            quantity_in_warehouse,
            palletsPerArray,
          });

          prodBatch.push(batch);
          updatedTotalQuantity += rightQuantity;
        },
      );
    });

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
      (x) => (Number(x.cakes_residue) || 0) > 0,
    );
    const updatedAutoclaveData = transformAutoclaveData(
      emptyAutoclave,
      batchForAutoclave,
    );

    const filledAutoclave = [];
    for (let i = 0; i < updatedAutoclaveData.length; i += CELLS_PER_AUTOCLAVE) {
      filledAutoclave.push(updatedAutoclaveData.slice(i, i + CELLS_PER_AUTOCLAVE));
    }

    setAcData(filledAutoclave);
  }, [latestProducts, listOfOrderedCakes, emptyAutoclave]);

  useEffect(() => {
    setProductonBatchDesigner((prev) => {
      if (!Array.isArray(prev) || prev.length === 0) return prev;

      const byArticle = new Map();

      for (const b of batchDesigner) {
        const art = b.product_article;
        if (!art) continue;

        const inBatch = Number(b.cakes_in_batch) || 0;
        const residue = Number(b.cakes_residue) || 0;

        if (!byArticle.has(art)) {
          byArticle.set(art, {
            inBatch: 0,
            residue: 0,
            sources: [],
          });
        }
        const agg = byArticle.get(art);
        agg.inBatch += inBatch;
        agg.residue += residue;
        agg.sources.push({
          id: b.id,
          total_cakes: Number(b.total_cakes) || 0,
          cakes_in_batch: inBatch,
          cakes_residue: residue,
        });
      }

      return prev.map((row) => {
        const agg = byArticle.get(row.product_article);
        if (!agg) {
          return {
            ...row,
            cakes_in_batch: 0,
            cakes_residue: 0,
            sources: [],
          };
        }
        return {
          ...row,
          cakes_in_batch: agg.inBatch,
          cakes_residue: agg.residue,
          sources: agg.sources,
        };
      });
    });
  }, [batchDesigner]);

  const placeGroupToAutoclave = useCallback(
    (groupRow) => {
      console.log(
        'batchDesigner ProductionBatchDesignerNew.jsx line 571',
        batchDesigner,
      );
      if (!groupRow) return;

      const { product_article } = groupRow;

      const product = latestProducts?.find((p) => p.article === product_article);
      if (!product) return;
      const { density, width } = product;

      const sources = batchDesigner
        .filter((b) => b.product_article === product_article)
        .map((b) => {
          const total = Number(b.total_cakes || 0);
          const inBatch = Number(b.cakes_in_batch || 0);
          const residue = Math.max(total - inBatch, 0);
          return { id: b.id, residue };
        })
        .filter((s) => s.residue > 0);

      console.log('sources ProductionBatchDesignerNew.jsx line 588', sources);
      const need = sources.reduce((sum, s) => sum + s.residue, 0);
      if (need <= 0) return;

      const buildPlan = (maxCount) => {
        const plan = [];
        let left = maxCount;
        for (const s of sources) {
          if (left <= 0) break;
          const take = Math.min(s.residue, left);
          for (let k = 0; k < take; k++) plan.push(s.id);
          left -= take;
        }
        return plan;
      };

      const isEmpty = (c) => !c || c.id == null;

      const EMPTY_CELL = { id: null, density: '', width: '', article: '' };

      const buildEmptyRows = (rowsCount) =>
        Array.from({ length: rowsCount }, () =>
          Array.from({ length: CELLS_PER_AUTOCLAVE }, () => ({
            ...EMPTY_CELL,
          })),
        );

      setAutoclaveFromContext((prev) => {
        let rows = Array.isArray(prev) ? prev.map((r) => [...r]) : [];

        if (rows.length === 0) {
          if (Array.isArray(acData) && acData.length > 0) {
            rows = acData.map((r) => [...r]);
          } else if (autoclaveCount > 0) {
            rows = buildEmptyRows(autoclaveCount);
          }
        }

        if (rows.length === 0) {
          alert('No autoclaves available for placement');
          return prev;
        }

        const flat = rows.flat().map((c) =>
          c && c.id != null
            ? {
                id: c.id,
                density: c.density ?? '',
                width: c.width ?? '',
                article: c.article ?? '',
              }
            : { ...EMPTY_CELL },
        );

        const emptyIdx = [];
        for (let i = 0; i < flat.length; i++) {
          if (isEmpty(flat[i])) emptyIdx.push(i);
        }

        if (emptyIdx.length === 0) return prev;

        const toPlaceCount = Math.min(need, emptyIdx.length);
        const plan = buildPlan(toPlaceCount);
        if (plan.length === 0) return prev;

        let lastSame = -1;
        for (let i = flat.length - 1; i >= 0; i--) {
          if (flat[i]?.article === product_article) {
            lastSame = i;
            break;
          }
        }

        const placeToIndices = (indices, ids) => {
          for (let k = 0; k < ids.length; k++) {
            const idx = indices[k];
            flat[idx] = {
              id: ids[k],
              density,
              width,
              article: product_article,
            };
          }
        };

        if (lastSame >= 0) {
          const after = emptyIdx.filter((i) => i > lastSame);
          if (after.length >= plan.length) {
            placeToIndices(after.slice(0, plan.length), plan);
          } else {
            const combined = after.concat(emptyIdx.filter((i) => i <= lastSame));
            placeToIndices(combined.slice(0, plan.length), plan);
          }
        } else {
          placeToIndices(emptyIdx.slice(0, plan.length), plan);
        }

        const out = [];
        for (let i = 0; i < rows.length; i++) {
          const from = i * CELLS_PER_AUTOCLAVE;
          out.push(flat.slice(from, from + CELLS_PER_AUTOCLAVE));
        }

        return out;
      });
    },
    [
      batchDesigner,
      latestProducts,
      setAutoclaveFromContext,
      acData,
      autoclaveCount,
      CELLS_PER_AUTOCLAVE,
    ],
  );

  const renderGroupedRows = useCallback(() => {
    let currentArticle = null;

    return productionBatchDesigner.flatMap((row, index) => {
      const rows = [];

      if (currentArticle !== row.product_article) {
        currentArticle = row.product_article;
        rows.push(
          <tr key={`group-${currentArticle}`} className="group-row">
            <td colSpan="14">Product: {currentArticle}</td>
          </tr>,
        );
      }

      rows.push(
        <tr key={`row-${row.id}`}>
          {headers.map(({ accessor }) => {
            return <td key={accessor}>{row[accessor]}</td>;
          })}
          <td>
            <button
              onClick={() => placeGroupToAutoclave(row)}
              disabled={Number(row.cakes_residue || 0) === 0}
            >
              Place
            </button>
          </td>
        </tr>,
      );

      if (productionBatchDesigner[index + 1]?.product_article !== currentArticle) {
        rows.push(
          <tr key={`calc-${currentArticle}`} className="calculation-row">
            <td colSpan="14">Calculations for article: {currentArticle} will appear here</td>
          </tr>,
        );
      }

      return rows;
    });
  }, [productionBatchDesigner, headers, placeGroupToAutoclave]);

  // В режиме редактирования сетку целиком строит отдельный эффект ниже —
  // этот (шаблон из пустых ячеек) в этом режиме не участвует, чтобы два
  // эффекта не перетирали autoclave друг у друга.
  useEffect(() => {
    if (editModeRequested) return;
    if (!Array.isArray(acData) || acData.length === 0) return;

    const isAutoclaveEmpty =
      !Array.isArray(autoclave) ||
      autoclave.length === 0 ||
      autoclave.flat().every((c) => !c || c.id == null);

    if (didInitAutoclaveRef.current && !isAutoclaveEmpty) return;

    setAutoclaveFromContext(acData);
    setInitialRowCount(acData.length);

    didInitAutoclaveRef.current = true;
  }, [editModeRequested, acData, autoclave, setAutoclaveFromContext, setInitialRowCount]);

  // Режим редактирования: один раз подгружаем уже сохранённые позиции
  // batchOutside за выбранную дату в сетку автоклавов (размер сетки берём
  // из autoclaveCount, а не ждём, пока её проинициализирует эффект выше),
  // регистрируя каждую позицию как источник в batchDesigner, чтобы её можно
  // было удалить/дополнить и корректно пересохранить.
  useEffect(() => {
    if (!editModeRequested || !targetDate) {
      didInitEditRef.current = false;
      return;
    }
    if (didInitEditRef.current) return;
    if (autoclaveCount <= 0) return;
    if (!Array.isArray(latestProducts) || latestProducts.length === 0) return;

    const capacity = autoclaveCount * CELLS_PER_AUTOCLAVE;
    const flat = Array.from({ length: capacity }, () => ({
      id: null,
      density: '',
      width: '',
      article: '',
    }));

    const rows = getBatchOutsideRowsForDate(batchOutsideRedux, targetDate);

    const maxExistingId = batchDesigner.reduce(
      (max, item) => (Number(item.id) > max ? Number(item.id) : max),
      0,
    );
    let nextSyntheticId = maxExistingId + 1;

    let cursor = 0;
    rows.forEach((row) => {
      const product = latestProducts.find((p) => p.article === row.product_article);
      const qty = computeQuantityArrays(row, latestProducts);
      if (qty <= 0) return;

      const linkedProductionId =
        row.id_list_of_ordered_production != null
          ? Number(row.id_list_of_ordered_production)
          : null;
      const entryId = linkedProductionId ?? nextSyntheticId++;

      if (!batchDesigner.some((b) => Number(b.id) === entryId)) {
        dispatch(
          addBatchState({
            id: entryId,
            id_list_of_ordered_production: linkedProductionId,
            id_ordered_product_to_warehouse: row.id_ordered_product_to_warehouse ?? null,
            product_article: row.product_article,
            cakes_in_batch: qty,
            cakes_residue: 0,
            total_cakes: qty,
            free_product_package: Number(row.quantity_free) || 0,
            free_product_cakes: 0,
          }),
        );
      }

      for (let k = 0; k < qty && cursor < capacity; k++) {
        flat[cursor] = {
          id: entryId,
          density: product?.density ?? '',
          width: product?.width ?? '',
          article: row.product_article,
        };
        cursor += 1;
      }
    });

    const rebuilt = [];
    for (let r = 0; r < autoclaveCount; r++) {
      const from = r * CELLS_PER_AUTOCLAVE;
      rebuilt.push(flat.slice(from, from + CELLS_PER_AUTOCLAVE));
    }
    setAutoclaveFromContext(rebuilt);
    setInitialRowCount(autoclaveCount);
    didInitAutoclaveRef.current = true;

    didInitEditRef.current = true;
  }, [
    editModeRequested,
    targetDate,
    autoclaveCount,
    latestProducts,
    batchOutsideRedux,
    batchDesigner,
    dispatch,
    setAutoclaveFromContext,
    setInitialRowCount,
    CELLS_PER_AUTOCLAVE,
  ]);

  return (
    <div style={{ display: 'flex', paddingBottom: '110px' }}>
      {productBatchModal && (
        <ModalTable
          isOpen={productBatchModal}
          toggle={() => setProductBatchModal(!productBatchModal)}
          data={latestProducts}
          onClickRow={addProductHandler}
        />
      )}

      {orderedProductBatchModal && (
        <AddOrderedProduct
          isOpen={orderedProductBatchModal}
          toggle={() => setOrderedProductBatchModal(!orderedProductBatchModal)}
          data={latestProducts}
          onClickRow={addOrderedProductHandler}
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
            onClick={() => setProductBatchModal(!productBatchModal)}
            className="table_button"
          >
            Add product
          </button>
          <button
            onClick={() => setOrderedProductBatchModal(!orderedProductBatchModal)}
            className="table_button"
          >
            Add product ordered to warehouse
          </button>
          {console.log(
            'autoclaveCalendarData ProductionBatchDesignerNew.jsx line 866',
            autoclaveCalendarData,
          )}{' '}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div style={{ fontWeight: 800, fontSize: '35px' }}>
              &nbsp;{formatISO(autoclaveCalendarData?.date)}
            </div>
            {editModeRequested && (
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#92400e',
                  background: '#fff4e0',
                  borderRadius: 999,
                  padding: '4px 10px',
                }}
              >
                Editing existing batch
              </span>
            )}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              {headers.map(({ Header, accessor }) => (
                <th key={accessor}>{Header}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>{renderGroupedRows()}</tbody>
        </table>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(82vh - 80px)',
          marginLeft: '20px',
        }}
      >
        <Autoclave />
      </div>
      {!productBatchModal && !orderedProductBatchModal && <ProductionBatchFooter />}
    </div>
  );
}

export default ProductionBatchDesignerNew;
