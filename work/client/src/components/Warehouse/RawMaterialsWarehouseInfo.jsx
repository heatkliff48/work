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
import RawMaterialsWarehouseSupplierInfoAdd from './RawMaterialsWarehouseSupplierInfoAdd';
import '#components/Styles/modals.css';

function RawMaterialsWarehouseInfo(props) {
  const [addModalShow, setAddModalShow] = useState(false);
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [supplierInfo, setSupplierInfo] = useState(false);

  const user = useSelector((state) => state.user);

  const { roles, checkUserAccess, userAccess, setUserAccess } =
    useUsersContext();

  const navigate = useNavigate();

  const useRawMaterialSelector = (materialType) => {
    return useSelector((state) => {
      switch (materialType) {
        case 'Sand (dry)':
          return state.warehouseSand;
        case 'Lime':
          return state.warehouseLime;
        case 'Cement':
          return state.warehouseCement;
        case 'Gypsum (dry)':
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
        case 'Sand slurry (dry)':
          return state.warehouseSandSlurry;
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
    (props?.material_type === 'Cement' ||
      props?.material_type === 'Aluminum 1' ||
      props?.material_type === 'Aluminum 2' ||
      props?.material_type === 'Lime' ||
      props?.material_type === 'Sand (dry)') && {
      Header: 'Type',
      accessor: 'type',
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
    {
      Header: 'Quality',
      accessor: 'quality',
      Filter: TextSearchFilter,
    },
  ].filter(Boolean);

  const sand_slurry_table = [
    {
      Header: 'Sand (dry)',
      accessor: 'sand',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Gypsum stone',
      accessor: 'gypsum_stone',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Water',
      accessor: 'water',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Grinding balls',
      accessor: 'grinding_balls',
      Filter: TextSearchFilter,
    },
    {
      Header: 'AAC scrap',
      accessor: 'aac_scrap',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Portion size',
      accessor: 'portion_size',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Date',
      accessor: 'date',
      Filter: TextSearchFilter,
    },
  ].filter(Boolean);

  const handleRowClick = useCallback((row) => {
    setSupplierInfo(row.original);
    setUpdateModalShow(!updateModalShow);
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
        size="xl" // Используем максимальный размер
        dialogClassName="modal-table-width" // Кастомный класс для ширины
      >
        <Modal.Header closeButton>
          {/* <Modal.Title id="contained-modal-title-vcenter">
          {props?.material_type}
        </Modal.Title> */}
        </Modal.Header>
        <Modal.Body className="p-0">
          {' '}
          {/* Убираем padding для полной ширины таблицы */}
          {props?.material_type != 'Sand slurry (dry)' && (
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
          )}
          {props?.material_type === 'Sand slurry (dry)' && (
            <Table
              COLUMN_DATA={sand_slurry_table}
              dataOfTable={raw_material_warehouse}
              userAccess={userAccess}
              tableName={props?.material_type}
              handleRowClick={() => {}}
            />
          )}
        </Modal.Body>
      </Modal>
      <RawMaterialsWarehouseAdd
        show={addModalShow}
        onHide={() => setAddModalShow(false)}
        material_type={props?.material_type}
      />
      <RawMaterialsWarehouseSupplierInfoAdd
        show={updateModalShow}
        onHide={() => setUpdateModalShow(false)}
        supplierInfo={supplierInfo}
        material_type={props?.material_type}
      />
    </>
  );
}

export default RawMaterialsWarehouseInfo;
