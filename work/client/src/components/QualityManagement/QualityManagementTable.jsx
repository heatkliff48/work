import Table from '#components/Table/Table';
import Button from 'react-bootstrap/Button';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { TextSearchFilter } from '#components/Table/filters.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ShowQualityManagementAddModal from './QualityManagementAddModal';
import {
  deleteQualityManagement,
  updateQualityManagement,
} from '#components/redux/actions/qualityManagementAction.js';
import {
  addNewAutoclaveCalendar,
  addNewWarehouse,
  updListOfOrderedProduction,
} from '#components/redux/actions/warehouseAction.js';
import {
  deleteBatchOutside,
  updateBatchOutside,
} from '#components/redux/actions/batchOutsideAction.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import {
  addNewRawMatConsumption,
  deleteRawMatConsumption,
} from '#components/redux/actions/recipeAction.js';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';
import { updateOrderToWarehouse } from '#components/redux/actions/orderToWarehouseAction.js';
import { Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

const QualityManagementTable = () => {
  const { userAccess } = useUsersContext();

  const {
    autoclave_calendar,
    list_of_ordered_production,
    raw_materials_warehouse,
    warehouse_data,
  } = useWarehouseContext();
  const { latestProducts } = useProductsContext();
  const { raw_mat_consumption, list_of_recipes, recipeOrders } =
    useRecipeContext();

  const dispatch = useDispatch();
  const qualityManagementData = useSelector(
    (state) => state.qualityManagementData,
  );
  const batchOutside = useSelector((state) => state.batchOutside);

  const [qualityManagementDataList, setQualityManagementDataList] = useState(
    [],
  );

  const [consumptionCalculated, setConsumptionCalculated] = useState({});
  const [dateValue, setDateValue] = useState(null);
  const [filteredList, setFilteredList] = useState([]);
  const [filteredRawMatConsumption, setFilteredRaw_MatConsumption] = useState();

  // Состояние для хранения значений полей ввода для каждой записи
  const [inputValues, setInputValues] = useState({});

  const COLUMNS_QUALITY_MANAGEMENT = [
    {
      Header: 'Produсt article',
      accessor: 'product_article',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Date',
      accessor: 'date',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Total Qty in batch, plan, pallets',
      accessor: 'total_quantity_plan',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Free Qty in batch, fact, pallets',
      accessor: 'free_quantity_fact',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Quantity on sorting, pallets',
      accessor: 'sorting',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Reserved Qty in batch, allocated, pallets',
      accessor: 'reserved_quantity_allocated',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Reserved Qty in batch, pallets',
      accessor: 'reserved_quantity',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Reserved Qty in batch, remaining, pallets',
      accessor: 'reserved_quantity_remaining',
      Filter: TextSearchFilter,
    },
  ];

  // Для артикула склада
  const getWarehouseArticle = (product, count) => {
    const type = 0;
    const certificate = product?.certificate?.slice(0, 1) || '';
    const density = product?.density?.toString().slice(0, 1) || '';

    const date = dateValue ? new Date(dateValue) : new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const dateStr = `${year}${month}${day}`;

    // Ищем все артикулы, содержащие эту дату
    const matchingArticles = warehouse_data.filter(
      (item) => item.article && item.article.includes(dateStr),
    );

    let nextNumber = 1;

    if (matchingArticles.length > 0) {
      // Извлекаем числовую часть (последние 6 цифр) и находим максимальное значение
      const numbers = matchingArticles.map((item) => {
        const numStr = item.article.slice(-6);
        return parseInt(numStr, 10);
      });

      nextNumber = Math.max(...numbers) + 1 + count;
    }

    // Форматируем число с ведущими нулями (6 цифр)
    const versionNumber = nextNumber.toString().padStart(6, '0');

    const warehouseArticle = `S${type}0${certificate}${density}${dateStr}${versionNumber}`;
    return warehouseArticle;
  };

  useEffect(() => {
    if (qualityManagementData) {
      setQualityManagementDataList(qualityManagementData);
      // Сначала находим density для заданного article
      const targetProduct = latestProducts.find(
        (product) =>
          product.article === qualityManagementData[0]?.product_article,
      );
      const targetDensity = targetProduct?.density;

      // Создаем список всех article с такой же density
      const filterList = latestProducts
        .filter((product) => product.density === targetDensity)
        .map((product) => product.article);

      // Фильтруем данные таблицы
      const filteredRawMatConsumption = raw_mat_consumption.filter((item) =>
        filterList.includes(item.batch_article),
      );
      const filtered = filteredRawMatConsumption.filter((item) => !item.used);
      setFilteredRaw_MatConsumption(filtered);

      // Инициализируем значения полей ввода для каждой записи
      const initialInputValues = {};
      qualityManagementData.forEach((item) => {
        const totalQty =
          item.reserved_quantity_allocated + item.free_quantity_fact;
        initialInputValues[item.id] = {
          totalQty: totalQty.toString(),
          sorting: item.sorting.toString(),
        };
      });
      setInputValues(initialInputValues);
    } else {
      const filtered = raw_mat_consumption.filter((item) => !item.used);
      setFilteredRaw_MatConsumption(filtered);
      console.log(filtered, 'filtered QualityManagementTable.jsx line 167');
    }
  }, [qualityManagementData]);

  // Обработчик для поля Total Qty in batch, fact, pallets для конкретной записи
  const handleTotalQtyChange = (recordId, e) => {
    const value = e.target.value;

    setInputValues((prev) => ({
      ...prev,
      [recordId]: {
        ...prev[recordId],
        totalQty: value,
      },
    }));

    if (value === '' || !qualityManagementData.length) return;

    const X = parseFloat(value);
    if (isNaN(X) || X < 0) return;

    const currentData = qualityManagementData.find(
      (item) => item.id === recordId,
    );
    if (!currentData) return;

    const {
      id,
      batch_id,
      product_article,
      total_quantity_plan,
      reserved_quantity,
      sorting,
    } = currentData;

    let newReservedQuantityAllocated;
    let newReservedQuantityRemaining;
    let newFreeQuantityFact;

    if (X - reserved_quantity >= 0) {
      newReservedQuantityAllocated = reserved_quantity;
      newReservedQuantityRemaining = 0;
      newFreeQuantityFact = X - reserved_quantity;
    } else {
      newReservedQuantityAllocated = X;
      newReservedQuantityRemaining = reserved_quantity - X;
      newFreeQuantityFact = 0;
    }

    dispatch(
      updateQualityManagement({
        id: id,
        batch_id,
        product_article,
        total_quantity_plan,
        reserved_quantity,
        reserved_quantity_allocated: newReservedQuantityAllocated,
        reserved_quantity_remaining: newReservedQuantityRemaining,
        free_quantity_fact: newFreeQuantityFact,
        sorting: inputValues[recordId]?.sorting
          ? parseFloat(inputValues[recordId].sorting)
          : sorting,
      }),
    );
  };

  // Обработчик для поля Quantity on sorting, pallets для конкретной записи
  const handleSortingChange = (recordId, e) => {
    const value = e.target.value;

    setInputValues((prev) => ({
      ...prev,
      [recordId]: {
        ...prev[recordId],
        sorting: value,
      },
    }));

    if (value === '' || !qualityManagementData.length) return;

    const sortingValue = parseFloat(value);
    if (isNaN(sortingValue) || sortingValue < 0) return;

    const currentData = qualityManagementData.find(
      (item) => item.id === recordId,
    );
    if (!currentData) return;

    const {
      id,
      batch_id,
      product_article,
      total_quantity_plan,
      reserved_quantity,
      reserved_quantity_allocated,
      reserved_quantity_remaining,
      free_quantity_fact,
    } = currentData;

    dispatch(
      updateQualityManagement({
        id: id,
        batch_id,
        product_article,
        total_quantity_plan,
        reserved_quantity,
        reserved_quantity_allocated,
        reserved_quantity_remaining,
        free_quantity_fact,
        sorting: sortingValue,
      }),
    );
  };

  // Обработка одной записи (вызывается в цикле)
  const processSingleBatch = async (currentData, count) => {
    const {
      id,
      batch_id,
      product_article,
      reserved_quantity_allocated,
      reserved_quantity_remaining,
      total_quantity_plan,
      free_quantity_fact,
      production_plan_id,
      sorting,
      raw_mat_cons_batch_id,
      id_ordered_product_to_warehouse,
    } = currentData;

    // 1. Фильтруем резервы для текущего product_article
    const reservedProducts =
      list_of_ordered_production?.filter(
        (item) => item.product_article === product_article,
      ) || [];

    // 2. Сколько осталось "свободного" количества
    let remainingFreeQty = free_quantity_fact;
    let summReserve = 0;

    // 3. Обходим каждый резерв и корректируем остатки
    const updatedReserves = reservedProducts.map((reservedItem) => {
      if (reservedItem.product_article !== product_article) {
        return reservedItem;
      }

      if (remainingFreeQty <= 0) {
        if (reservedItem.quantity == reservedItem.quantity_in_warehouse) {
          return reservedItem;
        } else if (reservedItem.quantity > reservedItem.quantity_in_warehouse) {
          const newQuantityInWarehouse = Math.min(
            reservedItem.quantity_in_warehouse + reserved_quantity_allocated,
            reservedItem.quantity,
          );
          return {
            ...reservedItem,
            quantity_in_warehouse: newQuantityInWarehouse,
          };
        }
      }

      const deducted = production_plan_id
        ? Math.min(
            Math.max(
              0,
              reservedItem.quantity -
                reservedItem.quantity_in_warehouse -
                reserved_quantity_allocated,
            ),
            remainingFreeQty,
          )
        : Math.min(
            reservedItem.quantity - reservedItem.quantity_in_warehouse,
            remainingFreeQty,
          );

      remainingFreeQty -= deducted;
      summReserve += deducted;

      const baseQuantityInWarehouse = reservedItem.quantity_in_warehouse;

      return production_plan_id
        ? {
            ...reservedItem,
            quantity_in_warehouse:
              baseQuantityInWarehouse + reserved_quantity_allocated + deducted,
          }
        : {
            ...reservedItem,
            quantity_in_warehouse: baseQuantityInWarehouse + deducted,
          };
    });

    // Проверки на корректность
    if (reserved_quantity_allocated < 0) {
      throw new Error(
        `Ошибка в записи ${id}: reserved_quantity_allocated не может быть отрицательным.`,
      );
    }

    if (summReserve < 0) {
      throw new Error(
        `Ошибка в записи ${id}: summReserve не может быть отрицательным.`,
      );
    }

    const calculatedOrderedQuantity = reserved_quantity_allocated + summReserve;

    // Добавляем на склад
    let totalQuantityForRawMatWarehouse = 0;
    totalQuantityForRawMatWarehouse +=
      (calculatedOrderedQuantity ?? 0) +
      (remainingFreeQty ?? 0) +
      (sorting ?? 0);

    const checkPallets = raw_materials_warehouse.some(
      (item) =>
        item.material_type == 'Pallets' &&
        item.remaining_quantity >= totalQuantityForRawMatWarehouse,
    );

    const checkPlastics = raw_materials_warehouse.some(
      (item) =>
        item.material_type == 'Plastics' &&
        item.remaining_quantity >= totalQuantityForRawMatWarehouse * 0.45,
    );

    if (!checkPallets) {
      const pallets =
        raw_materials_warehouse.find((item) => item.material_type == 'Pallets')
          ?.remaining_quantity || 0;
      throw new Error(
        `Not enough pallets in the warehouse for batch ${batch_id}. Available: ${pallets}, need: ${totalQuantityForRawMatWarehouse}.`,
      );
    }

    if (!checkPlastics) {
      const plastics =
        raw_materials_warehouse.find((item) => item.material_type == 'Plastics')
          ?.remaining_quantity || 0;
      throw new Error(
        `Not enough plastic in the warehouse for batch ${batch_id}. Available: ${plastics}, need: ${totalQuantityForRawMatWarehouse * 0.45}.`,
      );
    }

    const product = latestProducts.find((el) => el.article == product_article);
    const warehouse_article = getWarehouseArticle(product, count);

    if (calculatedOrderedQuantity + remainingFreeQty > 0) {
      await dispatch(
        addNewWarehouse({
          product_article,
          article: warehouse_article,
          warehouse_loc: 'local',
          free_quantity_remaining: remainingFreeQty,
          ordered_quantity: calculatedOrderedQuantity,
          total_quantity: calculatedOrderedQuantity + remainingFreeQty,
          type: 'OK',
          sorting: 0,
          batch_id: raw_mat_cons_batch_id,
        }),
      );
      if (id_ordered_product_to_warehouse) {
        await dispatch(
          updateOrderToWarehouse({
            id: id_ordered_product_to_warehouse,
            quantity_produced: remainingFreeQty,
            quantity_allocated: 0,
          }),
        );
      }
    }

    if (sorting > 0) {
      await dispatch(
        addNewWarehouse({
          product_article,
          article: warehouse_article,
          warehouse_loc: 'local',
          free_quantity_remaining: 0,
          ordered_quantity: 0,
          total_quantity: sorting,
          type: 'Sorting',
          sorting,
          batch_id: raw_mat_cons_batch_id,
        }),
      );
      if (id_ordered_product_to_warehouse) {
        await dispatch(
          updateOrderToWarehouse({
            id: id_ordered_product_to_warehouse,
            quantity_produced: remainingFreeQty,
            quantity_allocated: 0,
          }),
        );
      }
    }

    // Обновляем все затронутые позиции в list_of_ordered_production
    for (const ordered_production of updatedReserves) {
      await dispatch(updListOfOrderedProduction(ordered_production));
    }

    if (production_plan_id) {
      const batch = batchOutside.find(
        (batch) => batch.id === production_plan_id,
      );

      const productData = latestProducts.find(
        (el) => el.article == product_article,
      );

      if (productData) {
        const { m3InArray, volumeBlockOnPallet } = productData;
        const palletsPerArray = Math.max(
          1,
          Math.floor(m3InArray / volumeBlockOnPallet) || 1,
        );

        const recipe = recipeOrders.find(
          (recipe) => recipe.id_batch === production_plan_id,
        );

        const recipeDetails = list_of_recipes.find(
          (rec) => rec.id === recipe?.id_recipe,
        );

        await dispatch(
          addNewRawMatConsumption({
            recipe_article: recipeDetails?.article || 'Unknown Recipe',
            batch_article: batch?.product_article || 'Unknown Batch',
            production_volume:
              Math.ceil(
                (reserved_quantity_allocated + free_quantity_fact) /
                  palletsPerArray,
              ) || 0,
            date: batch?.date || 'Unknown Date',
          }),
        );
      }
    }

    await dispatch(
      deleteQualityManagement({
        id,
        quantity: totalQuantityForRawMatWarehouse,
      }),
    );

    if (production_plan_id) {
      const productData = latestProducts.find(
        (el) => el.article == product_article,
      );

      if (productData) {
        const { m3InArray, volumeBlockOnPallet } = productData;
        const widthInArray = m3InArray / volumeBlockOnPallet;

        if (
          reserved_quantity_remaining <= 0 ||
          total_quantity_plan - reserved_quantity_allocated <
            21 * Math.floor(widthInArray)
        ) {
          await dispatch(deleteBatchOutside(production_plan_id));
        } else {
          await dispatch(deleteBatchOutside(production_plan_id));
        }
      }
    }

    return { success: true, id, batch_id };
  };

  // Основной обработчик для всех записей
  const finishAllBatchesHandler = async () => {
    if (!qualityManagementDataList.length) {
      alert('No batches to process');
      return;
    }

    if (!dateValue) {
      alert('No date selected.');
      return;
    }

    const isConfirmed = window.confirm(
      `Are you sure you want to finish ALL ${qualityManagementDataList.length} batch(es)?\nPress 'OK' to confirm or 'Cancel' to exit.`,
    );

    if (!isConfirmed) return;

    const errors = [];
    const processedBatches = [];

    let count = 0;

    // Обрабатываем каждую запись последовательно
    for (const record of qualityManagementDataList) {
      try {
        const result = await processSingleBatch(record, count);
        processedBatches.push(result);
        count += 1;
      } catch (error) {
        console.error(`Error processing batch ${record.batch_id}:`, error);
        errors.push({
          batch_id: record.batch_id,
          error: error.message,
        });
      }
    }

    // Очищаем состояние inputValues для обработанных записей
    if (processedBatches.length > 0) {
      setInputValues((prev) => {
        const newValues = { ...prev };
        processedBatches.forEach(({ id }) => {
          delete newValues[id];
        });
        return newValues;
      });
    }

    // Удаляем consumptionCalculated если нужно
    if (consumptionCalculated.consumption_calculated) {
      await dispatch(
        deleteRawMatConsumption({
          id: consumptionCalculated?.id,
        }),
      );
      setConsumptionCalculated({});
    }

    // Показываем итоговое сообщение
    if (errors.length > 0) {
      const errorMessages = errors
        .map((e) => `- ${e.batch_id}: ${e.error}`)
        .join('\n');
      alert(
        `Processed ${processedBatches.length} batch(es) successfully.\n` +
          `Failed to process ${errors.length} batch(es):\n${errorMessages}`,
      );
    } else {
      alert(`Successfully processed all ${processedBatches.length} batch(es)!`);
    }
  };

  return (
    <Fragment>
      <Table
        COLUMN_DATA={COLUMNS_QUALITY_MANAGEMENT}
        dataOfTable={qualityManagementDataList}
        tableName={'Quality Management'}
        userAccess={userAccess}
        handleRowClick={(row) => {}}
      />

      {/* Отображаем поля ввода для каждой записи */}
      {qualityManagementDataList.map((record) => (
        <div key={record.id} className="mb-4 p-3 border rounded">
          <h5 className="mb-3">Batch: {record.product_article}</h5>

          <div className="d-flex gap-4 flex-wrap align-items-end">
            {/* Поле ввода для Total Qty in batch, fact, pallets */}
            <div className="border rounded p-3 bg-light">
              <Form.Label
                htmlFor={`totalQtyInput-${record.id}`}
                className="fw-bold"
              >
                Total Qty in batch, fact, pallets
              </Form.Label>
              <Form.Control
                id={`totalQtyInput-${record.id}`}
                type="number"
                min="0"
                step="1"
                value={inputValues[record.id]?.totalQty || ''}
                onChange={(e) => handleTotalQtyChange(record.id, e)}
                placeholder="Enter total qty"
                style={{ width: '200px' }}
              />
            </div>

            {/* Поле ввода для Quantity on sorting, pallets */}
            <div className="border rounded p-3 bg-light">
              <Form.Label
                htmlFor={`sortingInput-${record.id}`}
                className="fw-bold"
              >
                Quantity on sorting, pallets
              </Form.Label>
              <Form.Control
                id={`sortingInput-${record.id}`}
                type="number"
                min="0"
                step="1"
                value={inputValues[record.id]?.sorting || ''}
                onChange={(e) => handleSortingChange(record.id, e)}
                placeholder="Enter sorting qty"
                style={{ width: '200px' }}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Одна кнопка для завершения всех записей */}
      {qualityManagementDataList.length > 0 && (
        <div className="d-flex gap-2 mb-4">
          <DatePicker
            id="data_pcker"
            type="text"
            selected={dateValue}
            onChange={(date) => setDateValue(date)}
            dateFormat="dd.MM.yyyy"
          />
          <Button variant="warning" size="lg" onClick={finishAllBatchesHandler}>
            Finish ALL batches ({qualityManagementDataList.length})
          </Button>
        </div>
      )}

      <ShowQualityManagementAddModal
        setConsumptionCalculated={setConsumptionCalculated}
        filteredRawMatConsumption={
          qualityManagementDataList.length > 0
            ? filteredRawMatConsumption
            : null
        }
      />
    </Fragment>
  );
};

export default QualityManagementTable;
