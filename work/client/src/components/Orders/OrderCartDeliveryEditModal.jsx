import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProjectContext } from '#components/contexts/Context.js';
import { useSelector } from 'react-redux';

import React, { useEffect, useState } from 'react';
import DeliveryAddress from '#components/Clients/DeliveryAddress/DeliveryAddress';

function OrderDeliveryEditModal({ show, onHide }) {
  const { currentClient, setCurrentClient, currentDelivery, setCurrentDelivery } =
    useProjectContext();
  const { orderCartData, setOrderCartData, setNewOrder } = useOrderContext();
  const deliveryAddresses = useSelector((state) => state.deliveryAddresses);

  const deliveryAddressHendler = (addressId) => {
    // const deliveryAdress = deliveryAddresses.filter(
    //   (el) => el.client_id === addressId
    // );
    // setOrderCartData((prev) => ({ ...prev, deliveryAddress: deliveryAdress }));
    console.log('orderCartData.owner', orderCartData.owner);
    console.log('addressId', addressId);
    console.log('deliveryAddresses', deliveryAddresses[addressId - 1]);

    // ЗДЕСЬ БЕРЕТСЯ ID АДРЕСА ДОСТАВКИ
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
