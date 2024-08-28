import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRoles } from '../redux/actions/rolesAction';
import { useNavigate } from 'react-router-dom';
import {
  DropdownFilter,
  TextSearchFilter,
  NumberRangeColumnFilter,
} from '#components/Table/filters.js';
import { getAllProducts } from '#components/redux/actions/productsAction.js';
import {
  getAllWarehouse,
  getListOfOrderedProduction,
  getListOfReservedProducts,
} from '#components/redux/actions/warehouseAction.js';
import { getProductsOfOrders } from '#components/redux/actions/ordersAction.js';

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

  const selectOptions = useMemo(
    () => ({
      form: [
        { value: 'normal', label: 'Normal' },
        { value: 'U-block', label: 'U-block' },
        { value: 'Lintel', label: 'Lintel' },
        { value: 'O-block', label: 'O-block' },
        { value: 'Forjado', label: 'Forjado' },
      ],
      certificate: [
        { value: 'CE', label: 'CE' },
        { value: 'DAU', label: 'DAU' },
      ],
      placeOfProduction: [
        { value: 0, label: 'Spain' },
        { value: 1, label: 'Türkiye' },
      ],
      typeOfPackaging: [
        { value: 0, label: 'Reusable' },
        { value: 1, label: 'Disposable' },
        { value: 2, label: 'Marine' },
      ],
    }),
    []
  );

  const COLUMNS = [
    {
      Header: 'Id',
      accessor: 'id',
      sortType: 'number',
    },
    {
      Header: 'Article',
      accessor: 'article',
      Filter: TextSearchFilter,
      disableSortBy: true,
    },

    {
      Header: 'Version',
      accessor: 'version',
      defaultValue: 1,
      sortType: 'number',
    },
    {
      Header: 'Density, kg/m³',
      accessor: 'density',
      defaultValue: 500,
      Filter: NumberRangeColumnFilter,
      filter: 'between',
      sortType: 'number',
      min: 80,
      max: 800,
    },
    {
      Header: 'Place of production',
      accessor: 'placeOfProduction',
      defaultValue: '0',
      Filter: DropdownFilter,
      sortType: 'string',
    },
    {
      Header: 'Type of packaging',
      accessor: 'typeOfPackaging',
      defaultValue: '0',
      Filter: DropdownFilter,
      sortType: 'string',
    },
    {
      Header: 'Form',
      accessor: 'form',
      defaultValue: 'Normal',
      Filter: DropdownFilter,
      sortType: 'string',
    },
    {
      Header: 'Certificate',
      accessor: 'certificate',
      defaultValue: 'CE',
      Filter: DropdownFilter,
      sortType: 'string',
    },
    {
      Header: 'Width, mm',
      accessor: 'width',
      defaultValue: 200,
      Filter: NumberRangeColumnFilter,
      filter: 'between',
      sortType: 'number',
      min: 50,
      max: 500,
    },
    {
      Header: 'Lengths, mm',
      accessor: 'lengths',
      defaultValue: 600,
      Filter: NumberRangeColumnFilter,
      filter: 'between',
      sortType: 'number',
      min: 400,
      max: 3000,
    },
    {
      Header: 'Height, mm',
      accessor: 'height',
      defaultValue: 250,
      Filter: NumberRangeColumnFilter,
      filter: 'between',
      sortType: 'number',
      min: 100,
      max: 1000,
    },
    {
      Header: 'Trading Mark',
      accessor: 'tradingMark',
      sortType: 'string',
    },
    {
      Header: 'M3 per pallet',
      accessor: 'm3',
    },
    {
      Header: 'M2 per pallet',
      accessor: 'm2',
    },
    {
      Header: 'Linear metre per pallet',
      accessor: 'm',
    },
    {
      Header: 'Width in the array',
      accessor: 'widthInArray',
    },
    {
      Header: 'M3 in the array',
      accessor: 'm3InArray',
    },
    {
      Header: 'Dry density max, kg/m³',
      accessor: 'densityDryMax',
    },
    {
      Header: 'Dry density default, kg/m³',
      accessor: 'densityDryDef',
    },
    {
      Header: 'Humidity, %',
      accessor: 'humidity',
      defaultValue: 30,
      Filter: NumberRangeColumnFilter,
      filter: 'between',
      sortType: 'number',
      min: 0,
      max: 100,
    },
    {
      Header: 'Density wet max, kg/m³',
      accessor: 'densityHuminityMax',
    },
    {
      Header: 'Density wet default, kg/m³',
      accessor: 'densityHuminityDef',
    },
    {
      Header: 'Product pallet weight max, kg',
      accessor: 'weightMax',
    },
    {
      Header: 'Product pallet weight default, kg',
      accessor: 'weightDef',
    },
    {
      Header: 'Norm of defect, %',
      accessor: 'normOfBrack',
      defaultValue: 2,
      Filter: NumberRangeColumnFilter,
      filter: 'between',
      sortType: 'number',
    },
    {
      Header: 'Priority for free products',
      accessor: 'coefficientOfFree',
      defaultValue: 0.5,
      sortType: 'number',
    },
    {
      Header: 'Price per m³',
      accessor: 'price',
      defaultValue: 0,
      Filter: NumberRangeColumnFilter,
      filter: 'between',
      sortType: 'number',
    },
  ];

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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [promProduct, setPromProduct] = useState(null);
  const [productCardData, setProductCardData] = useState({});
  const [version, setVersion] = useState(1);
  const [modal, setModal] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalAddClient, setModalAddClient] = useState(false);
  const [modalProductCard, setModalProductCard] = useState(false);
  const [modalRoleCard, setModalRoleCard] = useState(false);
  const [roleId, setRoleId] = useState(0);
  const [currentClientID, setClientID] = useState(1);
  const [stayDefault, setStayDefault] = useState(true);
  const [userAccess, setUserAccess] = useState({ canRead: false, canWrite: false });
  const user = useSelector((state) => state.user);
  const products = useSelector((state) => state.products);
  const roles = useSelector((state) => state.roles);
  const isCheckedAuth = useRef(false);
  const [clientsDataList, setClientsDataList] = useState([]);
  const [currentClient, setCurrentClient] = useState({});
  const [currentDelivery, setCurrentDelivery] = useState();
  const [currentContact, setCurrentContact] = useState();
  const [currentUsersInfo, setCurrentUsersInfo] = useState({});
  const [usersInfoDataList, setUsersInfoDataList] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
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

  // const latestProducts = useMemo(() => {
  //   const newProducts = products?.reduce((acc, product) => {
  //     const { article, version } = product;
  //     const existingProduct = acc.find((p) => p.article === article);
  //     if (!existingProduct) {
  //       acc.push(product);
  //     } else if (version > existingProduct.version) {
  //       acc = acc.map((p) => (p.article === article ? product : p));
  //     }

  //     return acc;
  //   }, []);

  //   return newProducts;
  // }, [products]);

  // latestProducts?.sort((a, b) => a.id - b.id);

  useEffect(() => {
    const newProductList = products?.reduce((acc, product) => {
      const { article, version } = product;
      const existingProduct = acc.find((p) => p.article === article);
      if (!existingProduct) {
        acc.push(product);
      } else if (version > existingProduct.version) {
        acc = acc.map((p) => (p.article === article ? product : p));
      }

      return acc;
    }, []);

    newProductList?.sort((a, b) => a.id - b.id);

    const newlatestProducts = newProductList.map((prod) => {
      const newPlaceOfProduction = selectOptions.placeOfProduction.find(
        (opt) => opt.value == prod.placeOfProduction
      );
      const newTypeOfPackaging = selectOptions.typeOfPackaging.find(
        (opt) => opt.value == prod.typeOfPackaging
      );

      return {
        ...prod,
        placeOfProduction: newPlaceOfProduction?.label,
        typeOfPackaging: newTypeOfPackaging?.label,
      };
    });

    setLatestProducts(newlatestProducts);
  }, [products]);

  const checkUserAccess = (user, roles, pageName) => {
    if (user.role === 3) return { canRead: true, canWrite: true };
    const userRole = roles.find((role) => role.id === user.role);

    if (!userRole || !userRole.isActive) {
      return { canRead: false, canWrite: false };
    }

    const pagePermissions = userRole?.PageAndRolesArray?.find(
      (page) => page.page_name === pageName
    );

    if (!pagePermissions) {
      return { canRead: false, canWrite: false };
    }

    return {
      canRead: pagePermissions.PageAndRoles.read,
      canWrite: pagePermissions.PageAndRoles.write,
    };
  };

  useEffect(() => {
    //сделать диспатч чек юзер на нахождение юзера в бд
    if (!user) return;
    dispatch(getAllRoles());
    dispatch(getAllProducts());
    dispatch(getAllWarehouse());
    dispatch(getProductsOfOrders());
    dispatch(getListOfReservedProducts());
    dispatch(getListOfOrderedProduction());
  }, [user, modalRoleCard]);

  useEffect(() => {
    //сделать диспатч чек юзер на нахождение юзера в бд
    // dispatch(checkUser());

    if (isCheckedAuth && !user) {
      navigate('/sign-in');
    }
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        selectOptions,
        COLUMNS,
        displayNames,
        promProduct,
        setPromProduct,
        version,
        setVersion,
        modal,
        setModal,
        modalUpdate,
        setModalUpdate,
        currentClientID,
        setClientID,
        modalAddClient,
        setModalAddClient,
        modalProductCard,
        setModalProductCard,
        latestProducts,
        productCardData,
        setProductCardData,
        stayDefault,
        setStayDefault,
        modalRoleCard,
        setModalRoleCard,
        roleId,
        setRoleId,
        roles,
        checkUserAccess,
        userAccess,
        setUserAccess,
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
