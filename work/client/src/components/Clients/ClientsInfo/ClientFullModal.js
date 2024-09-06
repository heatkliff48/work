import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import './styles.css';

import ClientsAddress from '../ClientsAddress/ClientsAddress';
import DeliveryAddress from '../DeliveryAddress/DeliveryAddress';
import ShowDeliveryAddressModal from '../DeliveryAddress/DeliveryAddressModal';
import ClientsContactInfo from '../ClientsContactInfo/ClientsContactInfo';
import ShowClientsContactInfoModal from '../ClientsContactInfo/ClientsContactInfoModal';
import ShowClientsEditModal from './ClientsInfoEditModal';
import { useProjectContext } from '#components/contexts/Context.js';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function MydModalWithGrid({ show, onHide }) {
  const clients = useSelector((state) => state.clients);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const {
    currentClient,
    setCurrentClient,
    roles,
    checkUserAccess,
    userAccess,
    setUserAccess,
  } = useProjectContext();

  useEffect(() => {
    if (Object.keys(currentClient)?.length === 0) {
      return;
    }
    const client = clients.filter((el) => el.id === currentClient?.id)[0];
    setCurrentClient(client);
  }, [clients]);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Clients');
      setUserAccess(access);

      if (!access.canRead) {
        navigate('/'); // Перенаправление на главную страницу, если нет прав на чтение
      }
    }
  }, [user, roles]);

  return (
    <Modal
      show={show}
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="modal-auto-size"
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Client's card</Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-example">
        <Container>
          <form className="w-full max-w-sm">
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <h3
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  for="inline-full-client"
                >
                  {currentClient?.c_name}
                </h3>
                <p>TIN:{currentClient?.tin}</p>
                <p>Category:{currentClient?.category}</p>
              </div>
            </div>
          </form>

          <Row>
            <Col xs={12} md={8}>
              <ClientsAddress />
            </Col>
            <Col xs={6} md={4}>
              {userAccess.canWrite && <ShowClientsEditModal />}
            </Col>
          </Row>

          <Row>
            {userAccess.canWrite && <ShowDeliveryAddressModal />}
            <DeliveryAddress />
          </Row>
          {userAccess.canWrite && <ShowClientsContactInfoModal />}
          <ClientsContactInfo />
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MydModalWithGrid;
