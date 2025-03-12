import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProductsTypeJournalContext = createContext();

const ProductsTypeJournalContextProvider = ({ children }) => {
  const [selectedProductsType, setSelectedProductsType] = useState(null);
  const [dataTable, setDataTable] = useState([]);

  const dryMixesJournal = useSelector((state) => state.dryMixesJournal);
  const relatedMaterialsJournal = useSelector(
    (state) => state.relatedMaterialsJournal
  );
  const anchor = useSelector((state) => state.anchor);
  const tool = useSelector((state) => state.tool);

  return (
    <ProductsTypeJournalContext.Provider
      value={{
        selectedProductsType,
        setSelectedProductsType,
        dataTable,
        setDataTable,
        dryMixesJournal,
        relatedMaterialsJournal,
        anchor,
        tool,
      }}
    >
      {children}
    </ProductsTypeJournalContext.Provider>
  );
};

export default ProductsTypeJournalContextProvider;

const useProductsTypeJournalContext = () => useContext(ProductsTypeJournalContext);
export { useProductsTypeJournalContext };
