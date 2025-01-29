import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';
import { saveMaterialPlan } from '#components/redux/actions/recipeAction.js';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';

function RawMaterialsPlan() {
  const { list_of_recipes } = useRecipeContext();
  const { latestProducts } = useProductsContext();
  const batchOutside = useSelector((state) => state.batchOutside);
  const list_of_ordered_production = useSelector(
    (state) => state.listOfOrderedProduction
  );

  const [productsArray, setProductsArray] = useState([]);
  const [manualOrderShare, setManualOrderShare] = useState({});
  const [totals, setTotals] = useState({});

  const dispatch = useDispatch();

  const rawMaterials = [
    { name: 'Sand', title: 'sand', remaining: 0 },
    { name: 'Lime Lhoist', title: 'lime_lhoist', remaining: 0 },
    { name: 'Lime Barcelona', title: 'lime_barcelona', remaining: 0 },
    { name: 'Cement', title: 'cement', remaining: 0 },
    { name: 'Gypsum', title: 'gypsum', remaining: 0 },
    { name: 'Alu 1', title: 'alu_1', remaining: 0 },
    { name: 'Alu 2', title: 'alu_2', remaining: 0 },
    { name: 'Return slurry - solids', title: 'return_slurry_solids', remaining: 0 },
    { name: 'Return slurry - water', title: 'return_slurry_water', remaining: 0 },
    { name: 'Water', title: 'water', remaining: 0 },
    { name: 'Water cold', title: 'water_cold', remaining: 0 },
    { name: 'Water hot', title: 'water_hot', remaining: 0 },
    { name: 'Condensate', title: 'condensate', remaining: 0 },
  ];

  const raw_materials_table = [
    { Header: 'Sand', accessor: 'sand' },
    { Header: 'Lime Lhoist', accessor: 'lime_lhoist' },
    { Header: 'Lime Barcelona', accessor: 'lime_barcelona' },
    { Header: 'Cement', accessor: 'cement' },
    { Header: 'Gypsum', accessor: 'gypsum' },
    { Header: 'Alu 1', accessor: 'alu_1' },
    { Header: 'Alu 2', accessor: 'alu_2' },
    { Header: 'Return slurry - solids', accessor: 'return_slurry_solids' },
    { Header: 'Return slurry - water', accessor: 'return_slurry_water' },
    { Header: 'Water', accessor: 'water' },
    { Header: 'Water cold', accessor: 'water_cold' },
    { Header: 'Water hot', accessor: 'water_hot' },
    { Header: 'Condensate', accessor: 'condensate' },
  ];

  const handleOrderShareChange = (name, value) => {
    setManualOrderShare((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const calculateTotal = (material) => {
    return productsArray.reduce((sum, product) => {
      const amount = parseFloat(mathFunc(material.title, product)) || 0;
      return sum + amount;
    }, 0);
  };

  const calculateNeed = (total) => {
    return total < 0 ? -1 * total : 0;
  };

  const calculateTotalOrder = (need, orderShare) => {
    return need + need * ((orderShare || 0) / 100);
  };

  const mathFunc = (mat_num, product) => {
    if (!product.current_recipe) return 0;
    return (
      // product.current_recipe?.dry_total *
      (product.current_recipe[mat_num] * product.quantity).toFixed(2)
    );
  };

  const handlerSave = () => {
    dispatch(saveMaterialPlan(productsArray));
  };

  const handleRecipeChange = (index, selectedOption) => {
    setProductsArray((prev) =>
      prev.map((product, i) =>
        i === index
          ? {
              ...product,
              current_recipe: product.recipeArray.find(
                (recipe) => recipe.id === selectedOption.value
              ),
            }
          : product
      )
    );
  };

  useEffect(() => {
    const result = batchOutside
      .map((batch) => {
        const orderedProduct = list_of_ordered_production.find(
          (product) => product.id === batch.id_list_of_ordered_production
        );

        if (!orderedProduct) return null;
        const productArticle = orderedProduct.product_article;
        const quantity = batch.quantity_pallets / 3;

        const productDetails = latestProducts.find(
          (product) => product.article === productArticle
        );

        if (!productDetails) return null;

        const recipeArray = list_of_recipes.filter((recipe) => {
          return (
            recipe.density === productDetails.density &&
            recipe.certificate === productDetails.certificate
          );
        });

        const recipeOptions = recipeArray.map((recipe) => ({
          value: recipe.id,
          label: recipe.article,
        }));

        return {
          id_batch: batch.id,
          product_article: productArticle,
          quantity,
          recipeArray,
          recipeOptions,
          current_recipe: recipeArray[0],
        };
      })
      .filter(Boolean);

    setProductsArray(result);
  }, [batchOutside, list_of_ordered_production, list_of_recipes, latestProducts]);

  useEffect(() => {
    const updatedTotals = {};
    rawMaterials.forEach((material) => {
      const total = material.remaining - calculateTotal(material);
      const need = calculateNeed(total);
      const orderShare = manualOrderShare[material.name] || 0;
      const totalOrder = calculateTotalOrder(need, orderShare);

      updatedTotals[material.name] = {
        total,
        need,
        totalOrder,
      };
    });
    setTotals(updatedTotals);
  }, [manualOrderShare, productsArray]);

  return (
    <div className="raw-materials-plan">
      <table>
        {/* <thead>
          <tr>
            <th>Сырье</th>
            <th>Остатки сырья</th>
            {productsArray?.map((product, index) => (
              <th key={index} className="product-column">
                <div>Продукт: {product.product_article}</div>
                <div>
                  Рецепт:
                  {product?.current_recipe ? (
                    <Select
                      onChange={(selectedOption) =>
                        handleRecipeChange(index, selectedOption)
                      }
                      options={product.recipeOptions}
                      value={{
                        value: product.current_recipe?.id,
                        label: product.current_recipe?.article,
                      }}
                    />
                  ) : (
                    <> Рецепты отсутствуют</>
                  )}
                </div>
                <div>Количество: {product.quantity}</div>
              </th>
            ))}
            <th>Итого</th>
            <th>Потребность</th>
            <th>Доля заказа (ручной ввод)</th>
            <th>Итого заказа</th>
          </tr>
        </thead>
        <tbody>
          {rawMaterials.map((material, index) => (
            <tr key={index}>
              <td>{material.name}</td>
              <td>{material.remaining}</td>
              {productsArray?.map((product, i) => (
                <td key={`${index}-${i}`} className="product-data">
                  {mathFunc(material.title, product)}
                </td>
              ))}
              <td>{totals[material.name]?.total || 0}</td>
              <td>{totals[material.name]?.need || 0}</td>
              <td>
                <input
                  type="number"
                  value={manualOrderShare[material.name] || ''}
                  onChange={(e) =>
                    handleOrderShareChange(material.name, e.target.value)
                  }
                  placeholder="0"
                />
              </td>
              <td>{totals[material.name]?.totalOrder || 0}</td>
            </tr>
          ))}
        </tbody> */}
        <thead>
          <tr>
            <th></th>
            {rawMaterials.map((material, index) => (
              <th key={index}>{material.name}</th>
            ))}
            {/* <th></th>
            {raw_materials_table.map((el) => (
              <th key={el.accessor}>{el.Header}</th>
            ))} */}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Remaining raw materials</th>
            {rawMaterials.map((material, index) => (
              <td key={index}>{material.remaining}</td>
            ))}
          </tr>

          {productsArray?.map((product, index) => (
            <tr>
              <th key={index} className="product-column">
                <div>Product: {product.product_article}</div>
                <div>
                  Recipe:
                  {product?.current_recipe ? (
                    <Select
                      onChange={(selectedOption) =>
                        handleRecipeChange(index, selectedOption)
                      }
                      options={product.recipeOptions}
                      value={{
                        value: product.current_recipe?.id,
                        label: product.current_recipe?.article,
                      }}
                    />
                  ) : (
                    <> No recipes</>
                  )}
                </div>
                <div>Quantity: {product.quantity}</div>
              </th>

              {
                // productsArray?.map((product, i) =>
                rawMaterials.map((material) => (
                  <td className="product-data">
                    {mathFunc(material.title, product)}
                  </td>
                ))
                // )
              }
            </tr>
          ))}

          <tr>
            <th>Total</th>
            {rawMaterials.map((material, index) => (
              <td>{totals[material.name]?.total || 0}</td>
            ))}
          </tr>
          <tr>
            <th>Requirement</th>
            {rawMaterials.map((material, index) => (
              <td>{totals[material.name]?.need || 0}</td>
            ))}
          </tr>
          <tr>
            <th>Reorder share</th>
            {rawMaterials.map((material, index) => (
              <td>
                <input
                  type="number"
                  value={manualOrderShare[material.name] || ''}
                  onChange={(e) =>
                    handleOrderShareChange(material.name, e.target.value)
                  }
                  placeholder="0"
                />
              </td>
            ))}
          </tr>
          <tr>
            <th>Summary order</th>
            {rawMaterials.map((material, index) => (
              <td>{totals[material.name]?.totalOrder || 0}</td>
            ))}
          </tr>
        </tbody>
      </table>
      <button onClick={handlerSave}>Save</button>
    </div>
  );
}

export default RawMaterialsPlan;
