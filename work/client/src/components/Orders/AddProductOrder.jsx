import { useDispatch } from 'react-redux';
import { useOrderContext } from '../contexts/OrderContext';
import Table from '../Table/Table';
import AddProductOrderModal from './AddProductOrderModal';
import {
  addNewOrder,
  getUpdateProductOfOrders,
} from '#components/redux/actions/ordersAction.js';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddProductOrder() {
  const {
    COLUMNS_ORDER_PRODUCT,
    productListOrder = [],
    productModalOrder,
    setProductModalOrder,
    setProductOfOrder,
    newOrder,
    setNewOrder,
    list_of_orders,
  } = useOrderContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addOrder = async () => {
    const haveOrderClient = list_of_orders.find(
      (el) => el.article === newOrder.article
    );
    haveOrderClient
      ? dispatch(
          getUpdateProductOfOrders({
            newProductsOfOrder: {
              order_id: haveOrderClient.id,
              ...newOrder,
            },
          })
        )
      : dispatch(addNewOrder(newOrder));
    navigate('/orders');
  };

  useEffect(() => {
    if (!newOrder?.article) navigate('/orders');
    if (productListOrder.length === 0) return;
    setNewOrder((prev) => ({ ...prev, productList: productListOrder }));

    setProductOfOrder({});
  }, [productListOrder]);

  return (
    <>
      <AddProductOrderModal
        isOpen={productModalOrder}
        toggle={() => setProductModalOrder(!productModalOrder)}
      />
      <Table
        COLUMN_DATA={COLUMNS_ORDER_PRODUCT}
        dataOfTable={productListOrder}
        // userAccess={userAccess}
        onClickButton={() => {
          setProductModalOrder(!productModalOrder);
        }}
        buttonText={'Add product'}
        tableName={`Adding products to an order`}
        handleRowClick={(row) => {}}
      />
      <button
        onClick={() => {
          addOrder();
        }}
      >
        Finish Order
      </button>
    </>
  );
}
export default AddProductOrder;
