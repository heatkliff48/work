import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProjectContext } from '#components/contexts/Context.js';
import { useDispatch, useSelector } from 'react-redux';

import React, { useEffect } from 'react';
import DeliveryAddress from '#components/Clients/DeliveryAddress/DeliveryAddress';
import { updateDeliveryOfOrder } from '#components/redux/actions/ordersAction.js';

function OrderDeliveryEditModal({ show, onHide }) {
  const { setCurrentClient } = useProjectContext();
  const { orderCartData } = useOrderContext();
  const deliveryAddresses = useSelector((state) => state.deliveryAddresses);
  const dispatch = useDispatch();

  const deliveryAddressHendler = (addressId) => {
    dispatch(
      updateDeliveryOfOrder({ address_id: addressId, order_id: orderCartData.id })
    );
    onHide();
  };

  useEffect(() => {
    setCurrentClient(orderCartData?.owner);
  }, [deliveryAddresses]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="modal-auto-size"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Choose new Delivery Address
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-example">
        <Container>
          <DeliveryAddress clickFunk={deliveryAddressHendler} />
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function ShowOrderDeliveryEditModal() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Edit
      </Button>

      <OrderDeliveryEditModal show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}

export default ShowOrderDeliveryEditModal;
