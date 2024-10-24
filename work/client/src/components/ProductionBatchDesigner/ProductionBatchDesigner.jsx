import { useEffect, useState, useCallback, useMemo } from 'react';
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
  const { list_of_ordered_production } = useWarehouseContext();
  const { autoclaveData, autoclave, setAutoclave } = useOrderContext();

  const batchDesigner = useSelector((state) => state.batchDesigner);
  const [productionBatchDesigner, setProdBatchDesigner] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [quantityPallets, setQuantityPallets] = useState(0);
  const MAX_QUANTITY = 1405;

  // Мемоизация заголовков таблицы
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
    setAutoclave((prevAutoclave) => {
      const newAutoclaveState = prevAutoclave.map((autoclaveRow) =>
        autoclaveRow.map((cell) => ({ ...cell }))
      );

      const { id, density, width, total_cakes } = row;
      let cakesPlaced = 0;

      for (let i = 0; i < newAutoclaveState.length; i++) {
        for (let j = 0; j < newAutoclaveState[i].length; j++) {
          if (!newAutoclaveState[i][j].id && cakesPlaced < total_cakes) {
            newAutoclaveState[i][j] = { id, density, width };
            cakesPlaced++;
            count++;
          }
        }
        if (cakesPlaced >= total_cakes) break;
      }

      return newAutoclaveState;
    });

    setProdBatchDesigner((prevBatch) => {
      return prevBatch.map((batchItem) => {
        const { cakes_in_batch, total_cakes } = batchItem;
        if (batchItem.id === row.id) {
          dispatch(
            updateBatchState({
              id: row.id,
              cakes_in_batch: count,
              cakes_residue: total_cakes - count,
            })
          );

          dispatch(
            unlockButton({
              id: row.id,
              isButtonLocked: true,
            })
          );

          setQuantityPallets((count / 2) * 3);
          return {
            ...batchItem,
            cakes_in_batch: count / 2,
            cakes_residue: total_cakes - (cakes_in_batch + count / 2),
          };
        }

        return batchItem;
      });
    });
  };

  useEffect(() => {
    setProdBatchDesigner((prev) => {
      return prev.map((prodBatch) => {
        const matchingBatch = batchDesigner.find(
          (batch) => batch.id === prodBatch.id
        );
        if (
          matchingBatch &&
          (matchingBatch.cakes_in_batch !== prodBatch.cakes_in_batch ||
            matchingBatch.cakes_residue !== prodBatch.cakes_residue)
        ) {
          return {
            ...prodBatch,
            cakes_in_batch: matchingBatch.cakes_in_batch,
            cakes_residue: matchingBatch.cakes_residue,
          };
        }

        return prodBatch;
      });
    });
  }, [batchDesigner]);

  const addCakesData = useCallback((prodBatch) => {
    const quantity_cakes = (prodBatch.product_with_brack / 3).toFixed(2);
    const free_product_cakes = (Math.ceil(quantity_cakes) - quantity_cakes).toFixed(
      2
    );
    const free_product_package = Math.ceil(free_product_cakes * 3);

    const total_cakes = Math.ceil(quantity_cakes);

    const cakes_in_batch = autoclaveData.filter(
      (unit) => unit.id_list_of_ordered_product === prodBatch.id
    ).length;

    const cakes_residue = total_cakes - cakes_in_batch;

    const updatedProdBatch = {
      ...prodBatch,
      cakes_quantity: quantity_cakes,
      free_product_cakes,
      free_product_package,
      total_cakes,
      cakes_in_batch,
      cakes_residue,
    };

    dispatch(
      addBatchState({
        id: prodBatch.id,
        cakes_in_batch,
        cakes_residue,
      })
    );
    setQuantityPallets(cakes_in_batch * 3);

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
              disabled={batchDesigner.find((el) => el.id === row.id)?.isButtonLocked}
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
    if (!latestProducts || !list_of_ordered_production) return;

    const groupedByDensity = list_of_ordered_production.reduce((acc, curr) => {
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
  }, [latestProducts, list_of_ordered_production, autoclaveData]);

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
        <Autoclave autoclave={autoclave} quantity_pallets={quantityPallets} />
      </div>
    </div>
  );
}

export default ProductionBatchDesigner;
