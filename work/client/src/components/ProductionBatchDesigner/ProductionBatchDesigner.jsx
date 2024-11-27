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
  const { autoclaveData, autoclave, setAutoclave } = useOrderContext();

  const batchDesigner = useSelector((state) => state.batchDesigner);
  const [batchFromBD, setBatchFromBD] = useState([]);
  const [productionBatchDesigner, setProdBatchDesigner] = useState([]);
  const [currId, setCurrId] = useState(null);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [quantityPallets, setQuantityPallets] = useState({});

  const MAX_QUANTITY = 1405;
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

  const addOnAutoclave = (row) => {
    let count = 0;
    setCurrId(row.id);

    setAutoclave((prevAutoclave) => {
      const newAutoclaveState = prevAutoclave.map((autoclaveRow) =>
        autoclaveRow.map((cell) => ({ ...cell }))
      );

      const { id, density, width, cakes_residue } = row;
      let cakesPlaced = 0;

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

      countRef.current = count;
      return newAutoclaveState;
    });
  };

  const addCakesData = useCallback((prodBatch) => {
    const quantity_cakes = (prodBatch.product_with_brack / 3).toFixed(2);
    const free_product_cakes = (Math.ceil(quantity_cakes) - quantity_cakes).toFixed(
      2
    );
    const free_product_package = Math.ceil(free_product_cakes * 3);

    const total_cakes = Math.ceil(quantity_cakes);

    const cakes_in_batch = autoclaveData?.filter(
      (unit) => unit.id_list_of_ordered_product === prodBatch.id
    ).length;

    const cakes_residue = total_cakes - cakes_in_batch ?? 0;

    const updatedProdBatch = {
      ...prodBatch,
      cakes_quantity: quantity_cakes,
      free_product_cakes,
      free_product_package,
      total_cakes,
      cakes_in_batch,
      cakes_residue,
    };

    setBatchFromBD((prev) => [
      ...prev,
      { id: prodBatch.id, cakes_in_batch, cakes_residue },
    ]);

    const existingBatch = batchDesigner?.find((el) => el?.id === prodBatch.id);

    if (!existingBatch) {
      dispatch(
        addBatchState({
          id: prodBatch.id,
          cakes_in_batch,
          cakes_residue,
        })
      );
    }

    if (cakes_in_batch > 0) {
      dispatch(
        unlockButton({
          id: prodBatch.id,
          isButtonLocked: true,
        })
      );
    }

    return updatedProdBatch;
  }, []);

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
              onClick={() => addOnAutoclave(row)}
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

  useEffect(() => {
    const currentCount =
      countRef.current === 0
        ? batchDesigner.find((el) => el.id === currId)?.cakes_in_batch ?? 0
        : countRef?.current;

    setProdBatchDesigner((prevBatch) => {
      return prevBatch.map((batchItem) => {
        const { cakes_in_batch, total_cakes, cakes_residue } = batchItem;

        if (batchItem?.id === currId) {
          const new_cakes_residue =
            cakes_residue - currentCount < 0 ? 0 : cakes_residue - currentCount;
          dispatch(
            updateBatchState({
              id: currId,
              cakes_in_batch: currentCount,
              cakes_residue: new_cakes_residue,
            })
          );

          dispatch(
            unlockButton({
              id: currId,
              isButtonLocked: cakes_residue === 0,
            })
          );

          if (cakes_residue !== 0) {
            setQuantityPallets((prev) => {
              return {
                ...prev,
                [currId]: currentCount * 3,
              };
            });
          }
          return {
            ...batchItem,
            cakes_in_batch: cakes_in_batch + currentCount,
            cakes_residue: total_cakes - (cakes_in_batch + currentCount) ?? 0,
          };
        }

        return batchItem;
      });
    });
    countRef.current = 0;
  }, [autoclave, currId]);

  useEffect(() => {
    setProdBatchDesigner((prev) => {
      return prev.map((batchItem) => {
        for (let i = 0; i < batchDesigner.length; i++) {
          if (batchDesigner[i].id === batchItem.id) {
            // ------------- возможно это понадобится

            // if (
            //   !batchDesigner?.find((el) => el.id === batchItem.id)?.isButtonLocked
            // ) {
            //   setQuantityPallets((prev) => {
            //     return {
            //       ...prev,
            //       [batchDesigner[i].id]: batchDesigner[i].cakes_in_batch * 3,
            //     };
            //   });
            // }
            // console.log(
            //   'batchDesigner[i].cakes_in_batch',
            //   batchDesigner[i].cakes_in_batch
            // );
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
  }, [batchDesigner]);

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
            product_with_brack: quantity * (1 + normOfBrack / 100),
            quantity_m3: (normOfBrack * m3).toFixed(2),
          });
          prodBatch.push(batch);
          updatedTotalQuantity += quantity;
        }
      });
    });

    setProdBatchDesigner(prodBatch);
    setTotalQuantity(updatedTotalQuantity);

    const updatedAutoclaveData = transformAutoclaveData(autoclaveData, prodBatch);

    const filledAutoclave = [];
    for (let i = 0; i < updatedAutoclaveData.length; i += 21) {
      filledAutoclave.push(updatedAutoclaveData.slice(i, i + 21));
    }
    setAutoclave(filledAutoclave);
  }, [latestProducts, listOfOrderedCakes, autoclaveData]);

  const transformAutoclaveData = (autoclave, prodBatchDesigner) => {
    if (!autoclave || !prodBatchDesigner) return [];

    const transformedAutoclave = autoclave.map((unit) => {
      const batch = prodBatchDesigner.find(
        (prod) => prod.id === unit.id_list_of_ordered_product
      );

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
        <Autoclave
          autoclave={autoclave}
          quantity_pallets={quantityPallets}
          batchFromBD={batchFromBD}
        />
      </div>
    </div>
  );
}

export default ProductionBatchDesigner;
