import { createContext, useContext, useState } from 'react';
import { useSelector } from 'react-redux';

const ProductContext = createContext();

const ProductContextProvider = ({ children }) => {
  const [promProduct, setPromProduct] = useState({});
  const [version, setVersion] = useState(1);
  const [modal, setModal] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const products = useSelector((state) => state.products);
  return (
    <ProductContext.Provider
      value={{
        promProduct,
        setPromProduct,
        version,
        modal,
        setModal,
        modalUpdate,
        setModalUpdate,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContextProvider;

const useProductContext = () => useContext(ProductContext);
export { useProductContext };
