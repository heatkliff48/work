import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from '#components/Table/Table';
import Select from 'react-select';
import { TextSearchFilter } from '#components/Table/filters.js';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewQualityManagement } from '#components/redux/actions/qualityManagementAction.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';
import { updateRawMatConsumption } from '#components/redux/actions/recipeAction.js';

function QualityManagementAddModal(props) {
  const { latestProducts } = useProductsContext();
  const { warehouse_data, list_of_ordered_production } = useWarehouseContext();

  const [productionPlanDataList, setProductionPlanDataList] = useState([]);
  const [customBatchSelectInput, setCustomBatchSelectInput] = useState({});
  const [customBatchSelect, setCustomBatchSelect] = useState(false);
  const [productArticleOptions, setProductArticleOptions] = useState([]);

  const batchOutside = useSelector((state) => state.batchOutside);

  const production_plan_table = [
    {
      Header: 'Product article',
      accessor: 'product_article',
      Filter: TextSearchFilter,
    },
    {
      Header: 'quantity_pallets',
      accessor: 'quantity_pallets',
      Filter: TextSearchFilter,
    },
    {
      Header: 'quantity_free',
      accessor: 'quantity_free',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Position in autoclave',
      accessor: 'position_in_autoclave',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Date',
      accessor: 'date',
      Filter: TextSearchFilter,
    },
  ];

  const add_batch_dialog = [
    {
      Header: 'Batch ID',
      accessor: 'batch_id',
    },
    {
      Header: 'Product article',
      accessor: 'product_article',
    },
    {
      Header: 'Total Qty in batch, plan, pallets',
      accessor: 'total_quantity_plan',
    },
    // {
    //   Header: 'Reserved Qty in batch, pallets',
    //   accessor: 'reserved_quantity',
    // },
  ];

  // --- RAW MAT CONS

  const {
    raw_mat_consumption,
    main_raw_mat_consumption,
    COLUMNS_RAW_MAT_CONSUMPTION,
  } = useRecipeContext();

  const [filteredRawMatConsumption, setFilteredRaw_MatConsumption] = useState();

  // useEffect(() => {
  //   if (!raw_mat_consumption || !main_raw_mat_consumption) {
  //     setFilteredRaw_MatConsumption([]);
  //     return;
  //   }

  //   const sumMap = new Map();

  //   main_raw_mat_consumption.forEach((item) => {
  //     const key = `${item.batch_id}`;

  //     const currentSum = sumMap.get(key) || 0;

  //     sumMap.set(key, currentSum + Number(item.consumed_volume || 0));
  //   });

  //   const filtered = raw_mat_consumption.filter((item) => {
  //     if (item.used) {
  //       return;
  //     }
  //     const key = `${item.batch_id}`;

  //     const totalFromMain = sumMap.get(key) || 0;

  //     return Number(item.production_volume) !== totalFromMain;
  //   });

  //   setFilteredRaw_MatConsumption(filtered);
  // }, [raw_mat_consumption, main_raw_mat_consumption]);

  useEffect(() => {
    if (!raw_mat_consumption || !main_raw_mat_consumption) {
      setFilteredRaw_MatConsumption([]);
      return;
    }

    const filtered = raw_mat_consumption?.filter((item) => !item.used);

    setFilteredRaw_MatConsumption(filtered);
  }, [raw_mat_consumption, main_raw_mat_consumption]);

  // ---

  const dispatch = useDispatch();

  const handleCustomBatchSelectInputChange = useCallback((e) => {
    setCustomBatchSelectInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  useEffect(() => {
    const options = productArticleOptions;
    if (!options) return;

    const productArticleOption = options.find(
      (option) => option.value === customBatchSelectInput?.product_article,
    );
    const selectedOption = productArticleOption || options[0];
    const product = latestProducts.find(
      (el) => el.article === selectedOption?.value,
    );

    if (!product) return;

    const warehouse_article = getWarehouseArticle(product);

    // Обновляем состояние только если batch_id действительно изменился
    if (customBatchSelectInput.batch_id !== warehouse_article) {
      setCustomBatchSelectInput((prev) => ({
        ...prev,
        batch_id: warehouse_article,
      }));
    }
  }, [
    productArticleOptions,
    customBatchSelectInput?.product_article,
    latestProducts,
  ]);

  // Теперь эта функция просто возвращает выбранную опцию, не изменяя состояние
  const getSelectedProductArticleOption = (accessor) => {
    const options = productArticleOptions;
    if (!options) return null;

    const productArticleOption = options.find(
      (option) => option.value === customBatchSelectInput?.[accessor],
    );

    return productArticleOption || options[0];
  };

  const handleProductArticleSelectChange = (selectedOption, key) => {
    const product = latestProducts.find((el) => el.article === selectedOption.value);
    const warehouse_article = getWarehouseArticle(product);

    setCustomBatchSelectInput((prev) => ({
      ...prev,
      batch_id: warehouse_article,
      [key]: selectedOption.value,
    }));
  };

  const getWarehouseArticle = (product) => {
    let versionNumber = '0001';
    let incVersion = 1;
    const type = 0;
    const articleId =
      warehouse_data.length === 0 ? 1 : warehouse_data.length + incVersion++;

    versionNumber = `0000000${articleId}`.slice(-6);

    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const day = new Date().getDate();

    const certificate = product?.certificate.slice(0, 1);
    const density = product?.density.toString().slice(0, 1);

    const warehouseArticle = `S${type}0${certificate}${density}${year}${month}${day}${versionNumber}`;

    return warehouseArticle;
  };

  const handlerAddProductionPlanEntry = useCallback((row) => {
    // const prodPlanEntry = batchOutside.filter(
    //   (el) => el.id === row.original.id,
    // )[0];

    // const reservedProduct =
    //   list_of_ordered_production?.find(
    //     (item) => item.id === prodPlanEntry.id_list_of_ordered_production,
    //   ) || [];

    // // reserved_quantity:сумма всех reservedProduct.quantity - reservedProduct.quantity_in_warehouse по item.article в list_of_ordered_production
    // // если это больше total_quantity_plan, то туда записывается total_quantity_plan

    // const filteredListOfOrderedProduction = list_of_ordered_production?.filter(
    //   (item) => item.product_article === prodPlanEntry?.product_article,
    // );

    // const totalDifference = filteredListOfOrderedProduction.reduce(
    //   (sum, item) => {
    //     return sum + (item?.quantity - item?.quantity_in_warehouse);
    //   },
    //   0,
    // );

    // const reserved_quantity =
    //   totalDifference > prodPlanEntry.quantity_pallets
    //     ? prodPlanEntry.quantity_pallets
    //     : totalDifference;

    // const product = latestProducts.find(
    //   (el) => el.article === prodPlanEntry?.product_article,
    // );

    // const warehouse_article = getWarehouseArticle(product);

    // dispatch(
    //   addNewQualityManagement({
    //     batch_id: warehouse_article,
    //     product_article: prodPlanEntry.product_article,
    //     total_quantity_plan: prodPlanEntry.quantity_pallets,
    //     reserved_quantity, // reservedProduct.quantity,
    //     // prodPlanEntry.quantity_pallets - prodPlanEntry.quantity_free,
    //     reserved_quantity_allocated: 0,
    //     reserved_quantity_remaining: reserved_quantity, // reservedProduct.quantity,
    //     // prodPlanEntry.quantity_pallets - prodPlanEntry.quantity_free - 0,
    //     free_quantity_fact: 0,
    //     production_plan_id: prodPlanEntry.id,
    //     sorting: 0,
    //   }),
    // );

    const rawMatConsEntry = raw_mat_consumption.filter(
      (el) => el.id === row.original.id,
    )[0];

    const product = latestProducts.find(
      (el) => el.article === rawMatConsEntry?.batch_article,
    );

    const warehouse_article = getWarehouseArticle(product);
    const widthInArray = Math.floor(
      product?.m3InArray / product?.volumeBlockOnPallet,
    );

    dispatch(
      addNewQualityManagement({
        batch_id: warehouse_article,
        product_article: rawMatConsEntry?.batch_article,
        total_quantity_plan: rawMatConsEntry.production_volume * widthInArray,
        reserved_quantity: rawMatConsEntry.batch_quantity_pallets, // reservedProduct.quantity,
        // prodPlanEntry.quantity_pallets - prodPlanEntry.quantity_free,
        reserved_quantity_allocated: 0,
        reserved_quantity_remaining: 0, // reservedProduct.quantity,
        // prodPlanEntry.quantity_pallets - prodPlanEntry.quantity_free - 0,
        free_quantity_fact: 0,
        production_plan_id: null,
        raw_mat_cons_batch_id: rawMatConsEntry?.batch_id,
        sorting: 0,
        id_ordered_product_to_warehouse:
          rawMatConsEntry?.id_ordered_product_to_warehouse,
        date: rawMatConsEntry?.date,
      }),
    );
    dispatch(updateRawMatConsumption({ id: rawMatConsEntry?.id, used: true }));

    props.setConsumptionCalculated({
      id: rawMatConsEntry?.id,
      consumption_calculated: rawMatConsEntry?.consumption_calculated,
    });

    setCustomBatchSelect(false);
    setCustomBatchSelectInput({});

    props.onHide();
  }, []);

  // const handlerAddCustomBatchEntry = useCallback((row) => {
  //   const { batch_id, product_article, total_quantity_plan, reserved_quantity } =
  //     customBatchSelectInput;

  //   dispatch(
  //     addNewQualityManagement({
  //       batch_id,
  //       product_article,
  //       total_quantity_plan,
  //       reserved_quantity,
  //       reserved_quantity_allocated: 0,
  //       reserved_quantity_remaining: reserved_quantity,
  //       free_quantity_fact: 0,
  //       from_production_plan: true
  //     })
  //   );
  // }, []);

  useEffect(() => {
    if (batchOutside) {
      setProductionPlanDataList(batchOutside);
    }
  }, [batchOutside]);

  useEffect(() => {
    if (latestProducts) {
      const newOptions = latestProducts.map((product) => ({
        value: product.article,
        label: product.article,
      }));

      setProductArticleOptions(newOptions);
    }
  }, [latestProducts]);

  useEffect(() => {
    setCustomBatchSelectInput((prev) => ({
      ...prev,
      product_article: productArticleOptions[0]?.value,
    }));
  }, [props.show]);

  const onSubmitForm = async (e) => {
    e.preventDefault();

    const { batch_id, product_article, total_quantity_plan } =
      customBatchSelectInput;

    dispatch(
      addNewQualityManagement({
        batch_id,
        product_article,
        total_quantity_plan,
        reserved_quantity: 0,
        reserved_quantity_allocated: 0,
        reserved_quantity_remaining: 0,
        free_quantity_fact: 0,
        from_production_plan: false,
        sorting: 0,
      }),
    );

    setCustomBatchSelect(false);
    setCustomBatchSelectInput({});

    props.onHide();
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dialogClassName="modal-auto-size"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Batch calendar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {customBatchSelect ? (
          <>
            <form
              id="qualityManagementAddCustomBatch"
              className="w-full max-w-sm"
              onSubmit={(e) => {
                onSubmitForm(e);
              }}
            >
              <Row>
                {add_batch_dialog.map((el) => (
                  <Col key={el.id}>
                    <div className="md:flex md:items-center mb-6">
                      <div className="md:w-1/3">
                        <label
                          className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                          // for="version"
                        >
                          {el.Header}
                        </label>
                      </div>
                      <div className="md:w-2/3">
                        {el.accessor === 'product_article' ? (
                          <Select
                            defaultValue={getSelectedProductArticleOption(
                              el.accessor,
                            )}
                            onChange={(v) => {
                              handleProductArticleSelectChange(v, el.accessor);
                            }}
                            options={productArticleOptions}
                          />
                        ) : (
                          <input
                            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                            id={el.accessor}
                            name={el.accessor}
                            type="text"
                            value={customBatchSelectInput[el.accessor] || ''}
                            onChange={(e) => handleCustomBatchSelectInputChange(e)}
                          />
                        )}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </form>
          </>
        ) : (
          <>
            {/* <Table
              COLUMN_DATA={production_plan_table}
              dataOfTable={productionPlanDataList}
              // userAccess={userAccess}
              onClickButton={() => {}}
              buttonText={''}
              tableName={'Batch calendar'}
              handleRowClick={(row) => {
                handlerAddProductionPlanEntry(row);
              }}
            /> */}
            <Table
              COLUMN_DATA={COLUMNS_RAW_MAT_CONSUMPTION}
              dataOfTable={filteredRawMatConsumption}
              tableName={'Raw materials consumption'}
              handleRowClick={(row) => {
                handlerAddProductionPlanEntry(row);
              }}
            />
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        {customBatchSelect ? (
          <>
            <Button
              variant="info"
              className="me-auto"
              onClick={() => setCustomBatchSelect(false)}
            >
              Return
            </Button>
            <Button form="qualityManagementAddCustomBatch" type="submit">
              Add batch
            </Button>
          </>
        ) : (
          <Button
            variant="info"
            className="me-auto"
            onClick={() => setCustomBatchSelect(true)}
          >
            Add custom batch dialog
          </Button>
        )}

        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function ShowQualityManagementAddModal({ setConsumptionCalculated }) {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Button
        variant="primary"
        onClick={() => {
          setModalShow(true);
        }}
      >
        Start new batch
      </Button>

      <QualityManagementAddModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        setConsumptionCalculated={setConsumptionCalculated}
      />
    </>
  );
}

export default ShowQualityManagementAddModal;
