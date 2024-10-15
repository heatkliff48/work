import { createContext, useContext, useState, useMemo } from 'react';

const ModalContext = createContext();

export const ModalContextProvider = ({ children }) => {
  const [modal, setModal] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalRoleCard, setModalRoleCard] = useState(false);
  const [modalAddClient, setModalAddClient] = useState(false);
  const [modalProductCard, setModalProductCard] = useState(false);
  const [clientModalOrder, setClientModalOrder] = useState(false);
  const [productModalOrder, setProductModalOrder] = useState(false);
  const [productInfoModalOrder, setProductInfoModalOrder] = useState(false);
  const [warehouseModal, setWarehouseModal] = useState(false);
  const [reserveProductModal, setReserveProductModal] = useState(false);
  const [warehouseInfoModal, setWarehouseInfoModal] = useState(false);
  const [warehouseInfoCurIdModal, setWarehouseInfoCurIdModal] = useState(null);

  return (
    <ModalContext.Provider
      value={{
        modal,
        setModal,
        modalUpdate,
        setModalUpdate,
        modalRoleCard,
        setModalRoleCard,
        modalAddClient,
        setModalAddClient,
        modalProductCard,
        setModalProductCard,
        clientModalOrder,
        setClientModalOrder,
        productModalOrder,
        setProductModalOrder,
        productInfoModalOrder,
        setProductInfoModalOrder,
        warehouseModal,
        setWarehouseModal,
        reserveProductModal,
        setReserveProductModal,
        warehouseInfoModal,
        setWarehouseInfoModal,
        warehouseInfoCurIdModal,
        setWarehouseInfoCurIdModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => useContext(ModalContext);
