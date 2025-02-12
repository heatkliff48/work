import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useCallback, useEffect, useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import Select from 'react-select';
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
  const regexp = new RegExp(`^[0-9]*$`);
  const isValid = (value) => value !== '' && value !== '-';
  const [valid, setValid] = useState(isValid(clientLegalAddressInput.zip_code));

  const categoryOptions = [
    { value: 'constructor_de_gobieno', label: 'Constructor de gobieno' },
    { value: 'promotor', label: 'Promotor' },
    { value: 'constructor', label: 'Constructor' },
    { value: 'arquitecto', label: 'Arquitecto' },
    { value: 'distributor_con_almacen', label: 'Distributor con almacen' },
    { value: 'distributor_sin_almacen', label: 'Distributor sin almacen' },
    { value: 'tienda_de_la_construccion', label: 'Tienda de la construccion' },
    { value: 'equipos_de_construccion', label: 'Equipos de construccion' },
    { value: 'agente', label: 'Agente' },
    { value: 'cliente_privado', label: 'Cliente privado' },
  ];

  const dispatch = useDispatch();

  const handleClientInputChange = useCallback((e) => {
    setClientInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleClientPhoneInput = useCallback((phone) => {
    setClientLegalAddressInput((prev) => ({ ...prev, phone_office: phone }));
  }, []);

  const handleClientFaxInput = useCallback((phone) => {
    setClientLegalAddressInput((prev) => ({ ...prev, fax: phone }));
  }, []);

  const handleClientPhoneMobileInput = useCallback((phone) => {
    setClientLegalAddressInput((prev) => ({ ...prev, phone_mobile: phone }));
  }, []);

  const handleSelectChange = (selectedOption, key) => {
    // setValue(selectedOption.value);
    setClientInput((prev) => ({ ...prev, [key]: selectedOption.value }));
  };

  const getSelectedOption = (accessor) => {
    const options = categoryOptions;
    if (!options) return null;
    const categoryOption = options.find(
      (option) => option.value === clientInput?.[accessor]
    );
    // Если выбранная опция найдена, возвращаем ее, иначе возвращаем первую опцию по умолчанию
    return categoryOption || options[0];
  };

  const handleClientLegalAddressInputChange = useCallback((e) => {
    setClientLegalAddressInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  useEffect(() => {
    setClientInput((prev) => ({ ...prev, category: categoryOptions[0].value }));
  }, [props.show]);

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
            id="addClientModel"
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
                      {el.accessor === 'category' ? (
                        <Select
                          defaultValue={getSelectedOption(el.accessor)}
                          onChange={(v) => {
                            handleSelectChange(v, el.accessor);
                          }}
                          options={categoryOptions}
                        />
                      ) : (
                        <input
                          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                          id={el.accessor}
                          name={el.accessor}
                          type="text"
                          value={clientInput[el.accessor] || ''}
                          onChange={(e) => handleClientInputChange(e)}
                        />
                      )}
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
                  {el.accessor === 'phone_office' ? (
                    <PhoneInput
                      defaultCountry="es"
                      value={clientInput[el.accessor] || ''}
                      onChange={(phone) => handleClientPhoneInput(phone)}
                    />
                  ) : el.accessor === 'fax' ? (
                    <PhoneInput
                      defaultCountry="es"
                      value={clientInput[el.accessor] || ''}
                      onChange={(phone) => handleClientFaxInput(phone)}
                    />
                  ) : el.accessor === 'phone_mobile' ? (
                    <PhoneInput
                      defaultCountry="es"
                      value={clientInput[el.accessor] || ''}
                      onChange={(phone) => handleClientPhoneMobileInput(phone)}
                    />
                  ) : el.accessor === 'zip_code' ? (
                    <input
                      className={valid ? '' : 'invalid'}
                      id={el.accessor}
                      name={el.accessor}
                      type="text"
                      value={clientLegalAddressInput[el.accessor] || ''}
                      // onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                      onChange={(e) => {
                        if (regexp.test(e.target.value)) {
                          handleClientLegalAddressInputChange(e);
                        }
                      }}
                    />
                  ) : (
                    <input
                      className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      id={el.accessor}
                      name={el.accessor}
                      type="text"
                      value={clientLegalAddressInput[el.accessor] || ''}
                      onChange={(e) => handleClientLegalAddressInputChange(e)}
                    />
                  )}
                </div>
              </div>
            ))}
          </form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <button form="addClientModel">Add Client</button>
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
