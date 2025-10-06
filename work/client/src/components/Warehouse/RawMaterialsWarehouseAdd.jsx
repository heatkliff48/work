import Table from '../Table/Table';
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

function RawMaterialsWarehouseAdd(props) {
  const [rawMaterialWarehouseInput, setRawMaterialWarehouseInput] = useState({});

  const user = useSelector((state) => state.user);

  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const raw_material_table = [
    {
      Header: 'Supplier',
      accessor: 'supplier',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Quantity, kg',
      accessor: 'quantity',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Date',
      accessor: 'date',
      Filter: TextSearchFilter,
    },
  ];

  const handleRawMaterialWarehouseInputChange = useCallback((e) => {
    setRawMaterialWarehouseInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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

  // Функция для получения правильного action
  const getAddAction = useCallback((materialType) => {
    const actionMap = {
      Sand: warehouseActions.addNewWarehouseSand,
      Lime: warehouseActions.addNewWarehouseLime,
      Cement: warehouseActions.addNewWarehouseCement,
      Gypsum: warehouseActions.addNewWarehouseGypsum,
      'Gypsum stone': warehouseActions.addNewWarehouseGypsumStone,
      'Aluminum 1': warehouseActions.addNewWarehouseAluminum1,
      'Aluminum 2': warehouseActions.addNewWarehouseAluminum2,
      'Grinding Balls': warehouseActions.addNewWarehouseGrindingBalls,
      AAC: warehouseActions.addNewWarehouseAAC,
    };

    return actionMap[materialType] || warehouseActions.addNewWarehouseSand;
  }, []);

  const onSubmitForm = async (e) => {
    e.preventDefault();

    const addAction = getAddAction(props?.material_type);

    dispatch(
      addAction({
        supplier: rawMaterialWarehouseInput?.supplier,
        quantity: rawMaterialWarehouseInput?.quantity,
      })
    );
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
            id="addClientModel"
            className="w-full max-w-sm"
            onSubmit={onSubmitForm}
          >
            <h3>Add {props?.material_type}</h3>
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
                          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                          id={el.accessor}
                          name={el.accessor}
                          type="text"
                          value={rawMaterialWarehouseInput[el.accessor] || ''}
                          onChange={handleRawMaterialWarehouseInputChange}
                        />
                      </div>
                    </div>
                  </Col>
                )
              )}
            </Row>
          </form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button form="addClientModel" type="submit">
          Add {props?.material_type.toLowerCase()}
        </Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RawMaterialsWarehouseAdd;
