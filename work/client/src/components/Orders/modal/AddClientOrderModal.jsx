import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useOrderContext } from '../../contexts/OrderContext';
import { useProjectContext } from '#components/contexts/Context.js';
import DeliveryAddress from '#components/Clients/DeliveryAddress/DeliveryAddress.js';
import ClientsContactInfo from '#components/Clients/ClientsContactInfo/ClientsContactInfo.js';
import { addNewOrder, getOrders } from '#components/redux/actions/ordersAction.js';
import ShowClientsModal from '#components/Clients/ClientsInfo/ClientsInfoModal.js';
import ShowDeliveryAddressModal from '#components/Clients/DeliveryAddress/DeliveryAddressModal';
import ShowClientsContactInfoModal from '#components/Clients/ClientsContactInfo/ClientsContactInfoModal';
import { useModalContext } from '#components/contexts/ModalContext.js';
import Table from '#components/Table/Table';
import '#components/Styles/modals.css';

const AddClientOrderModal = React.memo(({ isOpen, toggle }) => {
  const {
    newOrder,
    setNewOrder,
    status_list,
    list_of_orders,
    getCurrentOrderInfoHandler,
    isOrderReady,
    setIsOrderReady,
  } = useOrderContext();
  const { clientModalOrder, setClientModalOrder } = useModalContext();
  const { setCurrentClient, clients_info_table } = useProjectContext();

  const dispatch = useDispatch();
  const list_of_clients = useSelector((state) => state.clients);

  const [searchFilter, setSearchFilter] = useState('');
  const [listOfClientsFiltered, setListOfClientsFiltered] =
    useState(list_of_clients);

  let haveClient = useMemo(() => newOrder?.article ?? false, [newOrder?.article]);
  let haveAdddress = useMemo(
    () => newOrder?.del_adr_id ?? false,
    [newOrder?.del_adr_id]
  );

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

  const addClientOrderHendler = async (id) => {
    console.log(list_of_clients);
    const article = getOrderArticle();
    const client = list_of_clients.find((el) => el.id === id);

    setNewOrder({
      article,
      owner: id,
      status: status_list[0].accessor,
      person_in_charge: 0,
    });
    setCurrentClient(client);
    setSearchFilter('');
  };

  const backHanddler = () => {
    setNewOrder({});
    setCurrentClient({});
  };

  const contactInfoHendler = (contactId) => {
    setNewOrder((prev) => ({ ...prev, contact_id: contactId }));
  };

  const deliveryAddressHendler = (addressId) => {
    setNewOrder((prev) => ({ ...prev, del_adr_id: addressId }));
  };

  // const filterListOfClientsHandler = (e) => {
  //   setSearchFilter(e.target.value);
  //   let filtered = list_of_clients.filter((el) =>
  //     el.c_name?.toLowerCase().includes(e.target.value.toLowerCase())
  //   );
  //   setListOfClientsFiltered(filtered);
  // };

  useEffect(() => {
    if (newOrder?.contact_id && newOrder?.del_adr_id) {
      setIsOrderReady(true);
    } else {
      setIsOrderReady(false);
    }
  }, [newOrder?.contact_id, newOrder?.del_adr_id]);

  useEffect(() => {
    if (isOrderReady) {
      dispatch(addNewOrder(newOrder));
      dispatch(getOrders());
      getCurrentOrderInfoHandler(newOrder);
      setClientModalOrder(!clientModalOrder);
      setIsOrderReady(false);
    }
  }, [isOrderReady]);

  useEffect(() => {
    let filtered = list_of_clients.filter((el) =>
      el.c_name?.toLowerCase().includes(searchFilter.toLowerCase())
    );
    setListOfClientsFiltered(filtered);
  }, [list_of_clients]);

  return (
    <div>
      <Modal
        autoWidth
        isOpen={isOpen}
        toggle={() => {
          setNewOrder({});
          setCurrentClient({});
          toggle();
        }}
      >
        <ModalHeader
          toggle={() => {
            setNewOrder({});
            setCurrentClient({});
            toggle();
          }}
        >
          {haveClient ? (
            haveAdddress ? (
              <p>Select contact person</p>
            ) : (
              <p>Select delivery address</p>
            )
          ) : (
            <p>Select the client who is placing the order</p>
          )}
        </ModalHeader>
        <Fragment>
          {haveClient ? (
            haveAdddress ? (
              <>
                <ShowClientsContactInfoModal />
                <ClientsContactInfo
                  clickFunk={contactInfoHendler}
                  showSearch={true}
                />
              </>
            ) : (
              <>
                <ShowDeliveryAddressModal />
                <DeliveryAddress
                  clickFunk={deliveryAddressHendler}
                  showSearch={true}
                />
              </>
            )
          ) : (
            <ModalBody>
              <ShowClientsModal />
              <Table
                COLUMN_DATA={clients_info_table}
                dataOfTable={listOfClientsFiltered}
                tableName={'Clients'}
                handleRowClick={(row) => {
                  addClientOrderHendler(row.original.id);
                }}
              />
            </ModalBody>
          )}
        </Fragment>
        <ModalFooter>
          {haveClient ? <button onClick={backHanddler}>back</button> : <></>}
        </ModalFooter>
      </Modal>
    </div>
  );
});
export default AddClientOrderModal;
