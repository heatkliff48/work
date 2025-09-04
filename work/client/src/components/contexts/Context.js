import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DropdownFilter, TextSearchFilter } from '#components/Table/filters.js';

const ProjectContext = createContext();

const ProjectContextProvider = ({ children }) => {
  const displayNames = {
    product_article: 'Order number',
    project_name: 'Project name',
    quantity_m2: 'Quantity, m2',
    quantity_ud: 'Quantity, Ud',
    quantity_palet: 'Quantity of pallets',
    quantity_real: 'Real quantity, m2',
    quantity_real_ud: 'Real quantity, Ud',
    price_m2: 'Price, EURO per m2',
    discount: 'Discount, %',
    final_price: 'Final price, EURO',
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
    },
    {
      Header: 'CIF/VAT',
      accessor: 'cif_vat',
    },
    {
      Header: 'Category',
      accessor: 'category',
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
      Header: 'Delivery due date',
      accessor: 'production_date',
    },
    {
      Header: 'Order products',
      accessor: 'orders_products',
    },
  ];

  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

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

  const [currentClient, setCurrentClient] = useState({});
  const [clientsDataList, setClientsDataList] = useState([]);
  const [productCardData, setProductCardData] = useState({});
  const [currentUsersInfo, setCurrentUsersInfo] = useState({});
  const [usersInfoDataList, setUsersInfoDataList] = useState([]);
  const [productionBatchLogData, setProductionBatchLogData] = useState([]);

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
    '/products_type_journal': 'Products catalog',
    '/statistics': 'Statistics',
    '/orders': 'Orders',
    '/order_card': 'Order cart',
    '/accounting': 'Accounting',
    '/warehouse_products_type': 'Warehouse',
    '/warehouse_HCCA_blocks': 'HCCA Blocks Warehouse',
    '/warehouse_dry_mixes': 'Dry Mixes Warehouse',
    '/warehouse_related_materials': 'Related Materials Warehouse',
    '/warehouse_anchors': 'Fasteners Warehouse',
    '/warehouse_tools': 'Tools Warehouse',
    '/production_batch_designer': 'Batch planner',
    '/list_of_ordered_production': 'Ordered blocks pipeline',
    '/list_of_ordered_production_oem': 'Ordered OEM blocks pipeline',
    '/related_materials_backorder_list': 'Related materials backorder list',
    '/batch_outside': 'Batch calendar',
    '/recipe_products': 'Recipes catalog',
    '/raw_materials_plan': 'Batch recipe planner',
    '/recipe_orders': 'Raw material calendar',
    '/quality_management': 'Quality Management',
    '/autoclave_calendar': 'Autoclave calendar',
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

  return (
    <ProjectContext.Provider
      value={{
        WAREHOUSE_MANAGER_TABLE,
        user,
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
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContextProvider;

const useProjectContext = () => useContext(ProjectContext);
export { useProjectContext };
