import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DropdownFilter, TextSearchFilter } from '#components/Table/filters.js';
import {
  ClientNameCell,
  MonoCell,
  CategoryPillCell,
} from '#components/Clients/ClientsInfo/clientsCells.jsx';

const ProjectContext = createContext();

const ProjectContextProvider = ({ children }) => {
  const displayNames = {
    product_article: 'Ref.',
    description: 'Description',
    price_category: 'Price category',
    project_name: 'Project name',
    quantity_m2: 'Quantity, m2',
    quantity_ud: 'Quantity, Ud',
    quantity_palet: 'Quantity of pallets',
    quantity_real: 'Real quantity, m2',
    quantity_real_ud: 'Real quantity, Ud',
    price_m2: 'Price, EURO per m2',
    price_m3: 'Price, EURO per m3',
    price_m2_with_delivery: 'Price with delivery, EURO per m2',
    discount: 'Discount, %',
    final_price: 'Final price, EURO',
    quantity_liberated: 'Quantity liberar',
    total: 'Total, kg',
    pvp: 'PVP',
    dry_mixed_id: 'Dry mixed product id',
    quantity_palet_dry: 'Quantity of pallets',
    anchor_id: 'Anchor product id',
    quantity_palet_anchor: 'Quantity of pallets',
    tool_id: 'Tool product id',
    rel_mat_id: 'Related material product id',
    c_name: 'Name of owner',
    cif_vat: 'CIF/VAT',
    category: 'Category',
    street: 'Street',
    additional_info: 'Additional info',
    city: 'City',
    zip_code: 'Zip code',
    province: 'Province',
    country: 'Country',
    phone_office: 'Phone (office)',
    fax: 'Fax',
    phone_mobile: 'Phone Mobile',
    web_link: 'Web link',
    email: 'E-mail',
    first_name: 'First name',
    last_name: 'Last name',
    address: 'Address',
    formal_position: 'Formal position',
    role_in_the_org: 'Role',
    phone_number_office: 'Phone number office',
    phone_number_mobile: 'Phone number mobile',
    phone_number_messenger: 'Phone number messenger',
    linkedin: 'Linkedin',
    social: 'Social',
  };

  const clients_info_table = [
    {
      Header: 'Client`s Name',
      accessor: 'c_name',
      Filter: TextSearchFilter,
      Cell: ClientNameCell,
    },
    {
      Header: 'CIF/VAT',
      accessor: 'cif_vat',
      Cell: MonoCell,
    },
    {
      Header: 'Category',
      accessor: 'category',
      Filter: DropdownFilter,
      Cell: CategoryPillCell,
    },
    {
      Header: 'Price category',
      accessor: 'price_category',
      Filter: DropdownFilter,
    },
  ];

  const clients_legal_address_table = [
    {
      Header: 'Street',
      accessor: 'street',
    },
    {
      Header: 'Additional info',
      accessor: 'additional_info',
    },
    {
      Header: 'City',
      accessor: 'city',
    },
    {
      Header: 'ZIP code',
      accessor: 'zip_code',
    },
    {
      Header: 'Province',
      accessor: 'province',
    },
    {
      Header: 'Country',
      accessor: 'country',
    },
    {
      Header: 'Phone (office)',
      accessor: 'phone_office',
    },
    {
      Header: 'Fax',
      accessor: 'fax',
    },
    {
      Header: 'Phone mobile',
      accessor: 'phone_mobile',
    },
    {
      Header: 'Web link',
      accessor: 'web_link',
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
  ];

  const clients_delivery_addresses_table = [
    {
      Header: 'Project name',
      accessor: 'project_name',
    },
    {
      Header: 'Street',
      accessor: 'street',
    },
    {
      Header: 'Additional info',
      accessor: 'additional_info',
    },
    {
      Header: 'City',
      accessor: 'city',
    },
    {
      Header: 'ZIP code',
      accessor: 'zip_code',
    },
    {
      Header: 'Province',
      accessor: 'province',
    },
    {
      Header: 'Country',
      accessor: 'country',
    },
    {
      Header: 'Phone number',
      accessor: 'phone_number',
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
  ];

  const clients_contact_information_table = [
    {
      Header: 'First name',
      accessor: 'first_name',
    },
    {
      Header: 'Last name',
      accessor: 'last_name',
    },
    {
      Header: 'Preffered name',
      accessor: 'preffered_name',
    },
    {
      Header: 'Address',
      accessor: 'address',
    },
    {
      Header: 'Formal position',
      accessor: 'formal_position',
    },
    {
      Header: 'Role in the organization',
      accessor: 'role_in_the_org',
    },
    {
      Header: 'Phone number - office',
      accessor: 'phone_number_office',
    },
    {
      Header: 'Phone number - mobile',
      accessor: 'phone_number_mobile',
    },
    {
      Header: 'Phone number - messenger',
      accessor: 'phone_number_messenger',
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Linkedin',
      accessor: 'linkedin',
    },
    {
      Header: 'Social',
      accessor: 'social',
    },
  ];

  const categoryOptions = [
    { value: 'constructor_de_gobieno', label: 'Constructor de gobieno' },
    { value: 'promotor', label: 'Promotor' },
    { value: 'constructor', label: 'Constructor' },
    { value: 'arquitecto', label: 'Arquitecto' },
    { value: 'distributor_con_almacen', label: 'Distributor con almacen' },
    { value: 'distributor_sin_almacen', label: 'Distributor sin almacen' },
    { value: 'tienda_de_la_construccion', label: 'Tienda de la construccion' },
    { value: 'equipos_de_construccion', label: 'Equipos de construccion' },
    { value: 'agente', label: 'Agente' },
    { value: 'cliente_privado', label: 'Cliente privado' },
  ];

  const priceCategoryOptions = [
    {
      value: 'promotor_constructor_de_gobierno',
      label: 'Promotor/Constructor de gobierno',
    },
    { value: 'promotor', label: 'Promotor' },
    { value: 'constructor', label: 'Constructor' },
    { value: 'arquitecto', label: 'Arquitecto' },
    { value: 'distribuidor_con_almacen', label: 'Distribuidor con almacen' },
    { value: 'distribuidor_sin_almacen', label: 'Distribuidor sin almacen' },
    { value: 'tienda_de_la_construccion', label: 'Tienda de la construcción' },
    { value: 'equipo_de_construction', label: 'Equipo de construction' },
    { value: 'agente', label: 'Agente' },
    { value: 'cliente_privado', label: 'Сliente privado' },
    { value: 'constructor_pequeno', label: 'Constructor pequeño' },
    { value: 'almacenista_pequeno', label: 'Almacenista pequeno' },
    {
      value: 'distribuidor_en_nuestra_lista',
      label: 'Distribuidor en nuestra lista',
    },
    {
      value: 'arquitecto_en_nuestra_lista',
      label: 'Arquitecto en nuestra lista',
    },
  ];

  const roleOptions = [
    { value: 1, label: 'Production Manager' },
    { value: 2, label: 'Head of Sales Department' },
    { value: 3, label: 'System administrator' },
    { value: 4, label: 'Chief technologist' },
    { value: 5, label: 'Mill operators' },
    { value: 6, label: 'Casting operators' },
    { value: 7, label: 'Cutting operators' },
    { value: 8, label: 'Green array operators' },
    { value: 9, label: 'Autoclave operators' },
    { value: 10, label: 'White array operators' },
    { value: 11, label: 'Packaging operators' },
    { value: 12, label: 'Quality manager' },
    { value: 13, label: 'Production director' },
    { value: 14, label: 'Mechanical-electrical technicians' },
    { value: 15, label: 'Forklift drivers' },
    { value: 16, label: 'Sales department director' },
    { value: 17, label: 'Sales department manager' },
    { value: 18, label: 'Warehouse department director' },
    { value: 19, label: 'Warehouse department manager' },
    { value: 20, label: 'Accountant' },
  ];

  const roleMap = Object.fromEntries(
    roleOptions.map((role) => [role.value, role.label]),
  );

  const users_info_table = [
    {
      Header: 'E-mail',
      accessor: 'email',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Full Name',
      accessor: 'fullName',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Role',
      accessor: 'role',
      Cell: ({ value }) => {
        // value - это числовое значение роли из данных
        return roleMap[value] || value; // Возвращаем название или исходное значение, если не найдено
      },
      Filter: DropdownFilter,
    },
  ];

  const users_main_info_table = [
    {
      Header: 'Username',
      accessor: 'u_username',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Email',
      accessor: 'u_email',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Password',
      accessor: 'password',
    },
    {
      Header: 'Role',
      accessor: 'role',
    },
  ];

  const users_additional_info_table = [
    {
      Header: 'Full Name',
      accessor: 'fullName',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Shift',
      accessor: 'shift',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Subdivision',
      accessor: 'subdivision',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Phone',
      accessor: 'phone',
      Filter: TextSearchFilter,
    },
  ];

  const production_batch_log = [
    {
      Header: 'Article of product',
      accessor: 'products_article',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Article of an order',
      accessor: 'orders_article',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Production date',
      accessor: 'production_date',
    },
  ];

  const WAREHOUSE_MANAGER_TABLE = [
    {
      Header: 'Order number',
      accessor: 'orders_article',
    },
    {
      Header: 'Project name',
      accessor: 'projects_name',
    },
    {
      Header: 'Delivery date',
      accessor: 'production_date',
    },
    {
      Header: 'Order products',
      accessor: 'orders_products',
    },
  ];

  const WAREHOUSE_MANAGER_TRAILER_TABLE = [
    {
      Header: 'Order number',
      accessor: 'orders_article',
    },
    {
      Header: 'Project name',
      accessor: 'projects_name',
    },
    {
      Header: 'Delivery due date',
      accessor: 'fecha',
    },
    {
      Header: 'Remaining quantity of pallets ',
      accessor: 'orders_products',
    },
  ];

  const PRODUCTION_QUALITY = [
    {
      Header: 'Batch Id',
      accessor: 'batch_id',
    },
    {
      Header: 'Production date',
      accessor: 'date',
    },
    {
      Header: 'Production type',
      accessor: 'production_type',
    },
  ];

  const DEFAULT_RAW_MATERIAL_VALUES = [
    { key: 'dosing_delay_cem_sec', value: 1 },
    { key: 'dosing_delay_lime_sec', value: 1 },
    { key: 'mixing_before_al_sec', value: 60 },
    { key: 'mixing_after_al_sec', value: 30 },
    { key: 'vibrator_speed_hz', value: 40 },
    { key: 'sand_producer', value: 'Sibelco' },
    { key: 'sand_type', value: 'SILICA 0-2 WS' },
    { key: 'gypsum_producer', value: 'Yemaconsa' },
    { key: 'lime_producer', value: 'Cala de Pachs' },
    { key: 'lime_type', value: 'CL90Q' },
    { key: 'cement_producer', value: 'Cebasa' },
    { key: 'cement_type', value: 'CEM | 52.5 R-SR3' },
    { key: 'al_paste_producer', value: 'AVL Metal Powder' },
    { key: 'al_paste_types', value: '7040-10/70WB28' },
    { key: 'al_paste_proportion', value: '100' },
    { key: 'al_paste_types_2', value: '7100-30/70WB28' },
    { key: 'al_paste_proportion_2', value: '0' },
  ];

  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const clientPriceInfo = useSelector((state) => state.contactPriceInfo);
  const production_quality = useSelector((state) => state.productionQuality);
  const dimensions_quality = useSelector((state) => state.qualityDimensions);
  const compressions_quality = useSelector((state) => state.qualityCompressions);

  const [currentContact, setCurrentContact] = useState();
  const [currentDelivery, setCurrentDelivery] = useState();
  const [previewProductData, setPreviewProductData] = useState();
  const [previewOperationName, setPreviewOperationName] = useState('');

  const [version, setVersion] = useState(1);
  const [roleId, setRoleId] = useState(0);
  const [currentClientID, setClientID] = useState(1);

  const isCheckedAuth = useRef(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isRepair, setIsRepair] = useState(false);
  const [stayDefault, setStayDefault] = useState(true);

  const [cackeFillUp, setCackeFillUp] = useState({});
  const [currentClient, setCurrentClient] = useState({});
  const [clientsDataList, setClientsDataList] = useState([]);
  const [productCardData, setProductCardData] = useState({});
  const [currentUsersInfo, setCurrentUsersInfo] = useState({});
  const [usersInfoDataList, setUsersInfoDataList] = useState([]);
  const [productionBatchLogData, setProductionBatchLogData] = useState([]);

  const resetProjectState = () => {
    setCurrentContact();
    setCurrentDelivery();
    setPreviewProductData();
    setPreviewOperationName('');
    setVersion(1);
    setRoleId(0);
    setClientID(1);
    setIsEdit(false);
    setIsRepair(false);
    setStayDefault(true);
    setCackeFillUp({});
    setCurrentClient({});
    setClientsDataList({});
    setProductCardData({});
    setCurrentUsersInfo({});
    setUsersInfoDataList({});
    setProductionBatchLogData([]);
  };

  const roleTable = [
    { id: 1, label: 'Production Manager' },
    { id: 2, label: 'Head of Sales Department' },
    { id: 3, label: 'System administrator' },
    { id: 4, label: 'Chief technologist' },
    { id: 5, label: 'Mill operators' },
    { id: 6, label: 'Casting operators' },
    { id: 7, label: 'Cutting operators' },
    { id: 8, label: 'Green array operators' },
    { id: 9, label: 'Autoclave operators' },
    { id: 10, label: 'White array operators' },
    { id: 11, label: 'Packaging operators' },
    { id: 12, label: 'Quality manager' },
    { id: 13, label: 'Production director' },
    { id: 14, label: 'Mechanical-electrical technicians' },
    { id: 15, label: 'Forklift drivers' },
    { id: 16, label: 'Sales department director' },
    { id: 17, label: 'Sales department manager' },
    { id: 18, label: 'Warehouse department director' },
    { id: 19, label: 'Warehouse department manager' },
    { id: 20, label: 'Accountant' },
  ];

  const pageTitles = {
    '/': 'Main Page',
    '/sign-in': 'Sign In',
    '/roles': 'Roles',
    '/products': 'HCCA Blocks',
    '/dry_mixes_journal': 'Dry mixes journal',
    '/related_materials_journal': 'Related materials journal',
    '/anchors': 'Fasteners',
    '/tools': 'Tools',
    '/products/edit': 'Редактирование',
    '/clients': 'Clients',
    '/users_info': 'Users Info',
    '/warehouse_manager': 'Order dispatch',
    '/factura_manager': 'Furion po farmu champion',
    '/products_type_journal': 'Products catalog',
    '/statistics': 'Statistics',
    '/orders': 'Orders',
    '/order_card': 'Order cart',
    '/orders_to_warehouse': 'Orders to warehouse',
    '/accounting': 'Accounting',
    '/warehouse_products_type': 'Warehouse',
    '/warehouse_HCCA_blocks': 'HCCA Blocks Warehouse',
    '/warehouse_dry_mixes': 'Dry Mixes Warehouse',
    '/warehouse_related_materials': 'Related Materials Warehouse',
    '/warehouse_anchors': 'Fasteners Warehouse',
    '/warehouse_tools': 'Tools Warehouse',
    '/warehouse_raw_materials': 'Raw Materials Warehouse',
    '/production_batch_designer': 'Batch planner',
    '/production_batch_designer_new': 'Batch planner',
    '/list_of_ordered_production': 'Ordered blocks pipeline',
    '/list_of_ordered_production_oem': 'Ordered OEM blocks pipeline',
    '/related_materials_backorder_list': 'Related materials backorder list',
    '/batch_outside': 'Batch calendar',
    '/recipe_products': 'Recipes catalog',
    '/raw_materials_plan': 'Batch recipe planner',
    '/recipe_orders': 'Raw material calendar',
    '/quality_management': 'Quality Management',
    '/autoclave_calendar': 'Autoclave calendar',
    '/raw_material_consumption': 'Raw materials consumption',
  };

  function getPageTitleByPath(pathname = window.location.pathname) {
    return pageTitles[pathname] || 'Страница';
  }

  const getRoleName = (roleId) => {
    return roleTable.find((el) => el.id == roleId)?.label ?? 'null';
  };

  useEffect(() => {
    //сделать диспатч чек юзер на нахождение юзера в бд
    if (isCheckedAuth && !user) {
      navigate('/sign-in');
    }
  }, []);

  const lotesListBatches = useSelector((state) => state.lotesListBatches);
  const lotesListCakes = useSelector((state) => state.lotesListCakes);

  return (
    <ProjectContext.Provider
      value={{
        WAREHOUSE_MANAGER_TABLE,
        WAREHOUSE_MANAGER_TRAILER_TABLE,
        DEFAULT_RAW_MATERIAL_VALUES,
        PRODUCTION_QUALITY,
        user,
        clientPriceInfo,
        displayNames,
        version,
        setVersion,
        currentClientID,
        setClientID,
        productCardData,
        setProductCardData,
        stayDefault,
        setStayDefault,
        roleId,
        setRoleId,
        roleTable,
        getRoleName,
        clients_info_table,
        clients_legal_address_table,
        clients_delivery_addresses_table,
        clients_contact_information_table,
        categoryOptions,
        priceCategoryOptions,
        cackeFillUp,
        setCackeFillUp,
        currentClient,
        setCurrentClient,
        currentDelivery,
        setCurrentDelivery,
        currentContact,
        setCurrentContact,
        clientsDataList,
        setClientsDataList,
        users_info_table,
        currentUsersInfo,
        setCurrentUsersInfo,
        usersInfoDataList,
        setUsersInfoDataList,
        users_main_info_table,
        users_additional_info_table,
        production_batch_log,
        productionBatchLogData,
        setProductionBatchLogData,
        isRepair,
        setIsRepair,
        isEdit,
        setIsEdit,
        previewProductData,
        setPreviewProductData,
        previewOperationName,
        setPreviewOperationName,
        getPageTitleByPath,
        lotesListBatches,
        lotesListCakes,
        production_quality,
        dimensions_quality,
        compressions_quality,
        roleMap,
        resetProjectState,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContextProvider;

const useProjectContext = () => useContext(ProjectContext);
export { useProjectContext };
