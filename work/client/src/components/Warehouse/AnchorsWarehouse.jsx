import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Table from "../Table/Table";
import { useWarehouseContext } from "#components/contexts/WarehouseContext.js";
import { useUsersContext } from "#components/contexts/UserContext.js";
import ShowProductsTypeWarehouseModal from "./Modal/ProductsTypeWarehouseModal";
import ListOfReservedAuxilaryModal from "./ListOfReservedProducts/ListOfReservedAuxilaryModal";
import { useModalContext } from "#components/contexts/ModalContext.js";

function Warehouse() {
  const { COLUMNS_WAREHOUSE_AUX, anchors_warehouse_data } =
    useWarehouseContext();
  const { roles, checkUserAccess, userAccess, setUserAccess } =
    useUsersContext();
  const { setWarehouseInfoCurIdModal } = useModalContext();

  const user = useSelector((state) => state.user);

  const [modalShow, setModalShow] = useState(false);

  const handleRowClick = useCallback((row) => {
    setWarehouseInfoCurIdModal(row.original.id);
    // setWarehouseInfoModal(!warehouseInfoModal);
    setModalShow(true);
  }, []);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, "Warehouse");

      if (JSON.stringify(access) !== JSON.stringify(userAccess)) {
        setUserAccess(access);
      }
    }
  }, [user, roles, checkUserAccess, userAccess, setUserAccess]);

  return (
    <>
      {userAccess?.canWrite && (
        <ShowProductsTypeWarehouseModal target={3} title={"fastener"} />
      )}

      <Table
        COLUMN_DATA={COLUMNS_WAREHOUSE_AUX}
        dataOfTable={anchors_warehouse_data}
        userAccess={userAccess}
        tableName={"Fasteners Warehouse"}
        handleRowClick={handleRowClick}
      />
      <ListOfReservedAuxilaryModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        target={3}
      />
    </>
  );
}
export default Warehouse;
