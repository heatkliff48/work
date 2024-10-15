import { useEffect, useState, useCallback, useMemo } from 'react';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import Autoclave from './Autoclave';
import { useOrderContext } from '#components/contexts/OrderContext.js';

function ProductionBatchDesigner() {
  const { latestProducts } = useProductsContext();
  const { list_of_ordered_production } = useWarehouseContext();
  const { autoclaveData } = useOrderContext();

  const [totalCakes, setTotalCakes] = useState(0);
  const [autoclave, setAutoclave] = useState([]);
  const [productionBatchDesigner, setProdBatchDesigner] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
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

  // const cakes_in_batch = useMemo(() => {
  //   let result = 0;
  //   for (let i = 0; i < autoclaveData.length; i++) {
  //     if (!autoclaveData[i].id) return result;
  //     result++;
  //   }
  //   return result;
  // }, [autoclaveData]);

  // const cakes_residue = useMemo(() => {}, []);

  const addOnAutoclave = (row) => {
    const { id, density, width, total_cakes } = row;

    // console.log('addOnAutoclave', autoclave);

    const newAutoclaveState = autoclave.map((autoclave) => [...autoclave]);

    let cakesPlaced = 0;
    for (let i = 0; i < newAutoclaveState.length; i++) {
      for (let j = 0; j < newAutoclaveState[i].length; j++) {
        if (newAutoclaveState[i][j].id === null && cakesPlaced < total_cakes) {
          newAutoclaveState[i][j] = { id, density, width };
          cakesPlaced++;
        }
      }
      if (cakesPlaced >= total_cakes) break;
    }

    setAutoclave(newAutoclaveState);
  };

  const addCakesData = useCallback((prodBatch) => {
    const cakes_const = (prodBatch.product_with_brack * prodBatch.quantity) / 3;
    const quantity_cakes = cakes_const.toFixed(2);
    const free_product_cakes = (Math.ceil(quantity_cakes) - quantity_cakes).toFixed(
      2
    );
    const free_product_package = Math.ceil(free_product_cakes * 3);
    setTotalCakes(Math.ceil(quantity_cakes));

    const updatedProdBatch = {
      ...prodBatch,
      cakes_quantity: quantity_cakes,
      free_product_cakes,
      free_product_package,
      total_cakes: totalCakes,
      cakes_in_batch: 0,
      cakes_residue: 0, //total_cakes - cakes_in_batch
    };

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
            <button onClick={() => addOnAutoclave(row)}>Разместить</button>
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
  }, [productionBatchDesigner, headers]);

  useEffect(() => {
    console.log('list_of_ordered_production', list_of_ordered_production);
    if (!latestProducts || !list_of_ordered_production) return;

    const prodBatch = [];
    let updatedTotalQuantity = totalQuantity;

    latestProducts.sort((a, b) => a.density - b.density);

    for (let i = 0; i < list_of_ordered_production.length; i++) {
      const { product_article, id, quantity } = list_of_ordered_production[i];
      const product = latestProducts.find((p) => p.article === product_article);
      if (!product) continue;

      const { m3, normOfBrack, width, density } = product;

      if (updatedTotalQuantity + quantity <= MAX_QUANTITY) {
        const batch = addCakesData({
          id,
          density,
          width,
          quantity,
          product_with_brack: 1 + normOfBrack / 100,
          quantity_m3: (normOfBrack * m3).toFixed(2),
        });
        prodBatch.push(batch);
        updatedTotalQuantity += quantity;
      }
    }
    setProdBatchDesigner(prodBatch);
    setTotalQuantity(updatedTotalQuantity);

    const updatedAutoclaveData = transformAutoclaveData(autoclaveData, prodBatch);

    const filledAutoclave = [];
    for (let i = 0; i < updatedAutoclaveData.length; i += 21) {
      filledAutoclave.push(updatedAutoclaveData.slice(i, i + 21));
    }
    setAutoclave(filledAutoclave);
  }, [latestProducts, list_of_ordered_production, addCakesData]);

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
        <Autoclave autoclave={autoclave} />
      </div>
    </div>
  );
}

export default ProductionBatchDesigner;
