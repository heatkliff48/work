import Table from '../Table/Table';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Fragment, useEffect, useState } from 'react';
import { useModalContext } from '#components/contexts/ModalContext.js';

function RawMaterialsConsumptionModalAdd({ isOpen, toggle, func }) {
  const {
    raw_mat_consumption,
    main_raw_mat_consumption,
    COLUMNS_RAW_MAT_CONSUMPTION,
  } = useRecipeContext();
  const { setRawMaterialConsumptionMadal } = useModalContext();

  const [filteredRawMatConsumption, setFilteredRaw_MatConsumption] = useState();

  useEffect(() => {
    if (!raw_mat_consumption || !main_raw_mat_consumption) {
      setFilteredRaw_MatConsumption([]);
      return;
    }

    const sumMap = new Map();

    main_raw_mat_consumption.forEach((item) => {
      const key = `${item.recipe_article}|${item.batch_article}|${item.batch_id}`;

      const currentSum = sumMap.get(key) || 0;

      sumMap.set(key, currentSum + Number(item.consumed_volume || 0));
    });

    const filtered = raw_mat_consumption.filter((item) => {
      const key = `${item.recipe_article}|${item.batch_article}|${item.batch_id}`;

      const totalFromMain = sumMap.get(key) || 0;

      return Number(item.production_volume) !== totalFromMain;
    });

    setFilteredRaw_MatConsumption(filtered);
  }, [raw_mat_consumption, main_raw_mat_consumption]);

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
                dataOfTable={filteredRawMatConsumption}
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
