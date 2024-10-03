import { useEffect, useState, useCallback, useMemo } from 'react';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';

function ProductionBatchDesigner() {
  const { latestProducts } = useProductsContext();
  const { list_of_ordered_production } = useWarehouseContext();

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
      { Header: '+ Брак', accessor: 'normOfBrack' },
      { Header: 'К-во, м3', accessor: 'quantity_m3' },
      { Header: 'Кол-во тортов', accessor: 'cakes_quantity' },
      { Header: 'Свободный продукт (торты)', accessor: 'free_product_cakes' },
      { Header: 'Свободный продукт (упаковка)', accessor: 'free_product_package' },
      { Header: 'Итоговое кол-во тортов', accessor: 'total_cakes' },
      { Header: 'Действие', accessor: 'action' },
    ],
    []
  );

  const addCakesData = useCallback((normOfBrack) => {
    const cakes_const = normOfBrack / 3;
    const quantity_cakes = cakes_const.toFixed(2);
    const free_product_cakes = (Math.ceil(quantity_cakes) - quantity_cakes).toFixed(
      2
    );
    const free_product_package = Math.floor(free_product_cakes * 3);
    const total_cakes = Math.floor(quantity_cakes);

    setProdBatchDesigner((prev) =>
      prev.map((el) => ({
        ...el,
        cakes_quantity: quantity_cakes,
        free_product_cakes,
        free_product_package,
        total_cakes,
      }))
    );
  }, []);

  const handlePlace = useCallback((id) => {
    alert(`Разместить заказ с ID: ${id}`);
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
          {headers.map(({ accessor }) => (
            <td key={accessor}>{row[accessor]}</td>
          ))}
          <td>
            <button onClick={() => handlePlace(row.id)}>Разместить</button>
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
  }, [productionBatchDesigner, handlePlace, headers]);

  useEffect(() => {
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
        prodBatch.push({
          id,
          density,
          width,
          quantity,
          normOfBrack,
          quantity_m3: (normOfBrack * m3).toFixed(2),
        });
        updatedTotalQuantity += quantity;
      } else {
        addCakesData(normOfBrack);
        break;
      }
    }

    // Проверяем, изменились ли данные
    if (JSON.stringify(prodBatch) !== JSON.stringify(productionBatchDesigner)) {
      setProdBatchDesigner(prodBatch);
    }

    if (updatedTotalQuantity !== totalQuantity) {
      setTotalQuantity(updatedTotalQuantity);
    }
  }, [latestProducts, list_of_ordered_production, totalQuantity, addCakesData]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            {headers.map(({ Header, accessor }) => (
              <th key={accessor}>{Header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{console.log('renderGroupedRows', renderGroupedRows())}</tbody>
      </table>
    </div>
  );
}

export default ProductionBatchDesigner;
