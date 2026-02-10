import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from '#components/Table/Table';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { updateRemainingStock } from '#components/redux/actions/warehouseAction.js';

function AddBatchID(props) {
  const { warehouseInfoCurIdModal } = useModalContext();

  const lotesListBatches = useSelector((state) => state.lotesListBatches);

  const COLUMNS_LOTES_LIST = [
    {
      Header: 'Batch ID',
      accessor: 'batch_id',
    },
    {
      Header: 'Cake ID start',
      accessor: 'cake_id_start',
    },
    {
      Header: 'Cake ID finish',
      accessor: 'cake_id_finish',
    },
    {
      Header: 'Production date',
      accessor: 'production_date',
    },
    {
      Header: 'Product',
      accessor: 'product',
    },
    {
      Header: 'Recipe',
      accessor: 'recipe',
    },
    {
      Header: 'Quantity cakes',
      accessor: 'quantity_cakes',
    },
  ];

  const dispatch = useDispatch();

  const groupedLotesList = useMemo(() => {
    if (!Array.isArray(lotesListBatches)) return [];

    const grouped = {};

    lotesListBatches.forEach((item) => {
      if (!item || item.batch_id == null) return;

      const key = String(item.batch_id);

      const start = Number(item.cake_id_start);
      const finish = Number(item.cake_id_finish);

      if (!grouped[key]) {
        grouped[key] = {
          ...item,
          cake_id_start: start,
          cake_id_finish: finish,
          quantity_cakes: finish - start + 1,
        };
        return;
      }

      grouped[key].cake_id_start = Math.min(grouped[key].cake_id_start, start);

      grouped[key].cake_id_finish = Math.max(
        grouped[key].cake_id_finish,
        finish,
      );

      grouped[key].quantity_cakes =
        grouped[key].cake_id_finish - grouped[key].cake_id_start + 1;
    });

    return Object.values(grouped).sort(
      (a, b) => Number(b.batch_id) - Number(a.batch_id),
    );
  }, [lotesListBatches]);

  const handlerAddProductionPlanEntry = useCallback((row) => {
    const batch_id = groupedLotesList.filter(
      (el) => el.id === row.original.id,
    )[0].id;
    console.log(batch_id, 'batch_id AddBatchID.jsx line 106');
    console.log(
      warehouseInfoCurIdModal,
      'warehouseInfoCurIdModal AddBatchID.jsx line 104',
    );
    dispatch(
      updateRemainingStock({ warehouse_id: warehouseInfoCurIdModal, batch_id }),
    );

    props.onHide();
  });

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dialogClassName="modal-auto-size"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Choose Batch ID
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <>
          <Table
            COLUMN_DATA={COLUMNS_LOTES_LIST}
            dataOfTable={groupedLotesList}
            // userAccess={userAccess}
            tableName={'Lotes List'}
            handleRowClick={(row) => {
              handlerAddProductionPlanEntry(row);
            }}
          />
        </>
      </Modal.Body>
      <Modal.Footer>
        <Button form="AddBatchIDForm" type="submit">
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function ShowAddBatchID() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Button
        variant="primary"
        onClick={() => {
          setModalShow(true);
        }}
      >
        Add Batch ID
      </Button>

      <AddBatchID show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}

export default ShowAddBatchID;
