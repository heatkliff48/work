import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DropdownFilter, TextSearchFilter } from '#components/Table/filters.js';

const ProjectContext = createContext();

const ProjectContextProvider = ({ children }) => {
  const displayNames = {
    product_article: 'Product article',
    quantity_m2: 'Quantity, m2',
    quantity_palet: 'Quantity of palet',
    quantity_real: 'Real quantity',
    price_m2: 'Price, m2',
    discount: 'Discount, %',
    final_price: 'Final price',
    c_name: 'Name of owner',
    tin: 'TIN',
    category: 'Category',
    street: 'Street',
    additional_info: 'Additional info',
    city: 'City',
    zip_code: 'Zip code',
    province: 'Province',
    country: 'Country',
    phone_number: 'Phone number',
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
      Header: 'TIN',
      accessor: 'tin',
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
      Header: 'Phone number',
      accessor: 'phone_number',
    },
    {
      Header: 'Email',
      accessor: 'email',
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

  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const [promProduct, setPromProduct] = useState(null);
  const [productCardData, setProductCardData] = useState({});
  const [version, setVersion] = useState(1);
  const [roleId, setRoleId] = useState(0);
  const [currentClientID, setClientID] = useState(1);
  const [stayDefault, setStayDefault] = useState(true);
  const isCheckedAuth = useRef(false);
  const [clientsDataList, setClientsDataList] = useState([]);
  const [currentClient, setCurrentClient] = useState({});
  const [currentDelivery, setCurrentDelivery] = useState();
  const [currentContact, setCurrentContact] = useState();
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

  useEffect(() => {
    //сделать диспатч чек юзер на нахождение юзера в бд
    if (isCheckedAuth && !user) {
      navigate('/sign-in');
    }
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        displayNames,
        promProduct,
        setPromProduct,
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
        clients_info_table,
        clients_legal_address_table,
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
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContextProvider;

const useProjectContext = () => useContext(ProjectContext);
export { useProjectContext };
