import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { useProjectContext } from '#components/contexts/Context.js';
import { useEffect } from 'react';
import {
  addNewOrder,
  addOrderRandomProducts,
  getCurrentProductsOfOrders,
  getOrders,
} from '#components/redux/actions/ordersAction.js';
import { useNavigate } from 'react-router-dom';

function RandomAhhOrder(props) {
  const {
    newOrder,
    setNewOrder,
    status_list,
    list_of_orders,
    isOrderReady,
    setIsOrderReady,
    getCurrentOrderInfoHandler,
    ordersDataList,
    randomOrderCheck,
    setRandomOrderCheck,
  } = useOrderContext();
  const { setCurrentClient } = useProjectContext();
  const list_of_clients = useSelector((state) => state.clients);
  const deliveryAddresses = useSelector((state) => state.deliveryAddresses);
  const contactInfo = useSelector((state) => state.contactInfo);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const makeRandomOrder = () => {
    const article = getOrderArticle();
    const randomClient = getRandomClientData(list_of_clients);
    const deliveryAddress = deliveryAddresses.filter(
      (el) => el.client_id === randomClient?.id
    );
    const randomDelivery = getRandomClientData(deliveryAddress);
    const filteredContacts = contactInfo.filter(
      (el) => el.client_id === randomClient?.id
    );
    const randomContact = getRandomClientData(filteredContacts);

    setNewOrder({
      article,
      owner: randomClient?.id,
      del_adr_id: randomDelivery?.id,
      contact_id: randomContact?.id,
      status: status_list[0].accessor,
      person_in_charge: 0,
    });

    setRandomOrderCheck(true);
  };

  const getRandomClientData = (clients) => {
    if (!clients || clients.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * clients.length);
    return clients[randomIndex];
  };

  const getOrderArticle = () => {
    let versionNumber = '0001';
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const day = new Date().getDate().toString().padStart(2, '0');

    const currentDate = `${day}${month}${year}`;

    const ordersWithSameDate = list_of_orders.filter((order) =>
      order.article?.includes(currentDate)
    );

    if (ordersWithSameDate.length > 0) {
      const lastNumbers = ordersWithSameDate.map((order) => {
        const match = order.article.match(/(\d{8})$/);
        return match ? parseInt(match[1], 10) : 0;
      });

      const maxNumber = Math.max(...lastNumbers);

      versionNumber = `0000000${maxNumber + 1}`.slice(-8);
    } else {
      versionNumber = `00000001`;
    }

    const orderArticle = `Z0000${currentDate}${versionNumber}`;

    return orderArticle;
  };

  useEffect(() => {
    if (newOrder?.contact_id && newOrder?.del_adr_id && randomOrderCheck) {
      setIsOrderReady(true);
      dispatch(addNewOrder(newOrder));
    } else {
      setIsOrderReady(false);
    }
  }, [newOrder?.contact_id, newOrder?.del_adr_id, randomOrderCheck]);

  useEffect(() => {
    if (isOrderReady && randomOrderCheck) {
      getCurrentOrderInfoHandler(ordersDataList[ordersDataList.length - 1]);
      dispatch(
        getCurrentProductsOfOrders(ordersDataList[ordersDataList.length - 1].id)
      );
      dispatch(
        addOrderRandomProducts({
          order_id: ordersDataList[ordersDataList.length - 1].id,
          order_article: ordersDataList[ordersDataList.length - 1].article,
        })
      );
      // navigate('/order_card');
      setRandomOrderCheck(false);
      setIsOrderReady(false);
      setNewOrder({});
    }
  }, [ordersDataList, randomOrderCheck]);

  return (
    <>
      <Button variant="primary" onClick={makeRandomOrder}>
        Create random order
      </Button>
    </>
  );
}

export default RandomAhhOrder;
