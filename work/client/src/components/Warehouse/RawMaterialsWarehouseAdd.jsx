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
// import Select from 'react-select';

function RawMaterialsWarehouseAdd(props) {
  const [rawMaterialWarehouseInput, setRawMaterialWarehouseInput] = useState(
    {},
  );
  const [errors, setErrors] = useState({});
  const [dataValue, setDataValue] = useState(null);

  const user = useSelector((state) => state.user);

  const { roles, checkUserAccess, setUserAccess } = useUsersContext();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const cementTypeOptions = [
  //   { value: 'type 1', label: 'Type 1' },
  //   { value: 'type 2', label: 'Type 2' },
  //   { value: 'type 3', label: 'Type 3' },
  // ];

  const raw_material_table = [
    {
      Header: 'Supplier',
      accessor: 'supplier',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Quantity, t',
      accessor: 'quantity',
      Filter: TextSearchFilter,
    },
    (props?.material_type === 'Aluminum 1' ||
      props?.material_type === 'Aluminum 2' ||
      props?.material_type === 'Lime') && {
      Header: 'Type',
      accessor: 'type',
      Filter: TextSearchFilter,
    },
    props?.material_type === 'Cement' && {
      Header: 'Type',
      accessor: 'typeCement',
      Filter: TextSearchFilter,
    },
    props?.material_type === 'Sand (dry)' && {
      Header: 'Type',
      accessor: 'typeSand',
      Filter: TextSearchFilter,
    },
    props?.material_type === 'Grinding Balls' && {
      Header: 'Diametro, mm',
      accessor: 'diameter',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Date',
      accessor: 'date',
      Filter: TextSearchFilter,
    },
  ];

  const initState = {
    typeCement: 'CEM I 52.5 R-SR3',
    typeSand: 'SILICA 0-2 WS',
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

  // const handleSelectChange = (selectedOption, fieldName) => {
  //   setRawMaterialWarehouseInput((prev) => ({
  //     ...prev,
  //     [fieldName]: selectedOption.value,
  //   }));
  // };

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
      'Aluminum 1': warehouseActions.addNewWarehouseAluminum1,
      'Aluminum 2': warehouseActions.addNewWarehouseAluminum2,
      'Grinding Balls': warehouseActions.addNewWarehouseGrindingBalls,
      AAC: warehouseActions.addNewWarehouseAAC,
    };

    return actionMap[materialType] || warehouseActions.addNewWarehouseSand;
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!rawMaterialWarehouseInput?.supplier?.trim()) {
      newErrors.supplier = 'Supplier is required';
    }

    if (!rawMaterialWarehouseInput?.quantity?.trim()) {
      newErrors.quantity = 'Quantity is required';
    } else if (
      isNaN(rawMaterialWarehouseInput.quantity) ||
      parseFloat(rawMaterialWarehouseInput.quantity) <= 0
    ) {
      newErrors.quantity = 'Quantity must be a positive number';
    }

    if (
      props?.material_type === 'Cement' &&
      !rawMaterialWarehouseInput?.typeCement
    ) {
      newErrors.typeCement = 'Cement type is required';
    }
    if (
      props?.material_type === 'Sand (dry)' &&
      !rawMaterialWarehouseInput?.typeSand
    ) {
      newErrors.typeSand = 'Sand type is required';
    }
    if (
      props?.material_type === 'Grinding Balls' &&
      !rawMaterialWarehouseInput?.diameter
    ) {
      newErrors.diameter = 'Diameter is required';
    }
    if (!rawMaterialWarehouseInput?.date?.trim()) {
      newErrors.supplier = 'Date is required';
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

    const addAction = getAddAction(props?.material_type);

    const formData =
      props?.material_type === 'Aluminum 1' ||
      props?.material_type === 'Aluminum 2' ||
      props?.material_type === 'Lime'
        ? {
            supplier: rawMaterialWarehouseInput?.supplier,
            quantity: rawMaterialWarehouseInput?.quantity * 1000,
            date: rawMaterialWarehouseInput?.date,
            type: rawMaterialWarehouseInput?.type,
          }
        : props?.material_type === 'Cement'
          ? {
              supplier: rawMaterialWarehouseInput?.supplier,
              quantity: rawMaterialWarehouseInput?.quantity * 1000,
              date: rawMaterialWarehouseInput?.date,
              type: rawMaterialWarehouseInput?.typeCement,
            }
          : props?.material_type === 'Sand (dry)'
            ? {
                supplier: rawMaterialWarehouseInput?.supplier,
                quantity: rawMaterialWarehouseInput?.quantity * 1000,
                date: rawMaterialWarehouseInput?.date,
                type: rawMaterialWarehouseInput?.typeSand,
              }
            : props?.material_type === 'Grinding Balls'
              ? {
                  supplier: rawMaterialWarehouseInput?.supplier,
                  quantity: rawMaterialWarehouseInput?.quantity * 1000,
                  date: rawMaterialWarehouseInput?.date,
                  diameter: rawMaterialWarehouseInput?.diameter,
                }
              : {
                  supplier: rawMaterialWarehouseInput?.supplier,
                  quantity: rawMaterialWarehouseInput?.quantity * 1000,
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
            <h3>Add {props?.material_type}</h3>
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
                        {errors[el.accessor] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors[el.accessor]}
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
                Date
              </label>
              <DatePicker
                id="data_pcker"
                type="text"
                selected={dataValue}
                onChange={(date) => handleDateChange(date)}
                dateFormat="dd.MM.yyyy"
              />
            </div>
          </form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button form="addClientModel" type="submit">
          Add {props?.material_type.toLowerCase()}
        </Button>
        <Button onClick={handleHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RawMaterialsWarehouseAdd;
