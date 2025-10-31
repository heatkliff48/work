import { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const ModalContextProvider = ({ children }) => {
  const [modal, setModal] = useState(false);
  const [wmoctModal, setWmoctModal] = useState(false);
  const [wmoctPdfModal, setWmoctPdfModal] = useState(false);
  const [modalRoleCard, setModalRoleCard] = useState(false);
  const [warehouseModal, setWarehouseModal] = useState(false);
  const [modalAddClient, setModalAddClient] = useState(false);
  const [modalProductCard, setModalProductCard] = useState(false);
  const [clientModalOrder, setClientModalOrder] = useState(false);
  const [productBatchModal, setProductBatchModal] = useState(false);
  const [stockBalanceModal, setStockBalanceModal] = useState(false);
  const [productModalOrder, setProductModalOrder] = useState(false);
  const [isModalWindowOpen, setIsModalWindowOpen] = useState(false);
  const [warehouseInfoModal, setWarehouseInfoModal] = useState(false);
  const [reserveProductModal, setReserveProductModal] = useState(false);
  const [previewProductModal, setPreviewProductModal] = useState(false);
  const [wmoctPdfAddDataModal, setWmoctPdfAddDataModal] = useState(false);
  const [toolProductModalOrder, setToolProductModalOrder] = useState(false);
  const [productInfoModalOrder, setProductInfoModalOrder] = useState(false);
  const [anchorProductModalOrder, setAnchorProductModalOrder] = useState(false);
  const [warehouseInfoCurIdModal, setWarehouseInfoCurIdModal] = useState(null);
  const [dryMixedProductModalOrder, setDryMixedProductModalOrder] = useState(false);
  const [rawMaterialConsumptionMadal, setRawMaterialConsumptionMadal] =
    useState(false);
  const [mainRawMaterialConsumptionMadal, setMainRawMaterialConsumptionMadal] =
    useState(false);
  const [relatedMaterialProductModalOrder, setRelatedMaterialProductModalOrder] =
    useState(false);

  return (
    <ModalContext.Provider
      value={{
        modal,
        setModal,
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
        dryMixedProductModalOrder,
        setDryMixedProductModalOrder,
        anchorProductModalOrder,
        setAnchorProductModalOrder,
        toolProductModalOrder,
        setToolProductModalOrder,
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
        productBatchModal,
        setProductBatchModal,
        stockBalanceModal,
        setStockBalanceModal,
        wmoctModal,
        setWmoctModal,
        isModalWindowOpen,
        setIsModalWindowOpen,
        previewProductModal,
        setPreviewProductModal,
        wmoctPdfModal,
        setWmoctPdfModal,
        wmoctPdfAddDataModal,
        setWmoctPdfAddDataModal,
        relatedMaterialProductModalOrder,
        setRelatedMaterialProductModalOrder,
        rawMaterialConsumptionMadal,
        setRawMaterialConsumptionMadal,
        mainRawMaterialConsumptionMadal,
        setMainRawMaterialConsumptionMadal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => useContext(ModalContext);
