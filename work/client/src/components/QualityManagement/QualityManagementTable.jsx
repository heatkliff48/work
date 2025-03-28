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
import { addNewWarehouse } from '#components/redux/actions/warehouseAction.js';
import { deleteBatchOutside } from '#components/redux/actions/batchOutsideAction.js';

const QualityManagementTable = () => {
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

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
    const isConfirmed = window.confirm('Pedro, ti uveren?');
    if (isConfirmed) {
      const {
        id,
        batch_id,
        product_article,
        free_quantity_fact,
        production_plan_id,
      } = qualityManagementData[0];
      await dispatch(
        addNewWarehouse({
          product_article,
          article: batch_id,
          warehouse_loc: 'local',
          remaining_stock: free_quantity_fact,
          type: 'OK',
        })
      );
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
