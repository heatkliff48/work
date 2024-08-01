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


function MydModalWithGrid({ show, onHide }) {
  const clients = useSelector((state) => state.clients);
  const { currentClient, setCurrentClient } = useProjectContext();

  useEffect(() => {
    if (Object.keys(currentClient).length === 0){
      return
    }
    const client = clients.filter((el) => el.id === currentClient.id)[0];
    setCurrentClient(client);

    
  }, [clients]);

  return (
    <Modal
      show={show}
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="modal-auto-size"
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Client's card
        </Modal.Title>
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
            {/* <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  for="inline-tin"
                >
                  TIN:
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="inline-category"
                  type="TIN"
                  value={currentClient?.tin}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  for="inline-category"
                >
                  Category:
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="inline-category"
                  type="category"
                  value={currentClient?.category}
                />
              </div>
            </div> */}
          </form>

          <Row>
            <Col xs={12} md={8}>
              <ClientsAddress />
            </Col>
            <Col xs={6} md={4}>
              <ShowClientsEditModal />
            </Col>
          </Row>

          <Row>
            <ShowDeliveryAddressModal />
            <DeliveryAddress />
          </Row>
          <ShowClientsContactInfoModal />
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
