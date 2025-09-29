import Table from '../Table/Table';
import { TextSearchFilter } from '#components/Table/filters.js';
import Modal from 'react-bootstrap/Modal';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { useNavigate } from 'react-router-dom';
import RawMaterialsWarehouseAdd from './RawMaterialsWarehouseAdd';

function RawMaterialsWarehouseInfo(props) {
  const [addModalShow, setAddModalShow] = useState(false);

  const user = useSelector((state) => state.user);

  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  const navigate = useNavigate();

  const useRawMaterialSelector = (materialType) => {
    return useSelector((state) => {
      switch (materialType) {
        case 'Sand':
          return state.warehouseSand;
        case 'Lime':
          return state.warehouseLime;
        case 'Cement':
          return state.warehouseCement;
        case 'Gypsum':
          return state.warehouseGypsum;
        case 'Gypsum stone':
          return state.warehouseGypsumStone;
        case 'Aluminum 1':
          return state.warehouseAluminum1;
        case 'Aluminum 2':
          return state.warehouseAluminum2;
        case 'Grinding Balls':
          return state.warehouseGrindingBalls;
        case 'AAC':
          return state.warehouseAAC;
        default:
          return state.warehouseSand;
      }
    });
  };

  const raw_material_warehouse = useRawMaterialSelector(props?.material_type);

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

  const handleRowClick = useCallback((row) => {
    console.log('row.original', row.original);
  }, []);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Warehouse');
      setUserAccess(access);

      if (!access?.canRead) {
        navigate('/'); // Перенаправление на главную страницу, если нет прав на чтение
      }
    }
  }, [user, roles]);

  return (
    <>
      <Modal
        {...props}
        show={props.show}
        onHide={props.onHide}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton>
          {/* <Modal.Title id="contained-modal-title-vcenter">
            {props?.material_type}
          </Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
          <Table
            COLUMN_DATA={raw_material_table}
            dataOfTable={raw_material_warehouse}
            userAccess={userAccess}
            tableName={props?.material_type}
            handleRowClick={handleRowClick}
            onClickButton={() => {
              setAddModalShow(!addModalShow);
            }}
            buttonText={`Add new ${props?.material_type.toLowerCase()}`}
          />
        </Modal.Body>
      </Modal>
      <RawMaterialsWarehouseAdd
        show={addModalShow}
        onHide={() => setAddModalShow(false)}
        material_type={props?.material_type}
      />
    </>
  );
}

export default RawMaterialsWarehouseInfo;
