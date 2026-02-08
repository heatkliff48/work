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
import { addNewRawMatConsumption } from '#components/redux/actions/recipeAction.js';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';

const QualityManagementTable = () => {
  const { userAccess } = useUsersContext();

  const { autoclave_calendar, list_of_ordered_production } =
    useWarehouseContext();
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

  const COLUMNS_QUALITY_MANAGEMENT = [
    {
      Header: 'Batch ID',
      accessor: 'batch_id',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Prodcut article',
      accessor: 'product_article',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Total Qty in batch, plan, pallets',
      accessor: 'total_quantity_plan',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Reserved Qty in batch, pallets',
      accessor: 'reserved_quantity',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Reserved Qty in batch, allocated, pallets',
      accessor: 'reserved_quantity_allocated',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Reserved Qty in batch, remaining, pallets',
      accessor: 'reserved_quantity_remaining',
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
  ];

  useEffect(() => {
    if (qualityManagementData) {
      setQualityManagementDataList(qualityManagementData);
    }
  }, [qualityManagementData]);

  const qualityManagementPlusHandler = async () => {
    if (qualityManagementData) {
      const {
        id,
        batch_id,
        product_article,
        total_quantity_plan,
        reserved_quantity,
        reserved_quantity_allocated,
        reserved_quantity_remaining,
        free_quantity_fact,
        sorting,
      } = qualityManagementData[0];
      if (reserved_quantity_remaining > 0) {
        dispatch(
          updateQualityManagement({
            id: id,
            batch_id,
            product_article,
            total_quantity_plan,
            reserved_quantity,
            reserved_quantity_allocated: reserved_quantity_allocated + 1,
            reserved_quantity_remaining: reserved_quantity_remaining - 1,
            free_quantity_fact,
            sorting,
          }),
        );
      } else {
        dispatch(
          updateQualityManagement({
            id: id,
            batch_id,
            product_article,
            total_quantity_plan,
            reserved_quantity,
            reserved_quantity_allocated,
            reserved_quantity_remaining: 0,
            free_quantity_fact: free_quantity_fact + 1,
            sorting,
          }),
        );
      }
    }
  };

  const qualityManagementMinusHandler = async () => {
    if (qualityManagementData) {
      const {
        id,
        batch_id,
        product_article,
        total_quantity_plan,
        reserved_quantity,
        reserved_quantity_allocated,
        reserved_quantity_remaining,
        free_quantity_fact,
        sorting,
      } = qualityManagementData[0];
      if (
        reserved_quantity_remaining < reserved_quantity &&
        reserved_quantity_allocated > 0 &&
        free_quantity_fact == 0
      ) {
        dispatch(
          updateQualityManagement({
            id: id,
            batch_id,
            product_article,
            total_quantity_plan,
            reserved_quantity,
            reserved_quantity_allocated: reserved_quantity_allocated - 1,
            reserved_quantity_remaining: reserved_quantity_remaining + 1,
            free_quantity_fact,
            sorting,
          }),
        );
      } else if (reserved_quantity_remaining == 0 && free_quantity_fact > 0) {
        dispatch(
          updateQualityManagement({
            id: id,
            batch_id,
            product_article,
            total_quantity_plan,
            reserved_quantity,
            reserved_quantity_allocated,
            reserved_quantity_remaining: 0,
            free_quantity_fact: free_quantity_fact - 1,
            sorting,
          }),
        );
      }
    }
  };

  const sortingPlusHandler = async () => {
    if (qualityManagementData) {
      const {
        id,
        batch_id,
        product_article,
        total_quantity_plan,
        reserved_quantity,
        reserved_quantity_allocated,
        reserved_quantity_remaining,
        free_quantity_fact,
        sorting,
      } = qualityManagementData[0];
      if (total_quantity_plan > 0) {
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
            sorting: sorting + 1,
          }),
        );
      }
    }
  };

  const sortingMinusHandler = async () => {
    if (qualityManagementData) {
      const {
        id,
        batch_id,
        product_article,
        total_quantity_plan,
        reserved_quantity,
        reserved_quantity_allocated,
        reserved_quantity_remaining,
        free_quantity_fact,
        sorting,
      } = qualityManagementData[0];
      if (sorting > 0) {
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
            sorting: sorting - 1,
          }),
        );
      }
    }
  };

  const finishBatchHandler = async () => {
    const isConfirmed = window.confirm(
      `Are you sure?\nPress 'OK' to confirm or 'Cancel' to exit.`,
    );
    if (isConfirmed) {
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
      } = qualityManagementData[0];

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
          return reservedItem; // Не трогаем резервы других товаров
        }

        // Если новый товар уже "исчерпан" и кол-во паллет совпадает с кол-вом зарезервированных

        if (remainingFreeQty <= 0) {
          if (reservedItem.quantity == reservedItem.quantity_in_warehouse) {
            return reservedItem;
          } else if (
            reservedItem.quantity > reservedItem.quantity_in_warehouse
          ) {
            // ИСПРАВЛЕНИЕ: Добавляем к существующему количеству, а не заменяем

            const newQuantityInWarehouse = Math.min(
              reservedItem.quantity_in_warehouse + reserved_quantity_allocated,

              reservedItem.quantity,
            );

            console.log('objenewQuantityInWarehousect', newQuantityInWarehouse);

            return {
              ...reservedItem,

              quantity_in_warehouse: newQuantityInWarehouse,
            };
          }
        }

        // Сколько можно зарезервировать из нового товара для этого резерва

        const deducted = production_plan_id
          ? Math.min(
              Math.max(
                0,

                reservedItem.quantity -
                  reservedItem.quantity_in_warehouse -
                  reserved_quantity_allocated,
              ), // Сколько нужно для этого резерва

              remainingFreeQty, // Сколько доступно в новом товаре
            )
          : Math.min(
              reservedItem.quantity - reservedItem.quantity_in_warehouse, // Сколько нужно для этого резерва

              remainingFreeQty, // Сколько доступно в новом товаре
            );

        // Уменьшаем остаток нового товара

        remainingFreeQty -= deducted;

        summReserve += deducted;

        // ИСПРАВЛЕНИЕ: Правильное суммирование количества на складе

        const baseQuantityInWarehouse = reservedItem.quantity_in_warehouse;

        return production_plan_id
          ? {
              ...reservedItem,

              // Добавляем к существующему количеству: базовое + зарезервированное + новое из свободного

              quantity_in_warehouse:
                baseQuantityInWarehouse +
                reserved_quantity_allocated +
                deducted,
            }
          : {
              ...reservedItem,

              // Добавляем к существующему количеству только новое из свободного

              quantity_in_warehouse: baseQuantityInWarehouse + deducted,
            };
      });

      // Проверки на корректность

      if (reserved_quantity_allocated < 0) {
        alert(
          'Ошибка: reserved_quantity_allocated не может быть отрицательным.',
        );

        return;
      }

      if (summReserve < 0) {
        alert('Ошибка: summReserve не может быть отрицательным.');

        return;
      }

      const calculatedOrderedQuantity =
        reserved_quantity_allocated + summReserve;

      // Добавляем на склад

      await dispatch(
        addNewWarehouse({
          product_article,
          article: batch_id,
          warehouse_loc: 'local',
          free_quantity_remaining: remainingFreeQty,
          ordered_quantity: calculatedOrderedQuantity,
          total_quantity: calculatedOrderedQuantity + remainingFreeQty,
          type: 'OK',
          sorting: 0,
        }),
      );

      if (sorting > 0) {
        await dispatch(
          addNewWarehouse({
            product_article,
            article: batch_id,
            warehouse_loc: 'local',
            free_quantity_remaining: 0,
            ordered_quantity: 0,
            total_quantity: sorting,
            type: 'Sorting',
            sorting,
          }),
        );
      }

      // Обновляем все затронутые позиции в list_of_ordered_production

      for (const ordered_production of updatedReserves) {
        await dispatch(updListOfOrderedProduction(ordered_production));
      }

      if (production_plan_id) {
        // Остальная логика с autoclave_calendar...
        const { date, quantity_pallets } = batchOutside?.find(
          (el) => el.id === production_plan_id,
        );

        const { m3InArray, volumeBlockOnPallet } = latestProducts.find(
          (el) => el.article == product_article,
        );

        // ИСПРАВЛЕНО: используем === вместо =
        const accd = autoclave_calendar.find((el) => el.date === date);

        if (!accd) {
          console.error('Autoclave calendar entry not found for date:', date);
          return;
        }

        const palletsPerArray = Math.max(
          1,
          Math.floor(m3InArray / volumeBlockOnPallet) || 1,
        );

        const total_arrays =
          (accd?.total_arrays || 0) + quantity_pallets / palletsPerArray;

        const filled_autoclaves = Math.floor(total_arrays / 21);
        const residual_arrays = total_arrays - filled_autoclaves * 21;

        const result = [
          {
            ...accd,
            total_arrays,
            residual_arrays,
            filled_autoclaves,
          },
        ];

        const batch = batchOutside.find(
          (batch) => batch.id === production_plan_id,
        );

        const recipe = recipeOrders.find(
          (recipe) => recipe.id_batch === production_plan_id,
        );

        const recipeDetails = list_of_recipes.find(
          (rec) => rec.id === recipe?.id_recipe,
        );

        dispatch(
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

        await dispatch(addNewAutoclaveCalendar(result));
      }
      await dispatch(deleteQualityManagement(id));

      const { widthInArray } = latestProducts.find(
        (el) => el.article == product_article,
      );

      if (production_plan_id) {
        if (
          reserved_quantity_remaining <= 0 ||
          total_quantity_plan - reserved_quantity_allocated <
            21 * Math.floor(widthInArray)
        ) {
          await dispatch(deleteBatchOutside(production_plan_id));
        } else {
          const batch = batchOutside.find((el) => el.id === production_plan_id);
          await dispatch(
            updateBatchOutside({
              ...batch,
              quantity_pallets:
                total_quantity_plan - reserved_quantity_allocated,
            }),
          );
        }
      }
    }
  };

  // useEffect(() => {
  //   if (user && roles.length > 0) {
  //     const access = checkUserAccess(user, roles, 'batch_outside');
  //     setUserAccess(access);

  //     if (!access.canRead) {
  //       navigate('/');
  //     }
  //   }
  // }, [user, roles]);

  return (
    <Fragment>
      <Table
        COLUMN_DATA={COLUMNS_QUALITY_MANAGEMENT}
        dataOfTable={qualityManagementDataList}
        tableName={'Quality Management'}
        userAccess={userAccess}
        handleRowClick={(row) => {}}
      />
      {qualityManagementData.length > 0 && (
        <div className="d-flex gap-4 flex-wrap">
          <div className="border rounded p-3 bg-light">
            <div className="text-center mb-2 fw-bold border-bottom pb-1">
              OK
            </div>
            <div className="d-flex gap-2">
              <Button
                variant="success"
                size="lg"
                onClick={qualityManagementPlusHandler}
              >
                <FaPlus style={{ fontSize: '1.5rem' }} />
              </Button>
              <Button
                variant="danger"
                size="lg"
                onClick={qualityManagementMinusHandler}
              >
                <FaMinus style={{ fontSize: '1.5rem' }} />
              </Button>
            </div>
          </div>

          <div className="border rounded p-3 bg-light">
            <div className="text-center mb-2 fw-bold border-bottom pb-1">
              Sorting
            </div>
            <div className="d-flex gap-2">
              <Button variant="success" size="lg" onClick={sortingPlusHandler}>
                <FaPlus style={{ fontSize: '1.5rem' }} />
              </Button>
              <Button variant="danger" size="lg" onClick={sortingMinusHandler}>
                <FaMinus style={{ fontSize: '1.5rem' }} />
              </Button>
            </div>
          </div>
        </div>
      )}
      {qualityManagementData.length > 0 && (
        <div className="d-flex gap-2 mb-2">
          <Button variant="warning" size="lg" onClick={finishBatchHandler}>
            Finish batch above
          </Button>
        </div>
      )}
      {(!qualityManagementData || qualityManagementData.length === 0) && (
        <ShowQualityManagementAddModal />
      )}
    </Fragment>
  );
};

export default QualityManagementTable;
