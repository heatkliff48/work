import { createContext, useContext, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

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
  const [promProduct, setPromProduct] = useState(null);
  const [productCardData, setProductCardData] = useState({});
  const [version, setVersion] = useState(1);
  const [modal, setModal] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalAddClient, setModalAddClient] = useState(false);
  const [modalProductCard, setModalProductCard] = useState(false);
  const [currentClientID, setClientID] = useState(1);
  const products = useSelector((state) => state.products);
  const [stayDefault, setStayDefault] = useState(true);

  const latestProducts = useMemo(() => {
    // console.log('MEMO CONTEXT', products);
    const newProducts = products.reduce((acc, product) => {
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

  return (
    <ProjectContext.Provider
      value={{
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
        COLUMNS,
        latestProducts,
        productCardData,
        setProductCardData,
        stayDefault,
        setStayDefault,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContextProvider;

const useProjectContext = () => useContext(ProjectContext);
export { useProjectContext };
