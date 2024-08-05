import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProjectContext } from '#components/contexts/Context.js';
import { useSelector } from 'react-redux';

import React, { useEffect, useState } from 'react';
import ClientsContactInfo from '#components/Clients/ClientsContactInfo/ClientsContactInfo';

function OrderContactEditModal({ show, onHide }) {
  const { currentClient, setCurrentClient, currentContact, setCurrentContact } =
    useProjectContext();
  const { orderCartData, setOrderCartData, setNewOrder } = useOrderContext();
  const contactInfo = useSelector((state) => state.contactInfo);

  const deliveryAddressHendler = (contactId) => {
    console.log('orderCartData.owner', orderCartData.owner);
    console.log('contactId', contactId);
    console.log('contactInfo', contactInfo[contactId - 1]); // тут берется объект контакта по айди, которое получается по нажатию на строку в таблице

    // ЗДЕСЬ БЕРЕТСЯ ID КОНТАКТА
  };

  useEffect(() => {
    setCurrentClient(orderCartData?.owner);
  }, [contactInfo]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="modal-auto-size"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Choose new Contact Person
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-example">
        <Container>
          <ClientsContactInfo clickFunk={deliveryAddressHendler} />
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function ShowOrderContactEditModal() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Edit
      </Button>

      <OrderContactEditModal show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}

export default ShowOrderContactEditModal;
