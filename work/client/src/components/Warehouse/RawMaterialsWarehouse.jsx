import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/Form';
import Table from '../Table/Table';
import { materialUnitKey, translateMaterial } from '#i18n/index.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import {
  getRawMaterialsWarehouse,
  updateRawMaterialsWarehouseVisibility,
} from '#components/redux/actions/warehouseAction.js';
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
  getWarehousePallets,
  getWarehousePlastics,
  getWarehouseReleaseOil,
  getWarehouseSand,
  getWarehouseSandPowder,
  getWarehouseSandSlurry,
} from '#components/redux/actions/warehouseRawMaterialsAction.js';

const COLUMN_TITLE_KEYS = {
  material_type: 'columns.materialType',
  remaining_quantity: 'columns.remainingQuantity',
  last_updated: 'columns.lastUpdated',
};

function Warehouse() {
  const { COLUMNS_RAW_MATERIALS_WAREHOUSE, raw_materials_warehouse } =
    useWarehouseContext();
  const { roles, checkUserAccess, userAccess, setUserAccess } =
    useUsersContext();
  const { t } = useTranslation('rawMaterialsWarehouse');

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [modalShow, setModalShow] = useState(false);
  const [materialType, setMaterialType] = useState('');
  const [visibilityEditMode, setVisibilityEditMode] = useState(false);
  const isAdmin = user?.role === 3;

  const columns = useMemo(() => {
    const baseColumns = COLUMNS_RAW_MATERIALS_WAREHOUSE.map((col) => ({
      ...col,
      Header: COLUMN_TITLE_KEYS[col.accessor]
        ? t(COLUMN_TITLE_KEYS[col.accessor])
        : col.Header,
    }));

    if (!visibilityEditMode) return baseColumns;

    return [
      ...baseColumns,
      {
        Header: t('columns.visible'),
        accessor: 'visible',
        id: 'visible',
        disableSortBy: true,
        disableFilters: true,
        Cell: ({ row }) => (
          <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Form.Check
              type="switch"
              checked={row.original.visible !== false}
              aria-label={t('columns.visible')}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                e.stopPropagation();
                dispatch(
                  updateRawMaterialsWarehouseVisibility({
                    id: row.original.id,
                    visible: e.target.checked,
                  }),
                );
              }}
            />
          </div>
        ),
      },
    ];
  }, [COLUMNS_RAW_MATERIALS_WAREHOUSE, t, visibilityEditMode, dispatch]);

  const handleRowClick = useCallback((row) => {
    // material_key — исходное (английское) название, material_type — переведённое для отображения
    setMaterialType(row.original.material_key);
    // setWarehouseInfoCurIdModal(row.original.id);
    // setWarehouseInfoModal(!warehouseInfoModal);
    row.original.material_key !== 'Return slurry (dry)' && setModalShow(true);
    const access = checkUserAccess(user, roles, 'raw_materials_warehouse_add');
    console.log(access);
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
    if (!isAdmin && visibilityEditMode) {
      setVisibilityEditMode(false);
    }
  }, [isAdmin, visibilityEditMode]);

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
    dispatch(getWarehousePallets());
    dispatch(getWarehousePlastics());
    dispatch(getWarehouseSandPowder());
    dispatch(getWarehouseReleaseOil());
  }, []);

  const modifiedData = useMemo(() => {
    const source = Array.isArray(raw_materials_warehouse)
      ? raw_materials_warehouse
      : [];
    const rows = visibilityEditMode
      ? source
      : source.filter((item) => item.visible !== false);

    return rows.map((item) => ({
      ...item,
      material_key: item.material_type,
      material_type: `${translateMaterial(t, item.material_type)}, ${t(
        materialUnitKey(item.material_type),
        { ns: 'common' },
      )}`,
    }));
  }, [raw_materials_warehouse, visibilityEditMode, t]);

  return (
    <>
      {/* {userAccess?.canWrite && (
        <ShowProductsTypeWarehouseModal target={2} title={'related material'} />
      )} */}

      {isAdmin && (
        <div>
          <button
            type="button"
            className="table_button"
            onClick={() => setVisibilityEditMode((on) => !on)}
          >
            {visibilityEditMode ? t('doneVisibility') : t('editVisibility')}
          </button>
        </div>
      )}

      <Table
        COLUMN_DATA={columns}
        dataOfTable={modifiedData}
        userAccess={userAccess}
        tableName={t('title')}
        handleRowClick={handleRowClick}
      />
      <RawMaterialsWarehouseInfo
        show={modalShow}
        onHide={() => setModalShow(false)}
        material_type={materialType}
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
