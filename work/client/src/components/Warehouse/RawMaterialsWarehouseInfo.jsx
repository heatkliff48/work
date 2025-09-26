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

  const raw_material_warehouse = useSelector((state) => state.warehouseSand);
  const user = useSelector((state) => state.user);

  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  const navigate = useNavigate();

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
