import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../Table/Table';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { getRawMaterialsWarehouse } from '#components/redux/actions/warehouseAction.js';
import RawMaterialsWarehouseInfo from './RawMaterialsWarehouseInfo';
import {
  getWarehouseAAC,
  getWarehouseAluminum1,
  getWarehouseAluminum2,
  getWarehouseCement,
  getWarehouseGrindingBalls,
  getWarehouseGypsum,
  getWarehouseGypsumStone,
  getWarehouseLime,
  getWarehouseSand,
  getWarehouseSandSlurry,
} from '#components/redux/actions/warehouseRawMaterialsAction.js';
import RawMaterialsWarehouseAddSandSlurry from './RawMaterialsWarehouseAddSandSlurry';

function Warehouse() {
  const { COLUMNS_RAW_MATERIALS_WAREHOUSE, raw_materials_warehouse } =
    useWarehouseContext();
  const { roles, checkUserAccess, userAccess, setUserAccess } =
    useUsersContext();

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [modalShow, setModalShow] = useState(false);
  const [sandSlurryModal, setSandSlurryModal] = useState(false);
  const [materialType, setMaterialType] = useState('');

  const handleRowClick = useCallback((row) => {
    setMaterialType(row.original.material_type.replace(/, kg$/, '').trim());
    // setWarehouseInfoCurIdModal(row.original.id);
    // setWarehouseInfoModal(!warehouseInfoModal);
    row.original.material_type !== 'Return slurry (dry), kg' &&
      setModalShow(true);
  }, []);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Warehouse');

      if (JSON.stringify(access) !== JSON.stringify(userAccess)) {
        setUserAccess(access);
      }
    }
  }, [user, roles, checkUserAccess, userAccess, setUserAccess]);

  useEffect(() => {
    dispatch(getRawMaterialsWarehouse());
    dispatch(getWarehouseSand());
    dispatch(getWarehouseLime());
    dispatch(getWarehouseCement());
    dispatch(getWarehouseGypsum());
    dispatch(getWarehouseGypsumStone());
    dispatch(getWarehouseAluminum1());
    dispatch(getWarehouseAluminum2());
    dispatch(getWarehouseGrindingBalls());
    dispatch(getWarehouseAAC());
    dispatch(getWarehouseSandSlurry());
  }, []);

  const modifiedData = raw_materials_warehouse.map((item) => ({
    ...item,
    material_type: `${item.material_type}, kg`,
  }));

  return (
    <>
      {/* {userAccess?.canWrite && (
        <ShowProductsTypeWarehouseModal target={2} title={'related material'} />
      )} */}

      <Table
        COLUMN_DATA={COLUMNS_RAW_MATERIALS_WAREHOUSE}
        dataOfTable={modifiedData}
        userAccess={userAccess}
        tableName={'Raw Materials Warehouse'}
        handleRowClick={handleRowClick}
        onClickButton={() => {
          setSandSlurryModal(!sandSlurryModal);
        }}
        buttonText={'Add sand slurry (dry)'}
      />
      <RawMaterialsWarehouseInfo
        show={modalShow}
        onHide={() => setModalShow(false)}
        material_type={materialType}
      />
      <RawMaterialsWarehouseAddSandSlurry
        show={sandSlurryModal}
        onHide={() => setSandSlurryModal(false)}
      />
      {/* <ListOfReservedAuxilaryModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        target={2}
      /> */}
    </>
  );
}
export default Warehouse;
