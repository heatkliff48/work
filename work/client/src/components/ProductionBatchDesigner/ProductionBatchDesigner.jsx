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

function ProductionBatchDesigner() {
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
      { Header: 'Плотность, кг/м³', accessor: 'density' },
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

  const handleAddOnAutoclave = (row) => {
    setCurrId(row.id);
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
    const groupedByDensity = rightListOfOrdered.reduce((acc, curr) => {
      const product = latestProducts.find((p) => p.article === curr.product_article);
      if (!product) return acc;
      const { density } = product;

      if (!acc[density]) {
        acc[density] = [];
      }

      acc[density].push({ ...curr, product });

      return acc;
    }, {});

    const prodBatch = [];
    let updatedTotalQuantity = totalQuantity;

    Object.keys(groupedByDensity).forEach((densityKey) => {
      const group = groupedByDensity[densityKey];
      group.forEach(({ id, quantity, product, quantity_in_warehouse }) => {
        const {
          volumeBlockOnPallet,
          normOfBrack,
          width,
          density,
          article,
          m3InArray,
        } = product;

        if (updatedTotalQuantity + quantity <= MAX_QUANTITY) {
          const rightQuantity = quantity - quantity_in_warehouse;
          const quantity_m3 = (rightQuantity * volumeBlockOnPallet).toFixed(2);

          const batch = addCakesData({
            id,
            density,
            width,
            quantity: rightQuantity,
            product_with_brack: ((quantity_m3 + normOfBrack) / m3InArray).toFixed(2),
            quantity_m3,
            article,
          });
          prodBatch.push(batch);
          updatedTotalQuantity += rightQuantity;
        }
      });
    });

    setProductonBatchDesigner(prodBatch);
    setTotalQuantity(updatedTotalQuantity);

    const updatedAutoclaveData = transformAutoclaveData(emptyAutoclave, prodBatch);

    const filledAutoclave = [];
    for (let i = 0; i < updatedAutoclaveData.length; i += 21) {
      filledAutoclave.push(updatedAutoclaveData.slice(i, i + 21));
    }

    setAcData(filledAutoclave);
  }, [latestProducts, listOfOrderedCakes, emptyAutoclave]);

  useEffect(() => {
    if (currId === null) return;

    setAutoclave((prevAutoclave) => {
      // копируем матрицу без изменения размеров
      const updatedAutoclave = prevAutoclave.map((row) => [...row]);
      const flat = updatedAutoclave.flat();

      const row = productionBatchDesigner.find((r) => r.id === currId);
      if (!row) {
        countRef.current = 0;
        return prevAutoclave;
      }

      const { id, density, width, cakes_residue } = row;

      // считаем доступную вместимость (пустые ячейки) ВНУТРИ УЖЕ СОЗДАННЫХ автоклавов
      const freeSpaces = flat.filter((cell) => !cell?.id).length;
      if (freeSpaces === 0) {
        alert('No free slots available in autoclaves'); // нет места вообще
        countRef.current = 0;
        return prevAutoclave;
      }

      // сколько нужно положить
      const required = Number(cakes_residue) || 0;
      // кладём ровно столько, сколько помещается
      const toPlace = Math.min(required, freeSpaces);

      // если не всё поместилось — предупредим
      if (toPlace < required) {
        alert(`Not enough autoclave capacity: placed ${toPlace} of ${required}.`);
      }

      // размещаем «слева направо, сверху вниз», не создавая новых рядов
      let placed = 0;
      for (let i = 0; i < updatedAutoclave.length && placed < toPlace; i++) {
        for (let j = 0; j < updatedAutoclave[i].length && placed < toPlace; j++) {
          if (!updatedAutoclave[i][j]?.id) {
            updatedAutoclave[i][j] = { id, density, width };
            placed++;
          }
        }
      }

      countRef.current = placed; // столько реально положили (второй эффект это использует)
      return updatedAutoclave;
    });
  }, [currId, productionBatchDesigner, setAutoclave]);

  useEffect(() => {
    if (autoclave.length !== 0) {
      setProductonBatchDesigner((prev) => {
        return prev.map((batchItem) => {
          const { cakes_in_batch, free_product_package, id } = batchItem;
          for (let i = 0; i < batchDesigner.length; i++) {
            if (batchDesigner[i].id === id) {
              const free = (batchDesigner[i].cakes_in_batch - cakes_in_batch) * 3;

              const new_free_product_package =
                free > 0 ? free_product_package + free : free_product_package;
              return {
                ...batchItem,
                free_product_package: new_free_product_package,
                cakes_in_batch: batchDesigner[i].cakes_in_batch,
                cakes_residue: batchDesigner[i].cakes_residue,
              };
            }
          }
          return batchItem;
        });
      });
      return;
    }
  }, [batchDesigner]);

  useEffect(() => {
    const currentCount =
      countRef.current === 0
        ? batchDesigner.find((el) => el.id === currId)?.cakes_residue ?? 0
        : countRef.current;

    setProductonBatchDesigner((prevBatch) => {
      let hasChanges = false;

      const updatedBatch = prevBatch.map((batchItem) => {
        if (batchItem.id === currId) {
          // const currBatchFromBD = batchFromBD.find((el) => el.id === currId);
          const { cakes_residue, cakes_in_batch } = batchItem;

          const new_cakes_in_batch = cakes_in_batch + currentCount;
          const new_cakes_residue = Math.max(cakes_residue - currentCount, 0);

          if (
            cakes_residue !== new_cakes_residue ||
            cakes_in_batch !== new_cakes_in_batch
          ) {
            hasChanges = true;
          }

          dispatch(
            updateBatchState({
              id: currId,
              cakes_in_batch: new_cakes_in_batch,
              cakes_residue: new_cakes_residue,
            })
          );

          dispatch(
            unlockButton({
              id: currId,
              isButtonLocked: new_cakes_residue === 0,
            })
          );

          setQuantityPallets((prev) => ({
            ...prev,
            [currId]: new_cakes_in_batch * 3,
          }));

          setBatchOrderIDs((prev) =>
            prev.includes(currId) ? prev : [...prev, currId]
          );

          return {
            ...batchItem,
            cakes_in_batch: new_cakes_in_batch,
            cakes_residue: new_cakes_residue,
          };
        }
        return batchItem;
      });

      return hasChanges ? updatedBatch : prevBatch;
    });

    countRef.current = 0;
    setCurrId(null);
  }, [currId]);

  const renderGroupedRows = useCallback(() => {
    let currentDensity = null;
    return productionBatchDesigner.flatMap((row, index) => {
      const rows = [];

      if (currentDensity !== row.density) {
        currentDensity = row.density;
        rows.push(
          <tr key={`group-${currentDensity}`} className="group-row">
            <td colSpan="14">Плотность: {currentDensity}</td>
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
              disabled={
                batchDesigner?.find((el) => el.id === row.id)?.isButtonLocked
              }
            >
              Разместить
            </button>
          </td>
        </tr>
      );

      if (
        index === productionBatchDesigner.length - 1 ||
        productionBatchDesigner[index + 1].density !== currentDensity
      ) {
        rows.push(
          <tr key={`calc-${currentDensity}`} className="calculation-row">
            <td colSpan="14">Здесь будут расчеты для плотности: {currentDensity}</td>
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
        {/* <button
          onClick={() => {
            setProductBatchModal(!productBatchModal);
          }}
          className="table_button"
        >
          Add product
        </button> */}
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

export default ProductionBatchDesigner;
