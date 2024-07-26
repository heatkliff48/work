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

const ProjectContext = createContext();

const ProjectContextProvider = ({ children }) => {
  const COLUMNS = [
    {
      Header: 'Id',
      accessor: 'id',
      sortType: 'number',
    },
    {
      Header: 'Article',
      accessor: 'article',
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
      sortType: 'number',
    },
    {
      Header: 'Form',
      accessor: 'form',
      defaultValue: 'Normal',
      sortType: 'string',
    },
    {
      Header: 'Certificate',
      accessor: 'certificate',
      defaultValue: 'CE',
      sortType: 'string',
    },
    {
      Header: 'Width, mm',
      accessor: 'width',
      defaultValue: 200,
      sortType: 'number',
    },
    {
      Header: 'Lengths, mm',
      accessor: 'lengths',
      defaultValue: 600,
      sortType: 'number',
    },
    {
      Header: 'Height, mm',
      accessor: 'height',
      defaultValue: 250,
      sortType: 'number',
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
      sortType: 'number',
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
      sortType: 'number',
    },
  ];

  const clients_info_table = [
    {
      Header: 'Client`s Name',
      accessor: 'c_name',
    },
    {
      Header: 'TIN',
      accessor: 'tin',
    },
    {
      Header: 'Category',
      accessor: 'category',
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
  const [currentClient, setCurrentClient] = useState({});


  const roleTable = [
    { id: 1, role_name: 'Production Manager' },
    { id: 2, role_name: 'Head of Sales Department' },
  ];

  const latestProducts = useMemo(() => {
    const newProducts = products?.reduce((acc, product) => {
      const { article, version } = product;
      const existingProduct = acc.find((p) => p.article === article);
      if (!existingProduct) {
        acc.push(product);
      } else if (version > existingProduct.version) {
        acc = acc.map((p) => (p.article === article ? product : p));
      }

      return acc;
    }, []);

    return newProducts;
  }, [products]);

  latestProducts?.sort((a, b) => a.id - b.id);

  const checkUserAccess = (user, roles, pageName) => {
    const userRole = roles.find((role) => role.id == user.role);

    // if (!userRole || !userRole.isActive) {
    //   return { canRead: false, canWrite: false };
    // }

    const pagePermissions = userRole?.PageAndRolesArray.find(
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
  }, [user, modalRoleCard]);

  useEffect(() => {
    //сделать диспатч чек юзер на нахождение юзера в бд
    // dispatch(checkUser());

    if (isCheckedAuth && !user) {
      console.log('MAIN APP', user);
      navigate('/sign-in');
    }
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        COLUMNS,
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
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContextProvider;

const useProjectContext = () => useContext(ProjectContext);
export { useProjectContext };
