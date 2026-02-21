import ModalTable from '#components/Table/ModalTable.jsx';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { addBatchState } from '#components/redux/actions/batchDesignerAction.js';
import AddOrderedProduct from './AddOrderedProduct';
import Autoclave from './Autoclave';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const CELLS_PER_AUTOCLAVE = 21;

function ProductionBatchDesignerNew() {
  const dispatch = useDispatch();

  const { latestProducts } = useProductsContext();
  const { listOfOrderedCakes, autoclave_calendar } = useWarehouseContext();

  const {
    setAutoclave,
    productionBatchDesigner,
    setProductonBatchDesigner,
    setBatchOrderIDs,
    setQuantityPallets,
  } = useOrderContext();

  const { productBatchModal, setProductBatchModal } = useModalContext();

  const batchDesigner = useSelector((state) => state.batchDesigner) || [];

  const [totalQuantity, setTotalQuantity] = useState(0);
  const [acData, setAcData] = useState([]);
  const [autoclaveCount, setAutoclaveCount] = useState(0);
  const [autoclaveCalendarData, setAutoclaveCalendarData] = useState(null);
  const [orderedProductBatchModal, setOrderedProductBatchModal] =
    useState(false);

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

  useEffect(() => {
    if (!Array.isArray(autoclave_calendar)) return;

    const today = new Date().toISOString().slice(0, 10);

    const nearest = autoclave_calendar
      .map((x) => ({
        ...x,
        qty: Number(x.scheduled_autoclaves ?? 0),
        done: Number(x.produced_autoclave ?? 0),
      }))
      .map((x) => ({ ...x, value: x.qty - x.done }))
      .filter(
        (x) => x.value > 0 && typeof x.date === 'string' && x.date >= today,
      )
      .sort((a, b) => a.date.localeCompare(b.date))[0];

    if (nearest && nearest.value > 0) {
      setAutoclaveCount(nearest.value);
      setAutoclaveCalendarData(nearest);
    } else {
      setAutoclaveCount(0);
      setAutoclaveCalendarData(null);
    }
  }, [autoclave_calendar]);

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
      { Header: 'Ширина, мм', accessor: 'width' },
      { Header: 'Плотность, кг/м³', accessor: 'density' },
      { Header: 'Количество, паллет', accessor: 'quantity' },
      { Header: 'Продукт + Брак, массивов', accessor: 'product_with_brack' },
      { Header: 'Кол-во, м³', accessor: 'quantity_m3' },
      //{ Header: 'Свободная продукция, массив', accessor: 'free_product_cakes' },
      {
        Header: 'Свободная продукция, паллет',
        accessor: 'free_product_package',
      },
      { Header: 'Итоговое кол-во, массив', accessor: 'total_cakes' },
      { Header: 'Размещено, массив', accessor: 'cakes_in_batch' },
      { Header: 'Осталось разместить, массив', accessor: 'cakes_residue' },
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
    const {
      article,
      density,
      width,
      m3InArray,
      volumeBlockOnPallet,
      normOfBrack,
    } = prod_data;

    const maxId =
      (batchDesigner.reduce(
        (max, item) => (item.id > max ? item.id : max),
        0,
      ) || 0) + 1;

    setAutoclave((prevAutoclave) => {
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
        Math.floor(Number(m3InArray || 0) / Number(volumeBlockOnPallet || 1)) ||
          1,
      );

      const product_with_brack = (
        1 / palletsPerArray +
        Number(normOfBrack || 0)
      ).toFixed(2);
      const free_product_cakes = (
        Math.ceil(product_with_brack) - product_with_brack
      ).toFixed(2);
      const free_product_package = Math.floor(
        free_product_cakes * palletsPerArray,
      );
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

    const {
      article,
      density,
      width,
      m3InArray,
      volumeBlockOnPallet,
      normOfBrack,
      widthInArray,
    } = product;

    const palletsPerArray = Math.max(
      1,
      Math.floor(Number(m3InArray || 0) / Number(volumeBlockOnPallet || 1)) ||
        1,
    );

    const product_with_brack = (
      prod_data.quantity_pallets / palletsPerArray +
      Number(normOfBrack || 0)
    ).toFixed(2);

    const free_product_cakes = (
      Math.ceil(product_with_brack) - product_with_brack
    ).toFixed(2);

    const free_product_package = Math.floor(
      free_product_cakes * palletsPerArray,
    );

    const total_cakes = Math.ceil(product_with_brack);

    console.log(
      total_cakes,
      'total_cakes ProductionBatchDesignerNew.jsx line 253',
    );

    const maxId =
      (batchDesigner.reduce(
        (max, item) => (item.id > max ? item.id : max),
        0,
      ) || 0) + total_cakes;

    console.log(maxId, 'maxId ProductionBatchDesignerNew.jsx line 259');

    setAutoclave((prevAutoclave) => {
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

      if (emptyIndices.length < total_cakes) {
        alert(
          `Not enough free slots. Need ${total_cakes} slots, but only ${emptyIndices.length} available.`,
        );
        return prevAutoclave;
      }

      for (let j = 0; j < total_cakes; j++) {
        const targetIndex = emptyIndices[j];
        flat[targetIndex] = {
          id: maxId - (total_cakes - 1) + j,
          density,
          width,
          article,
        };
      }

      dispatch(
        addBatchState({
          id: maxId - (total_cakes - 1),
          id_list_of_ordered_production: null,
          product_article: article,
          cakes_in_batch: 0,
          cakes_residue: total_cakes,
          total_cakes,
          free_product_package,
          free_product_cakes,
        }),
      );

      setQuantityPallets((prev) => ({
        ...(prev || {}),
        [maxId - (total_cakes - 1)]: prod_data.quantity_pallets,
      }));

      setBatchOrderIDs((prev) =>
        Array.isArray(prev) && prev.includes(maxId - (total_cakes - 1))
          ? prev
          : [...(prev || []), maxId - (total_cakes - 1)],
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
      const { id, product_with_brack, article, palletsPerArray } =
        prodBatchData;

      const free_product_cakes = (
        Math.ceil(product_with_brack) - product_with_brack
      ).toFixed(2);
      const free_product_package = Math.floor(
        free_product_cakes * palletsPerArray,
      );
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
        Math.floor(Number(m3InArray || 0) / Number(volumeBlockOnPallet || 1)) ||
          1,
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
          const product = latestProducts.find(
            (el) => el.article == product_article,
          );
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
            Math.floor(
              Number(m3InArray || 0) / Number(volumeBlockOnPallet || 1),
            ) || 1,
          );

          const rightQuantity =
            quantity -
            (quantity_in_warehouse + quantity_in_batch * palletsPerArray);

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
          (Number(acc[key].cakes_residue) || 0) +
          (Number(item.cakes_residue) || 0);

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
      filledAutoclave.push(
        updatedAutoclaveData.slice(i, i + CELLS_PER_AUTOCLAVE),
      );
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
      if (!groupRow) return;

      const { product_article } = groupRow;

      const product = latestProducts?.find(
        (p) => p.article === product_article,
      );
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

      setAutoclave((prev) => {
        const rows = Array.isArray(prev) ? prev.map((r) => [...r]) : [];
        const flat = rows.flat().map((c) =>
          c && c.id != null
            ? {
                id: c.id,
                density: c.density ?? '',
                width: c.width ?? '',
                article: c.article ?? '',
              }
            : { id: null, density: '', width: '', article: '' },
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
            const combined = after.concat(
              emptyIdx.filter((i) => i <= lastSame),
            );
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
    [batchDesigner, latestProducts, setAutoclave],
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
              Разместить
            </button>
          </td>
        </tr>,
      );

      if (
        productionBatchDesigner[index + 1]?.product_article !== currentArticle
      ) {
        rows.push(
          <tr key={`calc-${currentArticle}`} className="calculation-row">
            <td colSpan="14">
              Здесь будут расчеты для артикула: {currentArticle}
            </td>
          </tr>,
        );
      }

      return rows;
    });
  }, [productionBatchDesigner, headers, placeGroupToAutoclave]);

  return (
    <div style={{ display: 'flex' }}>
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
            onClick={() =>
              setOrderedProductBatchModal(!orderedProductBatchModal)
            }
            className="table_button"
          >
            Add ordered product
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
              <th></th>
            </tr>
          </thead>
          <tbody>{renderGroupedRows()}</tbody>
        </table>
      </div>

      <div style={{ marginLeft: '20px' }}>
        <Autoclave
          acData={acData}
          autoclaveCalendarData={autoclaveCalendarData}
        />
      </div>
    </div>
  );
}

export default ProductionBatchDesignerNew;
