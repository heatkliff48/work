import Table from '../Table/Table';
import { TextSearchFilter } from '#components/Table/filters.js';
import Modal from 'react-bootstrap/Modal';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import { translateMaterial } from '#i18n/index.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { useNavigate } from 'react-router-dom';
import RawMaterialsWarehouseAdd from './RawMaterialsWarehouseAdd';
import RawMaterialsWarehouseSupplierInfoAdd from './RawMaterialsWarehouseSupplierInfoAdd';
import '#components/Styles/modals.css';
import FileUpload from '#components/FileUpload/RawMaterialsWarehouse/FileUpload.jsx';
import FileDownload from '#components/FileUpload/RawMaterialsWarehouse/FileDownload.jsx';
import RawMaterialsWarehouseAddSandSlurry from './RawMaterialsWarehouseAddSandSlurry';

function RawMaterialsWarehouseInfo(props) {
  const [addModalShow, setAddModalShow] = useState(false);
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [supplierInfo, setSupplierInfo] = useState(false);
  const [sandSlurryModal, setSandSlurryModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const user = useSelector((state) => state.user);

  const { roles, checkUserAccess, userAccess, setUserAccess } =
    useUsersContext();

  const navigate = useNavigate();
  const { t } = useTranslation('rawMaterialsWarehouse');
  const materialLabel = translateMaterial(t, props?.material_type);

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
        case 'Aluminum':
          return state.warehouseAluminum1;
        case 'Aluminum 2':
          return state.warehouseAluminum2;
        case 'Grinding Balls':
          return state.warehouseGrindingBalls;
        case 'AAC':
          return state.warehouseAAC;
        case 'Sand slurry (dry)':
          return state.warehouseSandSlurry;
        case 'Pallets':
          return state.warehousePallets;
        case 'Plastics':
          return state.warehousePlastics;
        case 'Sand powder (dry)':
          return state.warehouseSandPowder;
        default:
          return state.warehouseSand;
      }
    });
  };

  const raw_material_warehouse = useRawMaterialSelector(props?.material_type);

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
    (props?.material_type === 'Cement' ||
      props?.material_type === 'Aluminum' ||
      props?.material_type === 'Aluminum 2' ||
      props?.material_type === 'Lime' ||
      props?.material_type === 'Pallets' ||
      props?.material_type === 'Sand (dry)') && {
      Header: t('columns.type'),
      accessor: 'type',
      Filter: TextSearchFilter,
    },
    props?.material_type === 'Pallets' && {
      Header: t('columns.consumedPieces'),
      accessor: 'consumed_quantity',
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
    {
      Header: t('columns.quality'),
      accessor: 'quality',
      Filter: TextSearchFilter,
    },
    checkUserAccess(user, roles, 'raw_materials_warehouse_files_actions')
      ?.canRead && {
      Header: t('columns.file'),
      accessor: 'file_name',
      Cell: ({ value, row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          {value ? (
            <>
              <FileDownload
                rowData={row.original}
                material_type={props?.material_type}
                onClick={(e) => e.stopPropagation()}
              />
              {checkUserAccess(
                user,
                roles,
                'raw_materials_warehouse_files_actions',
              )?.canWrite && (
                <FileUpload
                  rowData={row.original}
                  material_type={props?.material_type}
                  onClick={(e) => e.stopPropagation()}
                  deleteCheck={true}
                />
              )}
            </>
          ) : checkUserAccess(
              user,
              roles,
              'raw_materials_warehouse_files_actions',
            )?.canWrite ? (
            <FileUpload
              rowData={row.original}
              material_type={props?.material_type}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <p>{t('noFile')}</p>
          )}
        </div>
      ),
    },
  ].filter(Boolean);

  const sand_slurry_table = [
    {
      Header: t('sandSlurry.columns.sand'),
      accessor: 'sand',
      Filter: TextSearchFilter,
    },
    {
      Header: t('sandSlurry.columns.gypsumStone'),
      accessor: 'gypsum_stone',
      Filter: TextSearchFilter,
    },
    {
      Header: t('sandSlurry.columns.water'),
      accessor: 'water',
      Filter: TextSearchFilter,
    },
    {
      Header: t('sandSlurry.columns.grindingBalls'),
      accessor: 'grinding_balls',
      Filter: TextSearchFilter,
    },
    {
      Header: t('sandSlurry.columns.aacScrap'),
      accessor: 'aac_scrap',
      Filter: TextSearchFilter,
    },
    {
      Header: t('sandSlurry.columns.residue'),
      accessor: 'portion_size',
      Filter: TextSearchFilter,
    },
    {
      Header: t('columns.date'),
      accessor: 'date',
      Filter: TextSearchFilter,
    },
    {
      Header: t('columns.file'),
      accessor: 'file_name',
      Cell: ({ value, row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          {value ? (
            <>
              <FileDownload
                rowData={row.original}
                material_type={props?.material_type}
                onClick={(e) => e.stopPropagation()}
              />
              <FileUpload
                rowData={row.original}
                material_type={props?.material_type}
                onClick={(e) => e.stopPropagation()}
                deleteCheck={true}
              />
            </>
          ) : (
            <FileUpload
              rowData={row.original}
              material_type={props?.material_type}
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      ),
    },
  ].filter(Boolean);

  // Форматирование опций для react-select
  const typeOptions = useMemo(() => {
    if (!raw_material_warehouse) return [];

    const uniqueTypes = [
      ...new Set(raw_material_warehouse.map((item) => item.type)),
    ];

    return [
      { value: '', label: t('allTypes') }, // Опция для отображения всех данных
      ...uniqueTypes.filter(Boolean).map((type) => ({
        value: type,
        label: type,
      })),
    ];
  }, [raw_material_warehouse, t]);

  // Функция для фильтрации данных
  const getFilteredData = () => {
    if (props?.material_type !== 'Aluminum' || !selectedType?.value) {
      return raw_material_warehouse;
    }
    return raw_material_warehouse.filter(
      (item) => item.type === selectedType.value,
    );
  };

  // Функция для расчета сумм
  const getQuantitiesSum = () => {
    const filteredData =
      selectedType?.value && selectedType.value !== ''
        ? raw_material_warehouse.filter(
            (item) => item.type === selectedType.value,
          )
        : raw_material_warehouse;

    const totalQuantity = filteredData.reduce(
      (sum, item) => sum + (Number(item.quantity) || 0),
      0,
    );
    const totalConsumed = filteredData.reduce(
      (sum, item) => sum + (Number(item.consumed_quantity) || 0),
      0,
    );
    const totalAvailable = totalQuantity - totalConsumed;

    return { totalQuantity, totalAvailable };
  };

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
          {props?.material_type != 'Sand slurry (dry)' &&
            props?.material_type != 'Aluminum' && (
              <Table
                COLUMN_DATA={raw_material_table}
                dataOfTable={raw_material_warehouse}
                userAccess={checkUserAccess(
                  user,
                  roles,
                  'raw_materials_warehouse_add',
                )}
                tableName={materialLabel}
                handleRowClick={handleRowClick}
                onClickButton={() => {
                  setAddModalShow(!addModalShow);
                }}
                buttonText={t('addNew', { material: materialLabel })}
              />
            )}
          {props?.material_type === 'Aluminum' && (
            <div>
              {/* Селектор с react-select */}
              <div
                style={{
                  marginBottom: '20px',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ minWidth: '250px' }}>
                  <label style={{ marginBottom: '8px', display: 'block' }}>
                    {t('filterByType')}
                  </label>
                  <Select
                    options={typeOptions}
                    // берём опцию из typeOptions, чтобы подпись «All types» менялась вместе с языком
                    value={
                      typeOptions.find(
                        (option) => option.value === selectedType?.value,
                      ) || selectedType
                    }
                    onChange={(option) => setSelectedType(option)}
                    placeholder={t('selectType')}
                    isClearable={false}
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: '38px',
                      }),
                    }}
                  />
                </div>

                {/* Отображение сумм */}
                <div
                  style={{
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center',
                    paddingTop: '24px',
                  }}
                >
                  <div>
                    <strong>{t('totalQuantity')}</strong>{' '}
                    {getQuantitiesSum().totalQuantity}
                  </div>
                  <div>
                    <strong>{t('totalAvailable')}</strong>{' '}
                    {getQuantitiesSum().totalAvailable}
                  </div>
                </div>
              </div>

              {/* Таблица с отфильтрованными данными */}
              <Table
                COLUMN_DATA={raw_material_table}
                dataOfTable={getFilteredData()}
                userAccess={checkUserAccess(
                  user,
                  roles,
                  'raw_materials_warehouse_add',
                )}
                tableName={materialLabel}
                handleRowClick={handleRowClick}
                onClickButton={() => {
                  setAddModalShow(!addModalShow);
                }}
                buttonText={t('addNew', { material: materialLabel })}
              />
            </div>
          )}
          {props?.material_type === 'Sand slurry (dry)' && (
            <Table
              COLUMN_DATA={sand_slurry_table}
              dataOfTable={raw_material_warehouse}
              userAccess={checkUserAccess(
                user,
                roles,
                'raw_materials_warehouse_add_sand_slurry',
              )}
              tableName={materialLabel}
              handleRowClick={handleRowClick}
              onClickButton={() => {
                setSandSlurryModal(!sandSlurryModal);
              }}
              buttonText={t('sandSlurry.addButton')}
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
      <RawMaterialsWarehouseAddSandSlurry
        show={sandSlurryModal}
        onHide={() => setSandSlurryModal(false)}
      />
    </>
  );
}

export default RawMaterialsWarehouseInfo;
