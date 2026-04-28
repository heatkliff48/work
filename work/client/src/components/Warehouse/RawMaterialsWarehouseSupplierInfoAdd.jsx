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

function RawMaterialsWarehouseSupplierInfoAdd(props) {
  const [rawMaterialWarehouseInput, setRawMaterialWarehouseInput] = useState({});
  const [inputError, setInputError] = useState('');

  const user = useSelector((state) => state.user);

  const { roles, checkUserAccess, setUserAccess } = useUsersContext();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const raw_material_table = [
    {
      Header: 'Enter % from 0 to 100',
      accessor: 'quality',
      Filter: TextSearchFilter,
    },
  ];

  const handleRawMaterialWarehouseInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'quality') {
      // Очищаем ошибку
      setInputError('');

      // Пустое значение разрешено
      if (value === '') {
        setRawMaterialWarehouseInput((prev) => ({
          ...prev,
          [name]: value,
        }));
        return;
      }

      // Проверяем формат числа
      if (!/^-?\d*\.?\d*$/.test(value)) {
        setInputError('Please enter a valid number (0-100)');
        return;
      }

      const floatValue = parseFloat(value);

      // Проверяем диапазон
      if (isNaN(floatValue)) {
        setInputError('Please enter a valid number');
      } else if (floatValue < 0 || floatValue > 100) {
        setInputError('Value must be between 0 and 100');
      } else {
        setRawMaterialWarehouseInput((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setRawMaterialWarehouseInput((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Warehouse');
      setUserAccess(access);

      if (!access?.canRead) {
        navigate('/');
      }
    }
  }, [user, roles]);

  // Функция для получения правильного action
  const getUpdateAction = useCallback((materialType) => {
    const actionMap = {
      Sand: warehouseActions.updateWarehouseSand,
      Lime: warehouseActions.updateWarehouseLime,
      Cement: warehouseActions.updateWarehouseCement,
      Gypsum: warehouseActions.updateWarehouseGypsum,
      'Gypsum stone': warehouseActions.updateWarehouseGypsumStone,
      'Aluminum 1': warehouseActions.updateWarehouseAluminum1,
      'Aluminum 2': warehouseActions.updateWarehouseAluminum2,
      'Grinding Balls': warehouseActions.updateWarehouseGrindingBalls,
      AAC: warehouseActions.updateWarehouseAAC,
      Plastics: warehouseActions.updateWarehousePlastics,
      Pallets: warehouseActions.updateWarehousePallets,
      'Sand powder': warehouseActions.updateWarehouseSandPowder,
      'Sand slurry (dry)': warehouseActions.updateWarehouseSandSlurry,
    };

    return actionMap[materialType] || warehouseActions.updateWarehouseSand;
  }, []);

  useEffect(() => {
    setRawMaterialWarehouseInput((prev) => ({
      ...prev,
      quality: props?.supplierInfo.quality || null,
    }));
  }, [props?.supplierInfo.supplier]);

  const onSubmitForm = async (e) => {
    e.preventDefault();

    const updateRawMaterialAction = getUpdateAction(props?.material_type);

    if (props?.material_type != 'Sand slurry (dry)') {
      dispatch(
        updateRawMaterialAction({
          supplier: props?.supplierInfo.supplier,
          quality: rawMaterialWarehouseInput?.quality,
        }),
      );
    } else {
      const isNeedCheck = props?.supplierInfo.isNeedCheck ? false : true;

      dispatch(
        updateRawMaterialAction({
          id: props?.supplierInfo.id,
          portion_size: rawMaterialWarehouseInput?.quality,
          isNeedCheck,
        }),
      );
    }
    setRawMaterialWarehouseInput({});
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
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <Container>
          <form
            id="rawMaterialWarehouseQualityChange"
            className="w-full max-w-sm"
            onSubmit={onSubmitForm}
          >
            {props?.material_type != 'Sand slurry (dry)' ? (
              <h3>Add quality to {props?.supplierInfo.supplier}</h3>
            ) : (
              <h3>Change residue on the sieve</h3>
            )}
            <Row>
              {raw_material_table.map((el) =>
                el.accessor === 'date' ? null : (
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
                            inputError && el.accessor === 'quality'
                              ? 'border-red-500'
                              : 'border-gray-200'
                          }`}
                          id={el.accessor}
                          name={el.accessor}
                          type="text"
                          placeholder={el.accessor === 'quality' ? '0-100' : ''}
                          value={rawMaterialWarehouseInput[el.accessor] || ''}
                          onChange={handleRawMaterialWarehouseInputChange}
                        />
                        {inputError && el.accessor === 'quality' && (
                          <p className="text-red-500 text-xs mt-1">{inputError}</p>
                        )}
                      </div>
                    </div>
                  </Col>
                ),
              )}
            </Row>
          </form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        {props?.material_type != 'Sand slurry (dry)' ? (
          <Button form="rawMaterialWarehouseQualityChange" type="submit">
            Add quality to {props?.supplierInfo.supplier}
          </Button>
        ) : (
          <Button form="rawMaterialWarehouseQualityChange" type="submit">
            Accept change
          </Button>
        )}
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RawMaterialsWarehouseSupplierInfoAdd;
