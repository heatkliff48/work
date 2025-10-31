import Table from '../Table/Table';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Fragment } from 'react';
import { useModalContext } from '#components/contexts/ModalContext.js';

function RawMaterialsConsumptionModalAdd({ isOpen, toggle, func }) {
  const {
    raw_mat_consumption,
    COLUMNS_RAW_MAT_CONSUMPTION,
  } = useRecipeContext();
  const { setRawMaterialConsumptionMadal } = useModalContext();


  return (
    <>
      <div>
        <Modal isOpen={isOpen} toggle={toggle} size="xl">
          <ModalHeader toggle={toggle}>
            <div className="d-flex flex-column gap-1">
              Choose Raw Material Consumption
            </div>
          </ModalHeader>

          <Fragment>
            <ModalBody style={{ overflow: 'auto', maxHeight: '70vh' }}>
              <Table
                COLUMN_DATA={COLUMNS_RAW_MAT_CONSUMPTION}
                dataOfTable={raw_mat_consumption}
                tableName={'Raw materials consumption'}
                handleRowClick={(row) => {
                  func(row.original);
                  setRawMaterialConsumptionMadal(true);
                }}
              />
            </ModalBody>
          </Fragment>
        </Modal>
      </div>
    </>
  );
}

export default RawMaterialsConsumptionModalAdd;
