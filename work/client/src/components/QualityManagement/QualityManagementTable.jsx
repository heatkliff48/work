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

const QualityManagementTable = () => {
  const { userAccess } = useUsersContext();

  const { list_of_ordered_production, autoclave_calendar } = useWarehouseContext();
  const { latestProducts } = useProductsContext();

  const dispatch = useDispatch();
  const qualityManagementData = useSelector((state) => state.qualityManagementData);
  const batchOutside = useSelector((state) => state.batchOutside);

  const [qualityManagementDataList, setQualityManagementDataList] = useState([]);

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
          })
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
          })
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
          })
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
          })
        );
      }
    }
  };

  const finishBatchHandler = async () => {
    const isConfirmed = window.confirm(
      `Are you sure?\nPress 'OK' to confirm or 'Cancel' to exit.`
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
      } = qualityManagementData[0];

      // 1. Фильтруем резервы для текущего product_article
      const reservedProducts =
        list_of_ordered_production?.filter(
          (item) => item.product_article === product_article
        ) || [];

      // 2. Сколько осталось "свободного" количества и сколько всего свободной продукции было зарезервированно сразу
      let remainingFreeQty = free_quantity_fact;
      let summReserve = 0;

      // 3. Обходим каждый резерв и корректируем остатки
      const updatedReserves = reservedProducts.map((reservedItem) => {
        if (reservedItem.product_article !== product_article) {
          return reservedItem; // Не трогаем резервы других товаров
        }

        // Если новый товар уже "исчерпан" и кол-во паллет совпадает с кол-вом зарезервированных, ничего не меняем, если исчерпан и кол-во паллет больше кол-ва зарезервированных, то прибавляем к существующему резерву новый и смотрим, чтобы он не выходил за предел кол-ва паллет общего.
        if (remainingFreeQty <= 0) {
          if (reservedItem.quantity == reservedItem.quantity_in_warehouse) {
            return reservedItem;
          } else if (reservedItem.quantity > reservedItem.quantity_in_warehouse) {
            return {
              ...reservedItem,
              quantity_in_warehouse: Math.min(
                reservedItem.quantity_in_warehouse + reserved_quantity_allocated,
                reservedItem.quantity
              ),
            };
          }
        }

        // Сколько можно зарезервировать из нового товара для этого резерва
        const deducted = production_plan_id
          ? Math.min(
              reservedItem.quantity -
                reservedItem.quantity_in_warehouse -
                reserved_quantity_allocated, // Сколько нужно для этого резерва
              remainingFreeQty // Сколько доступно в новом товаре
            )
          : Math.min(
              reservedItem.quantity - reservedItem.quantity_in_warehouse, // Сколько нужно для этого резерва
              remainingFreeQty // Сколько доступно в новом товаре
            );

        // Уменьшаем остаток нового товара
        remainingFreeQty -= deducted;
        summReserve += deducted;

        // Возвращаем обновленный резерв

        return production_plan_id
          ? {
              ...reservedItem,
              quantity_in_warehouse:
                reservedItem.quantity_in_warehouse +
                reserved_quantity_allocated +
                deducted,
            }
          : {
              ...reservedItem,
              quantity_in_warehouse: reservedItem.quantity_in_warehouse + deducted,
            };
      });

      if (reserved_quantity_allocated < 0) {
        alert('Ошибка: reserved_quantity_allocated не может быть отрицательным.');
      }

      if (summReserve < 0) {
        alert('Ошибка: summReserve не может быть отрицательным.');
      }

      const calculatedOrderedQuantity = reserved_quantity_allocated + summReserve;

      await dispatch(
        addNewWarehouse({
          product_article,
          article: batch_id,
          warehouse_loc: 'local',
          free_quantity_remaining: remainingFreeQty,
          ordered_quantity: calculatedOrderedQuantity,
          total_quantity:
            reserved_quantity_allocated + summReserve + remainingFreeQty,
          type: 'OK',
        })
      );

      for (const ordered_production of updatedReserves) {
        await dispatch(updListOfOrderedProduction(ordered_production));
      }
      await dispatch(deleteQualityManagement(id));
      if (production_plan_id) {
        if (
          reserved_quantity_remaining <= 0 ||
          total_quantity_plan - reserved_quantity_allocated < 63
        ) {
          const { date, quantity_pallets } = batchOutside.find(
            (el) => el.id === production_plan_id
          );
          const { m3InArray, volumeBlockOnPallet } = latestProducts.find(
            (el) => el.article == product_article
          );
          const accd = autoclave_calendar.find((el) => (el.date = date));

          const total_arrays =
            accd?.total_arrays ??
            0 + quantity_pallets / Math.floor(m3InArray / volumeBlockOnPallet);

          const quantity_of_produced = Math.floor(total_arrays / 21);

          const residual_arrays = total_arrays - quantity_of_produced * 21;

          const result = {
            ...accd,
            total_arrays,
            residual_arrays,
            quantity_of_produced,
          };

          dispatch(addNewAutoclaveCalendar(result));

          await dispatch(deleteBatchOutside(production_plan_id));
        } else {
          const batch = batchOutside.find((el) => el.id === production_plan_id);
          await dispatch(
            updateBatchOutside({
              ...batch,
              quantity_pallets: total_quantity_plan - reserved_quantity_allocated,
            })
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
        <div className="d-flex gap-2 mb-2">
          <Button variant="success" size="lg" onClick={qualityManagementPlusHandler}>
            <FaPlus style={{ cursor: 'pointer', fontSize: '1.5rem' }} />
          </Button>
          <Button variant="danger" size="lg" onClick={qualityManagementMinusHandler}>
            <FaMinus style={{ cursor: 'pointer', fontSize: '1.5rem' }} />
          </Button>
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
