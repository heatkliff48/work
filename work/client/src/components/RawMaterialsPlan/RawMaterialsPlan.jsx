import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { saveMaterialPlan } from '#components/redux/actions/recipeAction.js';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';

import '#components/Styles/raw-materials-plan.css';

function RawMaterialsPlan({ batchId, onSaved } = {}) {
  const { list_of_recipes, recipe_info } = useRecipeContext();
  const { latestProducts } = useProductsContext();
  const { raw_materials_warehouse } = useWarehouseContext();
  const batchOutside = useSelector((state) => state.batchOutside);
  const list_of_ordered_production = useSelector(
    (state) => state.listOfOrderedProduction,
  );
  const warehouseAluminum1 = useSelector((state) => state.warehouseAluminum1);
  const recipeOrders = useSelector((state) => state.recipeOrders);

  const [productsArray, setProductsArray] = useState([]);
  const [manualOrderShare, setManualOrderShare] = useState({});
  const [totals, setTotals] = useState({});

  const dispatch = useDispatch();

  const excludedAccessors = [
    'article',
    'cake_height',
    'solids',
    'volume',
    'density_recipe',
    'produced_return_dry',
    'water_solids',
    'description',
    'sand_dry',
    // Aluminum is not tied to a fixed slot/header: a recipe's two aluminum
    // slots can reference any of the physical aluminum types in stock, so it
    // is handled separately below, grouped by actual type instead of slot.
    'aluminum_type',
    'aluminum_paste',
    'aluminum_2_type',
    'aluminum_paste_2',
  ];

  // Raw materials already reserved by batches planned elsewhere (i.e. not part
  // of this view) must be deducted from warehouse stock, so "remaining" here
  // reflects free stock rather than total stock. Batches shown in the current
  // view are excluded from this deduction since their own need is already
  // accounted for separately in the "Total"/"Requirement" rows below.
  const currentBatchIds = new Set(
    productsArray.map((product) => product.id_batch),
  );

  const reservedByTitle = {};
  const reservedAluminumByType = {};

  (recipeOrders || []).forEach((order) => {
    if (currentBatchIds.has(order.id_batch)) return;

    const recipe = (list_of_recipes || []).find(
      (r) => r.id === order.id_recipe,
    );
    const volume = Number(order.production_volume) || 0;
    if (!recipe || !volume) return;

    recipe_info
      .filter((item) => !excludedAccessors.includes(item.accessor))
      .forEach((item) => {
        const amount = Number(recipe[item.accessor]) || 0;
        if (!amount) return;
        reservedByTitle[item.accessor] =
          (reservedByTitle[item.accessor] || 0) + amount * volume;
      });

    if (recipe.aluminum_type) {
      reservedAluminumByType[recipe.aluminum_type] =
        (reservedAluminumByType[recipe.aluminum_type] || 0) +
        (Number(recipe.aluminum_paste) || 0) * volume;
    }
    if (recipe.aluminum_2_type) {
      reservedAluminumByType[recipe.aluminum_2_type] =
        (reservedAluminumByType[recipe.aluminum_2_type] || 0) +
        (Number(recipe.aluminum_paste_2) || 0) * volume;
    }
  });

  const rawMaterials = recipe_info
    .filter((item) => !excludedAccessors.includes(item.accessor))
    .map((item) => {
      const warehouseMaterial = raw_materials_warehouse.find(
        (warehouseItem) =>
          warehouseItem.material_type ===
          item.Header.replace(/, kg$/, '').trim(),
      );

      const stock = warehouseMaterial
        ? warehouseMaterial.remaining_quantity
        : 0;
      const reserved = reservedByTitle[item.accessor] || 0;

      return {
        name: item.Header,
        title: item.accessor,
        remaining: Math.round((stock - reserved) * 100) / 100,
      };
    });

  const aluminumRemainingByType = (warehouseAluminum1 || []).reduce(
    (map, item) => {
      const type = item?.type ? String(item.type).trim() : null;
      if (!type) return map;
      const available =
        (Number(item.quantity) || 0) - (Number(item.consumed_quantity) || 0);
      map[type] = (map[type] || 0) + available;
      return map;
    },
    {},
  );

  new Set([
    ...Object.keys(aluminumRemainingByType),
    ...Object.keys(reservedAluminumByType),
  ]).forEach((type) => {
    const available = aluminumRemainingByType[type] || 0;
    const reserved = reservedAluminumByType[type] || 0;
    aluminumRemainingByType[type] =
      Math.round((available - reserved) * 100) / 100;
  });

  const aluminumTypes = Array.from(
    new Set(
      [
        ...Object.keys(aluminumRemainingByType),
        ...productsArray.flatMap((product) => [
          product.current_recipe?.aluminum_type,
          product.current_recipe?.aluminum_2_type,
        ]),
      ].filter(Boolean),
    ),
  );

  const getAluminumAmount = (type, product) => {
    if (!product.current_recipe) return 0;
    const recipe = product.current_recipe;
    let amount = 0;
    if (recipe.aluminum_type === type) amount += recipe.aluminum_paste || 0;
    if (recipe.aluminum_2_type === type) amount += recipe.aluminum_paste_2 || 0;
    return (amount * product.quantity).toFixed(2);
  };

  const calculateAluminumTotal = (type) => {
    return productsArray.reduce((sum, product) => {
      const amount = parseFloat(getAluminumAmount(type, product)) || 0;
      return sum + amount;
    }, 0);
  };

  const handleOrderShareChange = (name, value) => {
    setManualOrderShare((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
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
    return Math.round((need + need * ((orderShare || 0) / 100)) * 100) / 100;
  };

  const mathFunc = (mat_num, product) => {
    if (!product.current_recipe) return 0;
    return (product.current_recipe[mat_num] * product.quantity).toFixed(2);
  };

  const handlerSave = () => {
    dispatch(saveMaterialPlan(productsArray));
    onSaved?.();
  };

  const handleRecipeChange = (index, selectedOption) => {
    setProductsArray((prev) =>
      prev.map((product, i) =>
        i === index
          ? {
              ...product,
              current_recipe: product.recipeArray.find(
                (recipe) => recipe.id === selectedOption.value,
              ),
            }
          : product,
      ),
    );
  };

  useEffect(() => {
    const sourceBatches = batchId
      ? batchOutside.filter((batch) => batch.id === batchId)
      : batchOutside;

    const result = sourceBatches
      .map((batch) => {
        let orderedProduct;

        orderedProduct = list_of_ordered_production.find(
          (product) => product.id === batch.id_list_of_ordered_production,
        );

        if (!orderedProduct) {
          orderedProduct = { product_article: batch.product_article };
        }

        const productArticle = orderedProduct.product_article;

        const productDetails = latestProducts.find(
          (product) => product.article === productArticle,
        );

        if (!productDetails) return null;

        if (!productDetails) return null;

        const quantity =
          batch.quantity_pallets /
          Math.floor(
            productDetails.m3InArray / productDetails.volumeBlockOnPallet,
          );

        const recipeArray = list_of_recipes.filter((recipe) => {
          return (
            recipe.density === productDetails.density &&
            recipe.certificate === productDetails.certificate
          );
        });

        const recipeOptions = recipeArray.map((recipe) => ({
          value: recipe.id,
          label: recipe?.description,
        }));

        const prodDescription = productDetails?.description.match(
          /BAUBLOCK®\s+([^ ]+(?:\s+[^ ]+)?\s+\d*\.?\d+)/,
        );

        return {
          id_batch: batch.id,
          product_article: productArticle,
          quantity,
          recipeArray,
          recipeOptions,
          current_recipe: recipeArray[0],
          description: prodDescription ? prodDescription[1] : '',
          date: batch.date,
        };
      })
      .filter(Boolean);

    setProductsArray(result);
  }, [
    batchOutside,
    list_of_ordered_production,
    list_of_recipes,
    latestProducts,
    batchId,
  ]);

  useEffect(() => {
    const updatedTotals = {};
    rawMaterials.forEach((material) => {
      const total =
        Math.round((material.remaining - calculateTotal(material)) * 100) / 100;
      const need = Math.round(calculateNeed(total) * 100) / 100;
      const orderShare = manualOrderShare[material.name] || 0;
      const totalOrder =
        Math.round(calculateTotalOrder(need, orderShare) * 100) / 100;

      updatedTotals[material.name] = {
        total,
        need,
        totalOrder,
      };
    });

    aluminumTypes.forEach((type) => {
      const key = `Aluminum|${type}`;
      const total =
        Math.round(
          ((aluminumRemainingByType[type] || 0) -
            calculateAluminumTotal(type)) *
            100,
        ) / 100;
      const need = Math.round(calculateNeed(total) * 100) / 100;
      const orderShare = manualOrderShare[key] || 0;
      const totalOrder =
        Math.round(calculateTotalOrder(need, orderShare) * 100) / 100;

      updatedTotals[key] = {
        total,
        need,
        totalOrder,
      };
    });

    aluminumTypes.forEach((type) => {
      const key = `Aluminum|${type}`;
      const total =
        Math.round(
          ((aluminumRemainingByType[type] || 0) -
            calculateAluminumTotal(type)) *
            100,
        ) / 100;
      const need = Math.round(calculateNeed(total) * 100) / 100;
      const orderShare = manualOrderShare[key] || 0;
      const totalOrder =
        Math.round(calculateTotalOrder(need, orderShare) * 100) / 100;

      updatedTotals[key] = {
        total,
        need,
        totalOrder,
      };
    });

    setTotals(updatedTotals);
  }, [
    manualOrderShare,
    productsArray,
    raw_materials_warehouse,
    warehouseAluminum1,
    recipeOrders,
    list_of_recipes,
  ]);

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
            {aluminumTypes.map((type) => (
              <th key={`alu-${type}`}>Aluminum ({type})</th>
            ))}
            {aluminumTypes.map((type) => (
              <th key={`alu-${type}`}>Aluminum ({type})</th>
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
            {aluminumTypes.map((type) => (
              <td key={`alu-${type}`}>{aluminumRemainingByType[type] || 0}</td>
            ))}
            {aluminumTypes.map((type) => (
              <td key={`alu-${type}`}>{aluminumRemainingByType[type] || 0}</td>
            ))}
          </tr>

          {productsArray?.map((product, index) => (
            <tr>
              <th key={index} className="product-column">
                <div>Product: {product?.description}</div>
                <div>Date: {product.date}</div>
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
                        label: product.current_recipe?.description,
                      }}
                      styles={{
                        singleValue: (provided) => ({
                          ...provided,
                          color: 'black', // цвет текста выбранного значения
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          color: state.isSelected ? 'white' : 'black', // выбранная белая, остальные чёрные
                          backgroundColor: state.isSelected
                            ? '#2684FF'
                            : state.isFocused
                              ? '#e6f0ff' // подсветка при наведении
                              : 'white',
                        }),
                        control: (provided) => ({
                          ...provided,
                          backgroundColor: 'white',
                          color: 'black',
                        }),
                      }}
                    />
                  ) : (
                    <> No recipes</>
                  )}
                </div>
                <div>Cake amount: {product.quantity}</div>
                <div>Description: {product?.current_recipe?.description}</div>
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
              {aluminumTypes.map((type) => (
                <td key={`alu-${type}`} className="product-data">
                  {getAluminumAmount(type, product)}
                </td>
              ))}
              {aluminumTypes.map((type) => (
                <td key={`alu-${type}`} className="product-data">
                  {getAluminumAmount(type, product)}
                </td>
              ))}
            </tr>
          ))}

          <tr>
            <th>Total</th>
            {rawMaterials.map((material, index) => (
              <td>{totals[material.name]?.total || 0}</td>
            ))}
            {aluminumTypes.map((type) => (
              <td key={`alu-${type}`}>
                {totals[`Aluminum|${type}`]?.total || 0}
              </td>
            ))}
            {aluminumTypes.map((type) => (
              <td key={`alu-${type}`}>
                {totals[`Aluminum|${type}`]?.total || 0}
              </td>
            ))}
          </tr>
          <tr>
            <th>Requirement</th>
            {rawMaterials.map((material, index) => (
              <td>{totals[material.name]?.need || 0}</td>
            ))}
            {aluminumTypes.map((type) => (
              <td key={`alu-${type}`}>
                {totals[`Aluminum|${type}`]?.need || 0}
              </td>
            ))}
            {aluminumTypes.map((type) => (
              <td key={`alu-${type}`}>
                {totals[`Aluminum|${type}`]?.need || 0}
              </td>
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
            {aluminumTypes.map((type) => (
              <td key={`alu-${type}`}>
                <input
                  type="number"
                  value={manualOrderShare[`Aluminum|${type}`] || ''}
                  onChange={(e) =>
                    handleOrderShareChange(`Aluminum|${type}`, e.target.value)
                  }
                  placeholder="0"
                />
              </td>
            ))}
            {aluminumTypes.map((type) => (
              <td key={`alu-${type}`}>
                <input
                  type="number"
                  value={manualOrderShare[`Aluminum|${type}`] || ''}
                  onChange={(e) =>
                    handleOrderShareChange(`Aluminum|${type}`, e.target.value)
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
            {aluminumTypes.map((type) => (
              <td key={`alu-${type}`}>
                {totals[`Aluminum|${type}`]?.totalOrder || 0}
              </td>
            ))}
            {aluminumTypes.map((type) => (
              <td key={`alu-${type}`}>
                {totals[`Aluminum|${type}`]?.totalOrder || 0}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <button onClick={handlerSave}>Save</button>
    </div>
  );
}

export default RawMaterialsPlan;
