import Table from '#components/Table/Table';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { TextSearchFilter } from '#components/Table/filters.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ShowQualityManagementAddModal from './QualityManagementAddModal';
import {
  addNewQualityManagement,
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
import DatePicker from 'react-datepicker';
import ModalTable from './ModalTable';
import '#components/Clients/ClientsInfo/clientsDrawer.css';
import '#components/Styles/table.css';
import './qualityManagement.css';

// Ячейки таблицы. Объявлены на уровне модуля: react-table рендерит Cell как
// <Cell />, и функция, созданная внутри компонента, пересоздавала бы input
// на каждое нажатие клавиши — фокус терялся бы.
const BatchIdCell = ({ value }) =>
  value === null || value === undefined || value === '' ? (
    <span className="cl-muted">—</span>
  ) : (
    <span className="qm-chip cl-mono">{value}</span>
  );

const QtyInputCell = ({ row, column }) => {
  const { id, product_article } = row.original;

  return (
    <input
      className="qm-input qm-input--cell"
      id={`${column.inputIdPrefix}-${id}`}
      aria-label={`${column.Header} — ${product_article}`}
      type="number"
      min="0"
      step="1"
      value={column.inputValues[id]?.[column.inputKey] || ''}
      onChange={(e) => column.onInputChange(id, e)}
      onClick={(e) => e.stopPropagation()}
      placeholder="0"
    />
  );
};

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
  // Пластик на упаковку вводится вручную, общий на все партии, kg
  const [plasticUsed, setPlasticUsed] = useState('');
  const [plasticWasted, setPlasticWasted] = useState('');
  const [filteredList, setFilteredList] = useState([]);
  const [relatedProductsModal, setRelatedProductsModal] = useState(false);

  // Состояние для хранения значений полей ввода для каждой записи
  const [inputValues, setInputValues] = useState({});
  const [batchID, setBatchID] = useState(null);

  // Только отображение: 'cards' | 'list'. На данные не влияет.
  const [mode, setMode] = useState('cards');

  const addProductHandler = (prod_data) => {
    const { article } = prod_data;

    dispatch(
      addNewQualityManagement({
        batch_id: null,
        product_article: article,
        total_quantity_plan: 0,
        reserved_quantity: 0,
        reserved_quantity_allocated: 0,
        reserved_quantity_remaining: 0,
        free_quantity_fact: 0,
        from_production_plan: false,
        sorting: 0,
      }),
    );
  };

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

      if (!batchID) {
        setBatchID(qualityManagementData[0]?.raw_mat_cons_batch_id);
      }

      // Создаем список всех article с такой же density
      const filterList = latestProducts.filter(
        (product) => product.density === targetDensity,
      );

      setFilteredList(filterList);

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

    console.log(currentData, 'currentData QualityManagementTable.jsx line 237');

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
  // plasticQuantity > 0 только у одной партии — пластик списывается один раз
  const processSingleBatch = async (currentData, count, plasticQuantity = 0) => {
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

    const reservedProducts =
      list_of_ordered_production?.filter(
        (item) => item.product_article === product_article,
      ) || [];

    // Сколько из текущей партии нужно распределить по заказам
    let remainingReservedQuantity = Math.max(
      0,
      Number(reserved_quantity_allocated) || 0,
    );

    const initiallyReservedQuantity = remainingReservedQuantity;

    const updatedReserves = reservedProducts.map((reservedItem) => {
      const orderedQuantity = Math.max(0, Number(reservedItem.quantity) || 0);

      const quantityInWarehouse = Math.max(
        0,
        Number(reservedItem.quantity_in_warehouse) || 0,
      );

      // Сколько ещё не хватает конкретной позиции
      const remainingNeed = Math.max(0, orderedQuantity - quantityInWarehouse);

      // Выделяем только часть общего резерва
      const allocatedQuantity = Math.min(
        remainingNeed,
        remainingReservedQuantity,
      );

      remainingReservedQuantity -= allocatedQuantity;

      return {
        ...reservedItem,
        quantity_in_warehouse: quantityInWarehouse + allocatedQuantity,
      };
    });

    // Сколько действительно распределили по заказам
    const calculatedOrderedQuantity =
      initiallyReservedQuantity - remainingReservedQuantity;

    // Если резерв почему-то не удалось распределить,
    // он становится свободной продукцией
    const remainingFreeQty =
      Math.max(0, Number(free_quantity_fact) || 0) + remainingReservedQuantity;

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

    if (!checkPallets) {
      const pallets =
        raw_materials_warehouse.find((item) => item.material_type == 'Pallets')
          ?.remaining_quantity || 0;
      throw new Error(
        `Not enough pallets in the warehouse for batch ${batch_id}. Available: ${pallets}, need: ${totalQuantityForRawMatWarehouse}.`,
      );
    }

    const product = latestProducts.find((el) => el.article == product_article);
    const warehouse_article = getWarehouseArticle(product, count);

    console.log(
      calculatedOrderedQuantity,
      'calculatedOrderedQuantity QualityManagementTable.jsx line 447',
    );
    console.log(
      remainingFreeQty,
      'remainingFreeQty QualityManagementTable.jsx line 448',
    );

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
          batch_id: raw_mat_cons_batch_id || batchID,
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
          batch_id: raw_mat_cons_batch_id || batchID,
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

    console.log(
      updatedReserves,
      'updatedReserves QualityManagementTable.jsx line 506',
    );

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
        plastic_quantity: plasticQuantity,
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

  const finishAllBatchesHandler = async () => {
    if (!qualityManagementDataList.length) {
      alert('No batches to process');
      return;
    }

    if (!dateValue) {
      alert('No date selected.');
      return;
    }

    if (plasticUsed === '' || plasticWasted === '') {
      alert('Enter plastic total used and total wasted, kg.');
      return;
    }

    const used = parseFloat(plasticUsed);
    const wasted = parseFloat(plasticWasted);
    if (isNaN(used) || isNaN(wasted) || used < 0 || wasted < 0) {
      alert('Plastic used and wasted must be non-negative numbers.');
      return;
    }

    // Со склада уходит и использованный пластик, и отходы
    const plasticTotal = +(used + wasted).toFixed(2);
    const plasticAvailable =
      raw_materials_warehouse.find((item) => item.material_type == 'Plastics')
        ?.remaining_quantity || 0;

    if (plasticTotal > plasticAvailable) {
      alert(
        `Not enough plastic in the warehouse. Available: ${plasticAvailable}, need: ${plasticTotal}.`,
      );
      return;
    }

    const isConfirmed = window.confirm(
      `Are you sure you want to finish ALL ${qualityManagementDataList.length} batch(es)?\n` +
        `Plastic: used ${used} kg + wasted ${wasted} kg = ${plasticTotal} kg.\n` +
        `Press 'OK' to confirm or 'Cancel' to exit.`,
    );

    if (!isConfirmed) return;

    const errors = [];
    const processedBatches = [];

    let count = 0;
    // Пластик списывается вместе с первой успешно обработанной партией
    let plasticToWriteOff = plasticTotal;

    for (const record of qualityManagementDataList) {
      try {
        const result = await processSingleBatch(
          record,
          count,
          plasticToWriteOff,
        );
        processedBatches.push(result);
        plasticToWriteOff = 0;
        count += 1;
      } catch (error) {
        console.error(`Error processing batch ${record.batch_id}:`, error);
        errors.push({
          batch_id: record.batch_id,
          error: error.message,
        });
      }
    }

    if (processedBatches.length > 0) {
      setInputValues((prev) => {
        const newValues = { ...prev };
        processedBatches.forEach(({ id }) => {
          delete newValues[id];
        });
        return newValues;
      });
      setPlasticUsed('');
      setPlasticWasted('');
    }

    setBatchID(null);

    if (consumptionCalculated.consumption_calculated) {
      await dispatch(
        deleteRawMatConsumption({
          id: consumptionCalculated?.id,
        }),
      );
      setConsumptionCalculated({});
    }

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


  // ===== Ниже — только представление. Данные и обработчики не меняются. =====

  const hasBatches = qualityManagementDataList.length > 0;
  const showAddBatchModal =
    !qualityManagementData || qualityManagementData.length === 0;

  // Номер партии — тот же, что уходит на склад в processSingleBatch
  const getBatchNumber = (record) => record.raw_mat_cons_batch_id ?? batchID;

  const COLUMNS_QUALITY_MANAGEMENT = [
    {
      Header: 'Batch ID',
      id: 'batch_number',
      accessor: (record) => getBatchNumber(record),
      Cell: BatchIdCell,
    },
    {
      Header: 'Product article',
      accessor: 'product_article',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Date',
      accessor: 'date',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Total pallets in batch, plan, qty',
      accessor: 'total_quantity_plan',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Total qty in batch, fact, pallets',
      id: 'total_qty_fact_input',
      Cell: QtyInputCell,
      inputKey: 'totalQty',
      inputIdPrefix: 'totalQtyInput',
      inputValues,
      onInputChange: handleTotalQtyChange,
    },
    {
      Header: 'Quantity on sorting, pallets',
      id: 'sorting_input',
      Cell: QtyInputCell,
      inputKey: 'sorting',
      inputIdPrefix: 'sortingInput',
      inputValues,
      onInputChange: handleSortingChange,
    },
  ];

  // Сводка по шапке страницы
  const pageStats = useMemo(() => {
    return (qualityManagementDataList || []).reduce(
      (acc, item) => {
        acc.plan += Number(item.total_quantity_plan) || 0;
        // Факт + сортировка — столько паллет уйдёт со склада
        acc.total +=
          (Number(inputValues[item.id]?.totalQty) || 0) +
          (Number(inputValues[item.id]?.sorting) || 0);
        return acc;
      },
      { plan: 0, total: 0 },
    );
  }, [qualityManagementDataList, inputValues]);

  // Статус партии по соотношению резерва — вычисляется из уже готовых полей
  const getBatchView = (record) => {
    const required = Number(record.reserved_quantity) || 0;
    const allocated = Number(record.reserved_quantity_allocated) || 0;
    const remaining = Number(record.reserved_quantity_remaining) || 0;

    const entered = inputValues[record.id]?.totalQty;
    const hasInput =
      entered !== '' && entered !== undefined && Number(entered) > 0;

    let percent = 0;
    if (required > 0) {
      percent = Math.min(100, Math.round((allocated / required) * 100));
    } else if (hasInput) {
      percent = 100;
    }

    let tone = 'idle';
    let label = 'Awaiting input';

    if (hasInput) {
      if (required === 0) {
        tone = 'info';
        label = 'Free stock';
      } else if (remaining === 0) {
        tone = 'ok';
        label = 'Reserve covered';
      } else {
        tone = 'warn';
        label = 'Partially covered';
      }
    }

    return { required, allocated, remaining, percent, tone, label };
  };

  return (
    <div className="cl-page qm-page">
      <div className="cl-page__head">
        <div>
          <div className="cl-page__eyebrow">Production · Quality</div>
          <h1 className="cl-page__title">Quality management</h1>
        </div>

        {hasBatches && (
          <div className="cl-page__stats">
            <div className="cl-stat">
              <div className="cl-stat__num">
                {qualityManagementDataList.length}
              </div>
              <div className="cl-stat__label">Batches in work</div>
            </div>
            <div className="cl-stat__divider" />
            <div className="cl-stat">
              <div className="cl-stat__num">{pageStats.plan}</div>
              <div className="cl-stat__label">Pallets, plan</div>
            </div>
            <div className="cl-stat__divider" />
            <div className="cl-stat">
              <div className="cl-stat__num">{pageStats.total}</div>
              <div className="cl-stat__label">Pallets, total</div>
            </div>
          </div>
        )}
      </div>

      {hasBatches && (
        <div className="cl-toolbar">
          <div className="qm-toggle">
            <button
              type="button"
              className={`cl-btn ${
                mode === 'cards' ? 'cl-btn--primary' : 'cl-btn--ghost'
              }`}
              onClick={() => setMode('cards')}
            >
              Cards
            </button>
            <button
              type="button"
              className={`cl-btn ${
                mode === 'list' ? 'cl-btn--primary' : 'cl-btn--ghost'
              }`}
              onClick={() => setMode('list')}
            >
              List
            </button>
          </div>
          <div className="cl-toolbar__spacer" />
        </div>
      )}

      {hasBatches && mode === 'cards' && (
        <div className="qm-grid qm-fade-in">
          {qualityManagementDataList.map((record) => {
            const view = getBatchView(record);

            return (
              <article className="qm-card" key={record.id}>
                <header className="qm-card__head">
                  <div className="cl-min0">
                    <div className="qm-card__article">
                      {record.product_article}
                    </div>
                    <div className="qm-card__meta">
                      {getBatchNumber(record) != null && (
                        <span className="qm-chip cl-mono">
                          Batch {getBatchNumber(record)}
                        </span>
                      )}
                      {record.date && (
                        <span className="qm-card__date">{record.date}</span>
                      )}
                    </div>
                  </div>
                  <span className={`qm-status qm-status--${view.tone}`}>
                    {view.label}
                  </span>
                </header>

                <div className="qm-metric">
                  <span className="qm-metric__label">
                    Total pallets in batch, plan, qty
                  </span>
                  <span className="qm-metric__value">
                    {record.total_quantity_plan}
                  </span>
                </div>

                <div className="qm-progress">
                  <div className="qm-progress__head">
                    <span className="qm-progress__title">
                      Reserve allocation
                    </span>
                    <span className="qm-progress__num">
                      {view.allocated} / {view.required}
                    </span>
                  </div>
                  <div className="qm-progress__track">
                    <div
                      className={`qm-progress__fill qm-progress__fill--${view.tone}`}
                      style={{ width: `${view.percent}%` }}
                    />
                  </div>
                </div>

                <div className="qm-inputs">
                  <label
                    className="qm-field"
                    htmlFor={`totalQtyInput-${record.id}`}
                  >
                    <span className="qm-field__label">
                      Total qty in batch, fact, pallets
                    </span>
                    <input
                      className="qm-input"
                      id={`totalQtyInput-${record.id}`}
                      type="number"
                      min="0"
                      step="1"
                      value={inputValues[record.id]?.totalQty || ''}
                      onChange={(e) => handleTotalQtyChange(record.id, e)}
                      placeholder="0"
                    />
                  </label>

                  <label
                    className="qm-field"
                    htmlFor={`sortingInput-${record.id}`}
                  >
                    <span className="qm-field__label">
                      Quantity on sorting, pallets
                    </span>
                    <input
                      className="qm-input"
                      id={`sortingInput-${record.id}`}
                      type="number"
                      min="0"
                      step="1"
                      value={inputValues[record.id]?.sorting || ''}
                      onChange={(e) => handleSortingChange(record.id, e)}
                      placeholder="0"
                    />
                  </label>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {hasBatches && mode === 'list' && (
        <div className="qm-fade-in">
          <Table
            COLUMN_DATA={COLUMNS_QUALITY_MANAGEMENT}
            dataOfTable={qualityManagementDataList}
            tableName={'Quality Management'}
            userAccess={userAccess}
            variant="card"
            hideTitle
            emptyTitle="No batches in quality control"
            emptySubtitle="Start a new batch to see it here."
          />
        </div>
      )}

      {showAddBatchModal && (
        <div className="qm-empty">
          <div className="qm-empty__title">No batches in quality control</div>
          <div className="qm-empty__sub">
            Pick a calculated raw materials consumption entry to start a new
            batch — its plan, reserve and free quantity will show up here.
          </div>
          <div className="qm-empty__action">
            <ShowQualityManagementAddModal
              setConsumptionCalculated={setConsumptionCalculated}
            />
          </div>
        </div>
      )}

      {hasBatches && (
        <>
          <div className="qm-actionbar">
            <div className={`qm-date ${!dateValue ? 'qm-date--required' : ''}`}>
              <span className="qm-date__label">Finish date</span>
              <DatePicker
                id="data_pcker"
                type="text"
                selected={dateValue}
                onChange={(date) => setDateValue(date)}
                dateFormat="dd.MM.yyyy"
                placeholderText="dd.mm.yyyy"
                className="qm-date__input"
              />
            </div>

            <label
              className={`qm-date ${plasticUsed === '' ? 'qm-date--required' : ''}`}
              htmlFor="plasticUsedInput"
            >
              <span className="qm-date__label">Plastic, total used, kg</span>
              <input
                className="qm-date__input qm-date__input--num"
                id="plasticUsedInput"
                type="number"
                min="0"
                step="0.01"
                value={plasticUsed}
                onChange={(e) => setPlasticUsed(e.target.value)}
                placeholder="0"
              />
            </label>

            <label
              className={`qm-date ${plasticWasted === '' ? 'qm-date--required' : ''}`}
              htmlFor="plasticWastedInput"
            >
              <span className="qm-date__label">Plastic, total wasted, kg</span>
              <input
                className="qm-date__input qm-date__input--num"
                id="plasticWastedInput"
                type="number"
                min="0"
                step="0.01"
                value={plasticWasted}
                onChange={(e) => setPlasticWasted(e.target.value)}
                placeholder="0"
              />
            </label>

            <div className="qm-actionbar__spacer" />

            <button
              type="button"
              className="cl-btn cl-btn--ghost"
              onClick={() => {
                setRelatedProductsModal(true);
              }}
            >
              Start new batch
            </button>

            <button
              type="button"
              className="cl-btn cl-btn--primary"
              onClick={finishAllBatchesHandler}
            >
              Finish ALL batches ({qualityManagementDataList.length})
            </button>
          </div>

          <ModalTable
            isOpen={relatedProductsModal}
            toggle={() => setRelatedProductsModal(!relatedProductsModal)}
            data={filteredList}
            onClickRow={addProductHandler}
          />
        </>
      )}
    </div>
  );
};

export default QualityManagementTable;
