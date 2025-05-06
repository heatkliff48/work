import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import Select from 'react-select';
import Container from 'react-bootstrap/Container';
import InputField from '#components/InputField/InputField.jsx';
import Table from '#components/Table/Table.jsx';
import { useDispatch } from 'react-redux';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import {
  addNewAnchorsWarehouse,
  addNewDryMixesWarehouse,
  addNewRelatedMaterialsWarehouse,
  addNewToolsWarehouse,
} from '#components/redux/actions/productsTypeWarehouseAction.js';
import '#components/Styles/modals.css';

function ProductsTypeWarehouseModal(props) {
  const {
    COLUMNS_DRY_MIXED_PRODUCT,
    COLUMNS_ANCHOR_PRODUCT,
    COLUMNS_TOOLS_PRODUCT,
    COLUMNS_RELATED_MATERIALS_JOURNAL,
    latestDryMix,
    latestRelatedMaterials,
    latestAnchors,
    latestTools,
  } = useProductsTypeJournalContext();
  const { COLUMNS_WAREHOUSE, dry_mixes_warehouse_data } = useWarehouseContext();
  const [productsTypeWarehouseInput, setProductsTypeWarehouseInput] = useState({});
  const [warehouseData, setWarehouseData] = useState([]);

  const [errors, setErrors] = useState({});

  const latestProductsType =
    props.target == 1
      ? latestDryMix
      : props.target == 2
      ? latestRelatedMaterials
      : props.target == 3
      ? latestAnchors
      : latestTools;

  const haveProduct = useMemo(() => {
    return warehouseData?.product_article ?? false;
  }, [warehouseData?.product_article]);

  const warehouseLocOpt = [
    { value: 'local', label: 'Local' },
    { value: 'remote', label: 'Remote' },
  ];

  const type_select = [
    {
      value: 'OK',
      label: 'OK',
    },
    {
      value: 'Remnants',
      label: 'Remnants',
    },
  ];

  const dispatch = useDispatch();

  const getWarehouseArticle = (product) => {
    let versionNumber = '0001';
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const day = new Date().getDate();

    const articleId =
      dry_mixes_warehouse_data.length === 0
        ? 1
        : dry_mixes_warehouse_data.length + 1;
    versionNumber = `0000000${articleId}`.slice(-6);

    const warehouseArticle = `S00X.${
      props.target == 1
        ? `M`
        : props.target == 2
        ? `P`
        : props.target == 3
        ? `F`
        : `T`
    }${year}${month}${day}${versionNumber}`;

    return warehouseArticle;
  };

  const handlerAddProductWarehouse = useCallback(
    (row) => {
      const product = latestProductsType.find((el) => el.id === row.original.id);
      const warehouse_article = getWarehouseArticle(product);

      console.log('warehouse_article', warehouse_article);

      setWarehouseData((prev) => ({
        ...prev,
        product_article: product.article,
        article: warehouse_article,
      }));
    },
    [latestProductsType]
  );

  useEffect(() => {
    console.log('warehouseData', warehouseData);
  }, [warehouseData]);

  const handleWareHouseInput = (e) => {
    setWarehouseData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (selectedOption) => {
    setWarehouseData((prev) => ({ ...prev, warehouse_loc: selectedOption.value }));
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

  const handleSelectTypeChange = (selectedOption) => {
    setWarehouseData((prev) => ({ ...prev, type: selectedOption.value }));
  };

  const getSelectedTypeOption = (accessor) => {
    if (!warehouseData?.type)
      setWarehouseData((prev) => ({
        ...prev,
        type: type_select[0].value,
      }));

    const selectedOption = type_select.find(
      (option) => option.value === warehouseData?.[accessor]
    );

    return selectedOption || type_select[0];
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    if (props.target == 1) {
      dispatch(addNewDryMixesWarehouse(warehouseData));
    } else if (props.target == 2) {
      dispatch(addNewRelatedMaterialsWarehouse(warehouseData));
    } else if (props.target == 3) {
      dispatch(addNewAnchorsWarehouse(warehouseData));
    } else {
      dispatch(addNewToolsWarehouse(warehouseData));
    }

    setWarehouseData({});
    props.onHide();
  };

  return (
    <div>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="modal-products-table"
        scrollable={true}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {haveProduct ? (
              <p>Fill in the remaining parameters</p>
            ) : (
              <p>Select {props.title}</p>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <form
              id="addAuxilaryModal"
              className="w-full max-w-sm"
              onSubmit={(e) => {
                onSubmitForm(e);
              }}
            >
              {haveProduct ? (
                <>
                  {COLUMNS_WAREHOUSE.map((el) => {
                    if (
                      el.accessor === 'article' ||
                      el.accessor === 'product_article'
                    )
                      return (
                        <>
                          <Modal.Body>{el.Header}:</Modal.Body>
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
                        <>
                          <Modal.Body>{el.Header}:</Modal.Body>
                          <Select
                            defaultValue={getSelectedOption(el.accessor)}
                            onChange={(v) => {
                              handleSelectChange(v);
                            }}
                            options={warehouseLocOpt}
                            key={el.id}
                          />
                        </>
                      );

                    if (el.accessor === 'type')
                      return (
                        <>
                          <Modal.Body>{el.Header}:</Modal.Body>
                          <Select
                            defaultValue={getSelectedTypeOption(el.accessor)}
                            onChange={(v) => {
                              handleSelectTypeChange(v);
                            }}
                            options={type_select}
                            key={el.id}
                          />
                        </>
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
                    COLUMN_DATA={
                      props.target == 1
                        ? COLUMNS_DRY_MIXED_PRODUCT
                        : props.target == 2
                        ? COLUMNS_RELATED_MATERIALS_JOURNAL
                        : props.target == 3
                        ? COLUMNS_ANCHOR_PRODUCT
                        : COLUMNS_TOOLS_PRODUCT
                    }
                    dataOfTable={latestProductsType}
                    // userAccess={userAccess}
                    onClickButton={() => {}}
                    buttonText={''}
                    tableName={props.title}
                    handleRowClick={(row) => {
                      handlerAddProductWarehouse(row);
                    }}
                  />
                </>
              )}
            </form>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button form="addAuxilaryModal" type="submit">
            Add {props.title}
          </Button>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

function ShowProductsTypeWarehouseModal(props) {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Button
        variant="primary"
        onClick={() => {
          setModalShow(true);
        }}
      >
        Add new {props.title} on warehouse
      </Button>

      <ProductsTypeWarehouseModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        table={props.table}
        target={props.target}
        title={props.title}
      />
    </>
  );
}

export default ShowProductsTypeWarehouseModal;
