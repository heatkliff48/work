import { useProjectContext } from '#components/contexts/Context.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useEffect, useState } from 'react';

function ProductionBatchDesigner() {
  const { latestProducts } = useProjectContext();
  const { list_of_ordered_production } = useWarehouseContext();
  const [production_batch_designer, setProdBatchDesigner] = useState([]);
  const MAX_QUANTITY = 1405;
  const prod_batch_designer = [];
  let totalQuantity = 0;

  const addCakesData = (normOfBrack) => {
    const cakes_const = normOfBrack / 3;

    const quantity_cakes = cakes_const.toFixed(2);

    const free_product_cakes = (Math.ceil(quantity_cakes) - quantity_cakes).toFixed(
      2
    );

    const free_product_package = Math.floor(free_product_cakes * 3);
    const total_cakes = Math.floor(quantity_cakes);
    const newArr = prod_batch_designer.map((el) => ({
      ...el,
      cakes_quantity: quantity_cakes,
      free_product_cakes,
      free_product_package,
      total_cakes,
    }));
    setProdBatchDesigner(newArr);
  };

  useEffect(() => {
    latestProducts?.sort((a, b) => a.density - b.density);

    for (let i = 0; i < list_of_ordered_production.length; i++) {
      const { product_article, id, quantity } = list_of_ordered_production[i];

      const product = latestProducts?.find((p) => p.article === product_article);

      const { m3, normOfBrack, width, density } = product;

      if (totalQuantity + quantity <= MAX_QUANTITY) {
        prod_batch_designer.push({
          id,
          density,
          width,
          quantity,
          normOfBrack,
          quantity_m3: normOfBrack * m3,
        });
        totalQuantity += quantity;
      } else {
        addCakesData(normOfBrack);
        return;
      }
    }
  }, []);
  return <></>;
}

export default ProductionBatchDesigner;
