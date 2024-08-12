import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProjectContext } from '#components/contexts/Context.js';
import { useDispatch, useSelector } from 'react-redux';

import React, { useEffect } from 'react';
import ClientsContactInfo from '#components/Clients/ClientsContactInfo/ClientsContactInfo';
import { updateContactOfOrder } from '#components/redux/actions/ordersAction.js';

function OrderContactEditModal({ show, onHide }) {
  const { setCurrentClient } = useProjectContext();
  const { orderCartData } = useOrderContext();
  const contactInfo = useSelector((state) => state.contactInfo);
  const dispatch = useDispatch();

  const contacInfoHendler = (contactId) => {
    dispatch(
      updateContactOfOrder({ contact_id: contactId, order_id: orderCartData?.id })
    );
    onHide();
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
          <ClientsContactInfo clickFunk={contacInfoHendler} />
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
