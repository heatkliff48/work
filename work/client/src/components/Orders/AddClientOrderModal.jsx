import React, { Fragment, useMemo } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { useSelector } from 'react-redux';
import { useOrderContext } from '../contexts/OrderContext';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useProjectContext } from '#components/contexts/Context.js';
import DeliveryAddress from '#components/Clients/DeliveryAddress/DeliveryAddress.js';

const AddClientOrderModal = React.memo(({ isOpen, toggle }) => {
  const {
    clientModalOrder,
    setClientModalOrder,
    newOrder,
    setNewOrder,
    status_table,
  } = useOrderContext();
  const { setCurrentClient } = useProjectContext();

  const navigate = useNavigate();
  const list_of_clients = useSelector((state) => state.clients);

  let haveClient = useMemo(() => newOrder?.article ?? false, [newOrder?.article]);

  const getOrderArticle = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const uuid = uuidv4();
    const orderArticle = `Z0000${year}${month}${uuid}`;
    return orderArticle;
  };

  const addClientOrderHendler = async (e, owner_id) => {
    e.preventDefault();
    const article = getOrderArticle();

    setNewOrder({
      article,
      owner: owner_id,
      // del_adr_id, //добавить логику добавления адреса
      status: status_table.NotReady,
    });
    setCurrentClient(owner_id);
  };

  const deliveryAddressHendler = (addressId) => {
    setNewOrder((prev) => ({ ...prev, del_adr_id: addressId }));
    setClientModalOrder(!clientModalOrder);
    haveClient = false;
    navigate('/addProductOrder');
  };

  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>
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
                  <th>c_name</th>
                  <th>tin</th>
                  <th>category</th>
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
                          addClientOrderHendler(e, entrie.id);
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
      </Modal>
    </div>
  );
});
export default AddClientOrderModal;
