import Table from '#components/Table/Table';
import Button from 'react-bootstrap/Button';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { TextSearchFilter } from '#components/Table/filters.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ShowQualityManagementAddModal from './QualityManagementAddModal';
import {
  deleteQualityManagement,
  getQualityManagement,
  updateQualityManagement,
} from '#components/redux/actions/qualityManagementAction.js';
import {
  addNewWarehouse,
  updListOfOrderedProduction,
} from '#components/redux/actions/warehouseAction.js';
import { deleteBatchOutside } from '#components/redux/actions/batchOutsideAction.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';

const QualityManagementTable = () => {
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  const { list_of_reserved_products, list_of_ordered_production } =
    useWarehouseContext();

  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const qualityManagementData = useSelector((state) => state.qualityManagementData);

  const [qualityManagementDataList, setQualityManagementDataList] = useState([]);
  const [modalShow, setModalShow] = useState(false);

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

  useEffect(() => {
    dispatch(getQualityManagement());
  }, []);

  const qualityManagementPlusHandler = async () => {
    if (qualityManagementData) {
      // console.log('qualityManagementData[0]', qualityManagementData[0]);
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
      // console.log('qualityManagementData[0]', qualityManagementData[0]);
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

        // Если новый товар уже "исчерпан" или кол-во паллет совпадает с кол-вом зарезервированных, ничего не меняем
        if (
          remainingFreeQty <= 0 ||
          reservedItem.quantity == reservedItem.quantity_in_warehouse
        ) {
          return reservedItem;
        }

        // Сколько можно зарезервировать из нового товара для этого резерва
        const deducted = Math.min(
          reservedItem.quantity - reservedItem.quantity_in_warehouse, // Сколько нужно для этого резерва
          remainingFreeQty // Сколько доступно в новом товаре
        );

        // Уменьшаем остаток нового товара
        remainingFreeQty -= deducted;
        summReserve += deducted;

        // Возвращаем обновленный резерв
        return {
          ...reservedItem,
          quantity_in_warehouse: reservedItem.quantity_in_warehouse + deducted,
        };
      });

      await dispatch(
        addNewWarehouse({
          product_article,
          article: batch_id,
          warehouse_loc: 'local',
          free_quantity_remaining: remainingFreeQty, // sprosit pro chisla
          ordered_quantity: reserved_quantity_allocated + summReserve,
          total_quantity:
            reserved_quantity_allocated + summReserve + remainingFreeQty,
          type: 'OK',
          // reserved_quantity_allocated -> free_quantity_remaining
          // free_quantity_fact -> ordered_quantity
          // reserved_quantity_allocated + free_quantity_fact -> total_quantity
        })
      );

      for (const ordered_production of updatedReserves) {
        await dispatch(updListOfOrderedProduction(ordered_production));
      }
      await dispatch(deleteQualityManagement(id));
      if (production_plan_id) {
        await dispatch(deleteBatchOutside(production_plan_id));
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
        // handleRowClick={(row) => {
        //   qualityManagementHandler(row.original.id);
        // }}
      />
      <div className="d-flex gap-2 mb-2">
        <Button variant="success" size="lg">
          <FaPlus
            onClick={qualityManagementPlusHandler}
            style={{ cursor: 'pointer', fontSize: '1.5rem' }}
          />
        </Button>
        <Button variant="danger" size="lg">
          <FaMinus
            onClick={qualityManagementMinusHandler}
            style={{ cursor: 'pointer', fontSize: '1.5rem' }}
          />
        </Button>
      </div>
      <div className="d-flex gap-2 mb-2">
        <Button variant="warning" size="lg" onClick={finishBatchHandler}>
          Finish batch above
        </Button>
      </div>
      <ShowQualityManagementAddModal />
    </Fragment>
  );
};

export default QualityManagementTable;
