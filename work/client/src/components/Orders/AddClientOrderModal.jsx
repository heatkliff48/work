import React, { Fragment, useMemo, useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useSelector } from 'react-redux';
import { useOrderContext } from '../contexts/OrderContext';
import { useNavigate } from 'react-router-dom';
import { useProjectContext } from '#components/contexts/Context.js';
import DeliveryAddress from '#components/Clients/DeliveryAddress/DeliveryAddress.js';
import ClientsContactInfo from '#components/Clients/ClientsContactInfo/ClientsContactInfo.js';
import ShowClientsModal from '#components/Clients/ClientsInfo/ClientsInfoModal.js';
import ShowDeliveryAddressModal from '#components/Clients/DeliveryAddress/DeliveryAddressModal';
import ShowClientsContactInfoModal from '#components/Clients/ClientsContactInfo/ClientsContactInfoModal';

const AddClientOrderModal = React.memo(({ isOpen, toggle }) => {
  const {
    clientModalOrder,
    setClientModalOrder,
    newOrder,
    setNewOrder,
    status_table,
    list_of_orders,
  } = useOrderContext();
  const { setCurrentClient } = useProjectContext();

  const navigate = useNavigate();
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
    const day = new Date().getDate();

    const articleId = list_of_orders.length === 0 ? 1 : list_of_orders.length + 1;
    versionNumber = `0000000${articleId}`.slice(-8);

    const orderArticle = `Z0000${day}${month}${year}${versionNumber}`;
    return orderArticle;
  };

  const addClientOrderHendler = async (e, owner) => {
    e.preventDefault();
    const article = getOrderArticle();

    setNewOrder({
      article,
      owner: owner.id,
      status: status_table.NotReady,
    });
    setCurrentClient(owner);
    setSearchFilter('');
  };

  const backHanddler = () => {
    setNewOrder({});
    setCurrentClient({});
  };

  const contactInfoHendler = (contactId) => {
    setNewOrder((prev) => ({ ...prev, contact_id: contactId }));
    setClientModalOrder(!clientModalOrder);
    haveClient = false;
    haveAdddress = false;
    navigate('/addProductOrder');
  };
  const deliveryAddressHendler = (addressId) => {
    setNewOrder((prev) => ({ ...prev, del_adr_id: addressId }));
  };

  const filterListOfClientsHandler = (e) => {
    setSearchFilter(e.target.value);
    let filtered = list_of_clients.filter((el) =>
      el.c_name?.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setListOfClientsFiltered(filtered);
  };

  // const filterListOfDeliveryHandler = (e) => {
  //   setSearchFilter(e.target.value);
  //   let filtered = list_of_clients.filter((el) =>
  //     el.c_name?.toLowerCase().includes(e.target.value.toLowerCase())
  //   );
  //   setListOfClientsFiltered(filtered);
  // };

  useEffect(() => {
    let filtered = list_of_clients.filter((el) =>
      el.c_name?.toLowerCase().includes(searchFilter.toLowerCase())
    );
    setListOfClientsFiltered(filtered);
  }, [list_of_clients]);

  return (
    <div>
      <Modal
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
              <div>
                <h4>Search clients</h4>
                <input
                  value={searchFilter}
                  onChange={(e) => {
                    filterListOfClientsHandler(e);
                  }}
                />
              </div>
              <table
                className="table mt-5 table-bordered text-center table-striped table-hover"
                align="left"
              >
                <thead>
                  <tr>
                    <th key={'c_name'}>c_name</th>
                    <th key={'tin'}>tin</th>
                    <th key={'category'}>category</th>
                  </tr>
                </thead>

                <tbody>
                  {listOfClientsFiltered?.map((entrie) => {
                    if (!entrie) return;
                    return (
                      <tr
                        key={entrie.id}
                        onClick={(e) => {
                          addClientOrderHendler(e, entrie);
                        }}
                      >
                        <td>{entrie?.c_name}</td>
                        <td>{entrie?.tin}</td>
                        <td>{entrie?.category}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
