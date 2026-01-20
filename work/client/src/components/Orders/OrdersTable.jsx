import { useProjectContext } from "#components/contexts/Context.js";
import { useModalContext } from "#components/contexts/ModalContext.js";
import { useUsersContext } from "#components/contexts/UserContext.js";
import { getCurrentProductsOfOrders } from "#components/redux/actions/ordersAction.js";
import Table from "../Table/Table";
import { useOrderContext } from "../contexts/OrderContext";
import AddClientOrderModal from "./modal/AddClientOrderModal";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import RandomAhhOrder from "./RandomAhhOrder";

function OrdersTable() {
  const {
    COLUMNS_ORDERS,
    getCurrentOrderInfoHandler,
    setProductOfOrder,
    setNewOrder,
    ordersDataList,
    randomOrderCheck,
    setRandomOrderCheck,
  } = useOrderContext();
  const { clientModalOrder, setClientModalOrder } = useModalContext();
  const { setCurrentClient } = useProjectContext();
  const { roles, checkUserAccess, userAccess, setUserAccess } =
    useUsersContext();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, "Orders");
      setUserAccess(access);

      if (!access?.canRead) {
        navigate("/"); // Перенаправление на главную страницу, если нет прав на чтение
      }
    }
  }, [user, roles]);

  useEffect(() => {
    setProductOfOrder({});
    setNewOrder({});
    setCurrentClient({});
    setRandomOrderCheck(false);
  }, [clientModalOrder]);

  return (
    <>
      {clientModalOrder && (
        <AddClientOrderModal
          isOpen={clientModalOrder}
          toggle={() => setClientModalOrder(!clientModalOrder)}
        />
      )}
      {/* <RandomAhhOrder /> */}
      <Table
        COLUMN_DATA={COLUMNS_ORDERS}
        dataOfTable={ordersDataList}
        userAccess={userAccess}
        onClickButton={() => {
          setClientModalOrder(!clientModalOrder);
        }}
        buttonText={"Add new order"}
        tableName={"Orders"}
        handleRowClick={(row) => {
          console.log("row.original", row.original);
          getCurrentOrderInfoHandler(row.original);
          dispatch(getCurrentProductsOfOrders(row.original.id));
          navigate("/order_card");
        }}
      />
    </>
  );
}
export default OrdersTable;
