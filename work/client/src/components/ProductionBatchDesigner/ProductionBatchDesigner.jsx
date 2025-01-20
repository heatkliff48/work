import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import Autoclave from './Autoclave';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useDispatch, useSelector } from 'react-redux';
import {
  addBatchState,
  unlockButton,
  updateBatchState,
} from '#components/redux/actions/batchDesignerAction.js';

function ProductionBatchDesigner() {
  const dispatch = useDispatch();

  const { latestProducts } = useProductsContext();
  const { listOfOrderedCakes } = useWarehouseContext();
  const { autoclaveData, autoclave, setAutoclave, setQuantityPallets } =
    useOrderContext();

  const batchDesigner = useSelector((state) => state.batchDesigner);
  const [batchFromBD, setBatchFromBD] = useState([]);
  const [acData, setAcData] = useState([]);
  const [productionBatchDesigner, setProductonBatchDesigner] = useState([]);
  const [currId, setCurrId] = useState(null);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const MAX_QUANTITY = 10405;
  let countRef = useRef(0);

  const headers = useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Плотность', accessor: 'density' },
      { Header: 'Ширина', accessor: 'width' },
      { Header: 'Количество', accessor: 'quantity' },
      { Header: 'Продукт + Брак', accessor: 'product_with_brack' },
      { Header: 'К-во, м3', accessor: 'quantity_m3' },
      { Header: 'Кол-во тортов', accessor: 'cakes_quantity' },
      { Header: 'Свободная продукция (cakes)', accessor: 'free_product_cakes' },
      { Header: 'Свободная продукция (упаковка)', accessor: 'free_product_package' },
      { Header: 'Итоговое кол-во cakes', accessor: 'total_cakes' },
      { Header: 'Cakes, размещенные', accessor: 'cakes_in_batch' },
      { Header: 'Cakes, остаток', accessor: 'cakes_residue' },
    ],
    []
  );

  const handleAddOnAutoclave = (row) => {
    setCurrId(row.id);
  };

  const addCakesData = useCallback(
    (prodBatchData) => {
      const quantity_cakes = (prodBatchData.product_with_brack / 3).toFixed(2);
      const free_product_cakes = (
        Math.ceil(quantity_cakes) - quantity_cakes
      ).toFixed(2);
      const free_product_package = Math.ceil(free_product_cakes * 3);

      const haveBatch = batchDesigner.length > 0;
      const total_cakes = Math.ceil(quantity_cakes);

      const cakes_in_batch = haveBatch
        ? batchDesigner.find((el) => el.id === prodBatchData.id).cakes_in_batch
        : autoclaveData?.filter(
            (unit) => unit.id_list_of_ordered_product === prodBatchData.id
          ).length;

      const cakes_residue = haveBatch
        ? batchDesigner.find((el) => el.id === prodBatchData.id).cakes_residue
        : Math.max(total_cakes - cakes_in_batch, 0);

      const updatedProdBatch = {
        ...prodBatchData,
        cakes_quantity: quantity_cakes,
        free_product_cakes,
        free_product_package,
        total_cakes,
        cakes_in_batch,
        cakes_residue,
      };

      setBatchFromBD((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === prodBatchData.id);

        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            id: prodBatchData.id,
            cakes_in_batch: 0,
            cakes_residue: total_cakes,
          };
          return updated;
        }

        return [
          ...prev,
          { id: prodBatchData.id, cakes_in_batch: 0, cakes_residue: total_cakes },
        ];
      });

      const existingBatch = batchDesigner?.find((el) => el?.id === prodBatchData.id);

      if (!existingBatch) {
        dispatch(
          addBatchState({
            id: prodBatchData.id,
            cakes_in_batch,
            cakes_residue,
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
    [autoclaveData, batchDesigner]
  );

  const transformAutoclaveData = (tAutoclave, prodBatchDesigner) => {
    if (!tAutoclave || !prodBatchDesigner) return [];

    const transformedAutoclave = tAutoclave.map((unit) => {
      const batch = prodBatchDesigner.find((prod) => {
        return prod.id === unit.id_list_of_ordered_product;
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
      (el) => el.quantity !== el.quantity_in_warehouse
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
      group.forEach(({ id, quantity, product }) => {
        const { m3, normOfBrack, width, density } = product;
        if (updatedTotalQuantity + quantity <= MAX_QUANTITY) {
          const batch = addCakesData({
            id,
            density,
            width,
            quantity,
            product_with_brack: (quantity * (1 + normOfBrack / 100)).toFixed(2),
            quantity_m3: (normOfBrack * m3).toFixed(2),
          });
          prodBatch.push(batch);
          updatedTotalQuantity += quantity;
        }
      });
    });

    setProductonBatchDesigner(prodBatch);
    setTotalQuantity(updatedTotalQuantity);
    const updatedAutoclaveData = transformAutoclaveData(autoclaveData, prodBatch);
    const filledAutoclave = [];
    for (let i = 0; i < updatedAutoclaveData.length; i += 21) {
      filledAutoclave.push(updatedAutoclaveData.slice(i, i + 21));
    }
    setAcData(filledAutoclave);
  }, [latestProducts, listOfOrderedCakes, autoclaveData]);

  useEffect(() => {
    if (currId !== null) {
      setAutoclave((prevAutoclave) => {
        const newAutoclaveState = prevAutoclave.map((autoclaveRow) =>
          autoclaveRow.map((cell) => ({ ...cell }))
        );
        const flatAutoclave = prevAutoclave.flat();
        let lastIndex = flatAutoclave.map((el) => el.id).lastIndexOf(currId);

        const haveElInAutoclave = lastIndex >= 0;
        const newAutoclave = [];

        let cakesPlaced = 0;
        let count = 0;

        const row = productionBatchDesigner.find((r) => r.id === currId);
        if (row) {
          const { id, density, width, cakes_residue } = row;
          if (haveElInAutoclave) {
            for (let i = 0; i < cakes_residue; i++) {
              flatAutoclave.splice(lastIndex + 1, 0, { id, density, width });
              lastIndex++;
            }
            while (flatAutoclave.length) {
              newAutoclave.push(flatAutoclave.splice(0, 21));
            }
          } else {
            for (let i = 0; i < newAutoclaveState.length; i++) {
              for (let j = 0; j < newAutoclaveState[i].length; j++) {
                if (!newAutoclaveState[i][j].id && cakesPlaced < cakes_residue) {
                  newAutoclaveState[i][j] = { id, density, width };
                  cakesPlaced++;
                  count++;
                }
              }
              if (cakesPlaced >= cakes_residue) break;
            }
          }
        }

        countRef.current = count;
        return haveElInAutoclave ? newAutoclave : newAutoclaveState;
      });
    }
  }, [currId]);

  useEffect(() => {
    if (autoclave.length !== 0) {
      setProductonBatchDesigner((prev) => {
        return prev.map((batchItem) => {
          for (let i = 0; i < batchDesigner.length; i++) {
            if (batchDesigner[i].id === batchItem.id) {
              return {
                ...batchItem,
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
      <div>
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
        <Autoclave acData={acData} batchFromBD={batchFromBD} />
      </div>
    </div>
  );
}

export default ProductionBatchDesigner;
