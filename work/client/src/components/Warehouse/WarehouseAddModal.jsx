import React, { useCallback, useMemo, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useProjectContext } from '#components/contexts/Context.js';
import { useDispatch } from 'react-redux';
import InputField from '#components/InputField/InputField.jsx';
import Table from '#components/Table/Table.jsx';
import Select from 'react-select';
import { addNewWarehouse } from '#components/redux/actions/warehouseAction.js';

const WarehouseAddModal = React.memo(
  ({ isOpen, toggle, COLUMNS_WAREHOUSE, warehouse_data }) => {
    const { COLUMNS, latestProducts } = useProjectContext();
    const dispatch = useDispatch();

    const [warehouseData, setWarehouseData] = useState([]);
    const [warehouse_loc, setWarehouseLoc] = useState('local');

    const haveProduct = useMemo(() => {
      return warehouseData?.product_article ?? false;
    }, [warehouseData?.product_article]);

    const warehouseLocOpt = [
      { value: 'local', label: 'Local' },
      { value: 'remote', label: 'Remote' },
    ];

    const getWarehouseArticle = (product) => {
      let versionNumber = '0001';
      const year = new Date().getFullYear().toString().slice(-2);
      const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
      const day = new Date().getDate();

      const certificate = product.certificate.slice(0, 1);
      const density = product.density.toString().slice(0, 1);

      const articleId = warehouse_data.length === 0 ? 1 : warehouse_data.length + 1;
      versionNumber = `0000000${articleId}`.slice(-6);

      const warehouseArticle = `S00${certificate}${density}${year}${month}${day}${versionNumber}`;

      return warehouseArticle;
    };

    const handlerAddProductWarehouse = useCallback(
      (row) => {
        const product = latestProducts.find((el) => el.id === row.original.id);
        const warehouse_article = getWarehouseArticle(product);

        setWarehouseData((prev) => ({
          ...prev,
          product_article: product.article,
          article: warehouse_article,
        }));
      },
      [latestProducts]
    );

    const handleWareHouseInput = (e) => {
      setWarehouseData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelectChange = (selectedOption) => {
      setWarehouseData((prev) => ({ ...prev, warehouse_loc: selectedOption.value }));

      setWarehouseLoc(selectedOption.value);
    };

    const getSelectedOption = (accessor) => {
      if (!warehouseData?.warehouse_loc)
        setWarehouseData((prev) => ({
          ...prev,
          warehouse_loc: warehouseLocOpt[0].value,
        }));

      const selectedOption = warehouseLocOpt.find(
        (option) => option.value === warehouseData?.[accessor]
      );

      return selectedOption || warehouseLocOpt[0];
    };

    const addProductOrder = async () => {
      dispatch(addNewWarehouse(warehouseData));
      setWarehouseData({});
      toggle();
    };

    return (
      <div>
        <Modal isOpen={isOpen} toggle={toggle}>
          <ModalHeader toggle={toggle}>
            {haveProduct ? (
              <p>Fill in the remaining parameters</p>
            ) : (
              <p>Select product</p>
            )}
          </ModalHeader>
          <ModalBody>
            {haveProduct ? (
              <>
                {COLUMNS_WAREHOUSE.map((el) => {
                  if (el.accessor === 'article' || el.accessor === 'product_article')
                    return (
                      <>
                        <ModalBody>{el.Header}:</ModalBody>
                        <input
                          type="text"
                          id={el.accessor}
                          name={el.accessor}
                          value={warehouseData[el.accessor] || ''}
                          key={el.id}
                          readOnly
                        />
                      </>
                    );
                  if (el.accessor === 'warehouse_loc')
                    return (
                      <Select
                        defaultValue={getSelectedOption(el.accessor)}
                        onChange={(v) => {
                          handleSelectChange(v);
                        }}
                        options={warehouseLocOpt}
                        key={el.id}
                      />
                    );
                  return (
                    <InputField
                      key={el.id}
                      el={el}
                      inputValue={warehouseData}
                      inputValueChange={handleWareHouseInput}
                    />
                  );
                })}
              </>
            ) : (
              <>
                <Table
                  COLUMN_DATA={COLUMNS}
                  dataOfTable={latestProducts}
                  // userAccess={userAccess}
                  onClickButton={() => {}}
                  buttonText={''}
                  tableName={'Orders'}
                  handleRowClick={(row) => {
                    handlerAddProductWarehouse(row);
                  }}
                />
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <button onClick={addProductOrder}>Add product</button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
);
export default WarehouseAddModal;
