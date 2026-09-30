import { TextSearchFilter } from '#components/Table/filters.js';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { useNavigate } from 'react-router-dom';
import { Container } from 'reactstrap';
import * as warehouseActions from '#components/redux/actions/warehouseRawMaterialsAction.js';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import { translateMaterial } from '#i18n/index.js';
import { PALLET_TYPES, PALLET_TYPE_OPTIONS } from '#utils/palletTypes.js';

function RawMaterialsWarehouseAdd(props) {
  const [rawMaterialWarehouseInput, setRawMaterialWarehouseInput] = useState(
    {},
  );
  // значения — ключи перевода, переводятся при рендере
  const [errors, setErrors] = useState({});
  const [dataValue, setDataValue] = useState(null);

  const user = useSelector((state) => state.user);

  const { roles, checkUserAccess, setUserAccess } = useUsersContext();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('rawMaterialsWarehouse');
  const materialLabel = translateMaterial(t, props?.material_type);

  // const cementTypeOptions = [
  //   { value: 'type 1', label: 'Type 1' },
  //   { value: 'type 2', label: 'Type 2' },
  //   { value: 'type 3', label: 'Type 3' },
  // ];

  const raw_material_table = [
    {
      Header: t('columns.supplier'),
      accessor: 'supplier',
      Filter: TextSearchFilter,
    },
    {
      Header:
        props?.material_type === 'Pallets'
          ? t('columns.quantityPieces')
          : t('columns.quantityKg'),
      accessor: 'quantity',
      Filter: TextSearchFilter,
    },
    props?.material_type === 'Lime' && {
      Header: t('columns.type'),
      accessor: 'typeLime',
      Filter: TextSearchFilter,
    },
    props?.material_type === 'Pallets' && {
      Header: t('columns.type'),
      accessor: 'typePallet',
      Filter: TextSearchFilter,
      options: PALLET_TYPE_OPTIONS,
    },
    props?.material_type === 'Aluminum' && {
      Header: t('columns.type'),
      accessor: 'typeAlum1',
      Filter: TextSearchFilter,
    },
    props?.material_type === 'Aluminum 2' && {
      Header: t('columns.type'),
      accessor: 'typeAlum2',
      Filter: TextSearchFilter,
    },
    props?.material_type === 'Cement' && {
      Header: t('columns.type'),
      accessor: 'typeCement',
      Filter: TextSearchFilter,
    },
    props?.material_type === 'Sand (dry)' && {
      Header: t('columns.type'),
      accessor: 'typeSand',
      Filter: TextSearchFilter,
    },
    props?.material_type === 'Grinding Balls' && {
      Header: t('columns.diameterMm'),
      accessor: 'diameter',
      Filter: TextSearchFilter,
    },
    {
      Header: t('columns.date'),
      accessor: 'date',
      Filter: TextSearchFilter,
    },
  ];

  const initState = {
    typeCement: 'CEM I 52.5 R-SR3',
    typeSand: 'SILICA 0-2 WS',
    typeLime: 'CL 90Q',
    typeAlum1: '7040-10/70WB28',
    typeAlum2: '7100-30/70WB28',
    typePallet: PALLET_TYPES.EUROPEO,
    diameter: 30,
  };

  const handleRawMaterialWarehouseInputChange = useCallback((e) => {
    let processedValue = e.target.value;
    if (typeof e.target.value === 'string') {
      processedValue = e.target.value.replace(/(\d+),(\d*)/g, '$1.$2');
    }
    setRawMaterialWarehouseInput((prev) => ({
      ...prev,
      [e.target.name]: processedValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: '',
    }));
  }, []);

  // const getSelectedOption = (fieldName) => {
  //   if (fieldName === 'cementType') {
  //     return (
  //       cementTypeOptions.find(
  //         (option) => option.value === rawMaterialWarehouseInput.cementType,
  //       ) || cementTypeOptions[0]
  //     );
  //   }
  //   return null;
  // };

  const handleSelectChange = useCallback((selectedOption, fieldName) => {
    setRawMaterialWarehouseInput((prev) => ({
      ...prev,
      [fieldName]: selectedOption?.value,
    }));
    setErrors((prev) => ({
      ...prev,
      [fieldName]: '',
    }));
  }, []);

  const handleDateChange = useCallback((date) => {
    setRawMaterialWarehouseInput((prev) => ({
      ...prev,
      date: date.toString(),
    }));
    setDataValue(date);
    setErrors((prev) => ({
      ...prev,
      date: '',
    }));
  }, []);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Warehouse');
      setUserAccess(access);

      if (!access?.canRead) {
        navigate('/');
      }
    }
  }, [user, roles]);

  useEffect(() => {
    if (props?.material_type === 'Cement') {
      setRawMaterialWarehouseInput((prev) => ({
        ...prev,
        typeCement: 'CEM I 52.5 R-SR3',
      }));
    }
    if (props?.material_type === 'Sand (dry)') {
      setRawMaterialWarehouseInput((prev) => ({
        ...prev,
        typeSand: 'SILICA 0-2 WS',
      }));
    }
    if (props?.material_type === 'Lime') {
      setRawMaterialWarehouseInput((prev) => ({
        ...prev,
        typeLime: initState.typeLime,
      }));
    }
    if (props?.material_type === 'Aluminum') {
      setRawMaterialWarehouseInput((prev) => ({
        ...prev,
        typeAlum1: initState.typeAlum1,
      }));
    }
    if (props?.material_type === 'Aluminum 2') {
      setRawMaterialWarehouseInput((prev) => ({
        ...prev,
        typeAlum2: initState.typeAlum2,
      }));
    }
    if (props?.material_type === 'Pallets') {
      setRawMaterialWarehouseInput((prev) => ({
        ...prev,
        typePallet: initState.typePallet,
      }));
    }
    if (props?.material_type === 'Grinding Balls') {
      setRawMaterialWarehouseInput((prev) => ({
        ...prev,
        diameter: 30,
      }));
    }
  }, [props?.material_type]);

  const getAddAction = useCallback((materialType) => {
    const actionMap = {
      'Sand (dry)': warehouseActions.addNewWarehouseSand,
      Lime: warehouseActions.addNewWarehouseLime,
      Cement: warehouseActions.addNewWarehouseCement,
      'Gypsum (dry)': warehouseActions.addNewWarehouseGypsum,
      'Gypsum stone': warehouseActions.addNewWarehouseGypsumStone,
      Aluminum: warehouseActions.addNewWarehouseAluminum1,
      'Aluminum 2': warehouseActions.addNewWarehouseAluminum2,
      'Grinding Balls': warehouseActions.addNewWarehouseGrindingBalls,
      AAC: warehouseActions.addNewWarehouseAAC,
      Pallets: warehouseActions.addNewWarehousePallets,
      Plastics: warehouseActions.addNewWarehousePlastics,
      'Sand powder (dry)': warehouseActions.addNewWarehouseSandPowder,
    };

    return actionMap[materialType] || warehouseActions.addNewWarehouseSand;
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!rawMaterialWarehouseInput?.supplier?.trim()) {
      newErrors.supplier = 'errors.supplierRequired';
    }

    if (!rawMaterialWarehouseInput?.quantity?.trim()) {
      newErrors.quantity = 'errors.quantityRequired';
    } else if (
      isNaN(rawMaterialWarehouseInput.quantity) ||
      parseFloat(rawMaterialWarehouseInput.quantity) <= 0
    ) {
      newErrors.quantity = 'errors.quantityPositive';
    }

    if (
      props?.material_type === 'Cement' &&
      !rawMaterialWarehouseInput?.typeCement
    ) {
      newErrors.typeCement = 'errors.typeRequired';
    }
    if (
      props?.material_type === 'Sand (dry)' &&
      !rawMaterialWarehouseInput?.typeSand
    ) {
      newErrors.typeSand = 'errors.typeRequired';
    }
    if (
      props?.material_type === 'Grinding Balls' &&
      !rawMaterialWarehouseInput?.diameter
    ) {
      newErrors.diameter = 'errors.diameterRequired';
    }
    if (!rawMaterialWarehouseInput?.date?.trim()) {
      newErrors.supplier = 'errors.dateRequired';
    }
    if (
      props?.material_type === 'Lime' &&
      !rawMaterialWarehouseInput?.typeLime
    ) {
      newErrors.typeLime = 'errors.typeRequired';
    }
    if (
      props?.material_type === 'Aluminum' &&
      !rawMaterialWarehouseInput?.typeAlum1
    ) {
      newErrors.typeAlum1 = 'errors.typeRequired';
    }
    if (
      props?.material_type === 'Aluminum 2' &&
      !rawMaterialWarehouseInput?.typeAlum2
    ) {
      newErrors.typeAlum2 = 'errors.typeRequired';
    }
    if (
      props?.material_type === 'Pallets' &&
      !rawMaterialWarehouseInput?.typePallet
    ) {
      newErrors.typePallet = 'errors.typeRequired';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetModal = useCallback(() => {
    setRawMaterialWarehouseInput({ ...initState });
    setErrors({});
    setDataValue(null);
  }, []);

  const handleHide = useCallback(() => {
    props.onHide();
    resetModal();
  }, [props.onHide, resetModal]);

  const onSubmitForm = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log(
      props?.material_type,
      'props?.material_type RawMaterialsWarehouseAdd.jsx line 287',
    );

    const addAction = getAddAction(props?.material_type);

    const formData =
      props?.material_type === 'Lime'
        ? {
            supplier: rawMaterialWarehouseInput?.supplier,
            quantity: rawMaterialWarehouseInput?.quantity,
            date: rawMaterialWarehouseInput?.date,
            type: rawMaterialWarehouseInput?.typeLime,
          }
        : props?.material_type === 'Cement'
          ? {
              supplier: rawMaterialWarehouseInput?.supplier,
              quantity: rawMaterialWarehouseInput?.quantity,
              date: rawMaterialWarehouseInput?.date,
              type: rawMaterialWarehouseInput?.typeCement,
            }
          : props?.material_type === 'Sand (dry)'
            ? {
                supplier: rawMaterialWarehouseInput?.supplier,
                quantity: rawMaterialWarehouseInput?.quantity,
                date: rawMaterialWarehouseInput?.date,
                type: rawMaterialWarehouseInput?.typeSand,
              }
            : props?.material_type === 'Grinding Balls'
              ? {
                  supplier: rawMaterialWarehouseInput?.supplier,
                  quantity: rawMaterialWarehouseInput?.quantity,
                  date: rawMaterialWarehouseInput?.date,
                  diameter: rawMaterialWarehouseInput?.diameter,
                }
              : props?.material_type === 'Aluminum'
                ? {
                    supplier: rawMaterialWarehouseInput?.supplier,
                    quantity: rawMaterialWarehouseInput?.quantity,
                    date: rawMaterialWarehouseInput?.date,
                    type: rawMaterialWarehouseInput?.typeAlum1,
                  }
                : props?.material_type === 'Aluminum 2'
                  ? {
                      supplier: rawMaterialWarehouseInput?.supplier,
                      quantity: rawMaterialWarehouseInput?.quantity,
                      date: rawMaterialWarehouseInput?.date,
                      type: rawMaterialWarehouseInput?.typeAlum2,
                    }
                  : props?.material_type === 'Pallets'
                    ? {
                        supplier: rawMaterialWarehouseInput?.supplier,
                        quantity: rawMaterialWarehouseInput?.quantity,
                        date: rawMaterialWarehouseInput?.date,
                        type: rawMaterialWarehouseInput?.typePallet,
                      }
                    : {
                        supplier: rawMaterialWarehouseInput?.supplier,
                        quantity: rawMaterialWarehouseInput?.quantity,
                        date: rawMaterialWarehouseInput?.date,
                      };

    dispatch(addAction(formData));
    setRawMaterialWarehouseInput({ ...initState });
    setDataValue(null);
    setErrors({});
    props.onHide();
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dialogClassName="modal-auto-size"
      onExited={resetModal}
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <Container>
          <form
            id="addClientModel"
            className="w-full max-w-sm"
            onSubmit={onSubmitForm}
          >
            <h3>{t('add.title', { material: materialLabel })}</h3>
            <Row>
              {raw_material_table.map((el) =>
                el.accessor === 'date' || !el.accessor ? null : (
                  <Col key={el.accessor}>
                    <div className="md:flex md:items-center mb-6">
                      <div className="md:w-1/3">
                        <label
                          className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                          htmlFor={el.accessor}
                        >
                          {el.Header}
                        </label>
                      </div>
                      <div className="md:w-2/3">
                        {el.options ? (
                          <Select
                            inputId={el.accessor}
                            name={el.accessor}
                            options={el.options}
                            value={
                              el.options.find(
                                (option) =>
                                  option.value ===
                                  rawMaterialWarehouseInput[el.accessor],
                              ) || null
                            }
                            onChange={(option) =>
                              handleSelectChange(option, el.accessor)
                            }
                            isSearchable={false}
                          />
                        ) : (
                          <input
                            className={`bg-gray-200 appearance-none border-2 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${
                              errors[el.accessor]
                                ? 'border-red-500'
                                : 'border-gray-300'
                            }`}
                            id={el.accessor}
                            name={el.accessor}
                            type="text"
                            value={rawMaterialWarehouseInput[el.accessor] || ''}
                            onChange={handleRawMaterialWarehouseInputChange}
                          />
                        )}
                        {errors[el.accessor] && (
                          <p className="text-red-500 text-xs mt-1">
                            {t(errors[el.accessor], { material: materialLabel })}
                          </p>
                        )}
                      </div>
                    </div>
                  </Col>
                ),
              )}
            </Row>
            {/* {props?.material_type === 'Cement' && (
              <Row>
                <Col>
                  <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                      <label
                        className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                        htmlFor="cementType"
                      >
                        Type
                      </label>
                    </div>
                    <div className="md:w-2/3">
                      <Select
                        defaultValue={getSelectedOption('cementType')}
                        onChange={(v) => {
                          handleSelectChange(v, 'cementType');
                        }}
                        options={cementTypeOptions}
                      />
                      {errors.cementType && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.cementType}
                        </p>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            )} */}
            <div>
              <label
                className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                htmlFor="cementType"
              >
                {t('columns.date')}
              </label>
              <DatePicker
                id="data_pcker"
                type="text"
                selected={dataValue}
                onChange={(date) => handleDateChange(date)}
                dateFormat="dd.MM.yyyy"
                locale={i18n.resolvedLanguage}
              />
            </div>
          </form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button form="addClientModel" type="submit">
          {t('add.submit', { material: materialLabel })}
        </Button>
        <Button onClick={handleHide}>{t('close', { ns: 'common' })}</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RawMaterialsWarehouseAdd;
