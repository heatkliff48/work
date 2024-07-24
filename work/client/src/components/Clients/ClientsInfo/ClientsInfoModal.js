import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useCallback, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useDispatch } from 'react-redux';
import { addNewClient, addNewLegalAddress } from '../../redux/actions/clientAction';
import './styles.css';
import { useProjectContext } from '#components/contexts/Context.js';

function ClientsModal(props) {
  const { clients_info_table, clients_legal_address_table } = useProjectContext();
  const [clientInput, setClientInput] = useState({});
  const [clientLegalAddressInput, setClientLegalAddressInput] = useState({});

  const dispatch = useDispatch();

  const handleClientInputChange = useCallback((e) => {
    setClientInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleClientLegalAddressInputChange = useCallback((e) => {
    setClientLegalAddressInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const onSubmitForm = async (e) => {
    e.preventDefault();

    dispatch(addNewClient({ client: clientInput }));
    dispatch(addNewLegalAddress({ legalAddress: clientLegalAddressInput }));
    // setModalShow(false);
    props.onHide();
    setClientInput({});
    setClientLegalAddressInput({});
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dialogClassName="modal-auto-size"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Add Client</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <form
            id="addProductModal"
            className="w-full max-w-sm"
            onSubmit={(e) => {
              onSubmitForm(e);
            }}
          >
            <h3>Client's info</h3>
            <Row>
              {clients_info_table.map((el) => (
                <Col key={el.id}>
                  <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                      <label
                        className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                        for="version"
                      >
                        {el.Header}
                      </label>
                    </div>
                    <div className="md:w-2/3">
                      <input
                        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                        id={el.accessor}
                        name={el.accessor}
                        type="text"
                        value={clientInput[el.accessor] || ''}
                        onChange={(e) => handleClientInputChange(e)}
                      />
                    </div>
                  </div>
                </Col>
              ))}
            </Row>

            <h3>Client's legal address</h3>
            {clients_legal_address_table.map((el) => (
              <div className="md:flex md:items-center mb-6" key={el.id}>
                <div className="md:w-1/3">
                  <label
                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                    for="version"
                  >
                    {el.Header}
                  </label>
                </div>
                <div className="md:w-2/3" key={el.id}>
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    id={el.accessor}
                    name={el.accessor}
                    type="text"
                    value={clientLegalAddressInput[el.accessor] || ''}
                    onChange={(e) => handleClientLegalAddressInputChange(e)}
                  />
                </div>
              </div>
            ))}
          </form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <button form="addProductModal">Add Client</button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function ShowClientsModal() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Button
        variant="primary"
        onClick={() => {
          setModalShow(true);
        }}
      >
        Add Client
      </Button>

      <ClientsModal show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}

export default ShowClientsModal;
