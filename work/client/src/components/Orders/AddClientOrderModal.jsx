import React, { Fragment, useMemo } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useSelector } from 'react-redux';
import { useOrderContext } from '../contexts/OrderContext';
import { useNavigate } from 'react-router-dom';
import { useProjectContext } from '#components/contexts/Context.js';
import DeliveryAddress from '#components/Clients/DeliveryAddress/DeliveryAddress.js';

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

  let haveClient = useMemo(() => newOrder?.article ?? false, [newOrder?.article]);

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
  };

  const backHanddler = () => {
    setNewOrder({});
    setCurrentClient({});
  };

  const deliveryAddressHendler = (addressId) => {
    setNewOrder((prev) => ({ ...prev, del_adr_id: addressId }));
    setClientModalOrder(!clientModalOrder);
    haveClient = false;
    navigate('/addProductOrder');
  };

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
            <p>Select delivery address</p>
          ) : (
            <p>Select the client who is placing the order</p>
          )}
        </ModalHeader>
        <Fragment>
          {haveClient ? (
            <>
              <DeliveryAddress clickFunk={deliveryAddressHendler} />
            </>
          ) : (
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
                {list_of_clients?.map((entrie) => {
                  if (!entrie) return;
                  return (
                    <ModalBody>
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
                    </ModalBody>
                  );
                })}
              </tbody>
            </table>
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
