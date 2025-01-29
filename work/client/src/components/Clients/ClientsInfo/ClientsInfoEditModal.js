import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useState, useCallback, useEffect } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import Select from 'react-select';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateClient,
  updateLegalAddress,
} from '#components/redux/actions/clientAction';
import './styles.css';
import { useProjectContext } from '#components/contexts/Context.js';

function ClientsEditModal(props) {
  const {
    currentClient,
    setCurrentClient,
    clients_info_table,
    clients_legal_address_table,
  } = useProjectContext();
  const legalAddress = useSelector((state) => state.legalAddress);

  const [clientInput, setClientInput] = useState(currentClient);
  const [clientLegalAddressInput, setClientLegalAddressInput] = useState({});
  const [c_name, setName] = useState(currentClient?.c_name);
  const [cifvat, setCIFVAT] = useState(currentClient?.cif_vat);
  const [category, setCategory] = useState(currentClient?.category);
  const [street, setStreet] = useState(legalAddress?.street);
  const [additional_info, setAddInfo] = useState(legalAddress?.additional_info);
  const [city, setCity] = useState(legalAddress?.city);
  const [zip_code, setZIP] = useState(legalAddress?.zip_code);
  const [province, setProvince] = useState(legalAddress?.province);
  const [country, setCountry] = useState(legalAddress?.country);
  const [phone_office, setPhoneOffice] = useState(legalAddress?.phone_office);
  const [fax, setFax] = useState(legalAddress?.fax);
  const [phone_mobile, setPhoneMobile] = useState(legalAddress?.phone_mobile);
  const [web_link, setWebLink] = useState(legalAddress?.web_link);
  const [c_email, setEmail] = useState(legalAddress?.email);

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

  const handleClientPhoneInput = useCallback((phone) => {
    // setClientLegalAddressInput((prev) => ({ ...prev, phone_office: phone }));
    setPhoneOffice(phone);
  }, []);

  const handleClientFaxInput = useCallback((number) => {
    setFax(number);
  }, []);

  const handleClientPhoneMobileInput = useCallback((number) => {
    setPhoneMobile(number);
  }, []);

  const handleSelectChange = (selectedOption) => {
    setClientInput((prev) => ({ ...prev, category: selectedOption.value }));
    setCategory(selectedOption.value);
  };

  const getSelectedOption = (accessor) => {
    const options = categoryOptions;
    if (!options) return null;
    const categoryOption = options.find((option) => option.value === accessor);
    // Если выбранная опция найдена, возвращаем ее, иначе возвращаем первую опцию по умолчанию
    return categoryOption || options[0];
  };

  useEffect(() => {
    setClientInput((prev) => ({
      ...prev,
      category: getSelectedOption(currentClient?.category).value,
    }));
    setCategory(clientInput.category);
    setPhoneOffice(legalAddress?.phone_office || '');
  }, [props.show]);

  const dispatch = useDispatch();

  const onSubmitForm = async (e) => {
    e.preventDefault();
    const c_id = currentClient.id;
    const client = {
      c_id,
      c_name,
      cifvat,
      category,
    };

    dispatch(updateClient({ client }));
    const legalAddress = {
      c_id,
      street,
      additional_info,
      city,
      zip_code,
      province,
      country,
      phone_office,
      fax,
      phone_mobile,
      web_link,
      c_email,
    };
    dispatch(updateLegalAddress({ legalAddress }));
    props.onHide();
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
        <Modal.Title id="contained-modal-title-vcenter">Edit Client</Modal.Title>
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
              <Col>
                <div className="md:flex md:items-center mb-6">
                  <div className="md:w-1/3">
                    <label
                      className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                      for="version"
                    >
                      Client's Name
                    </label>
                  </div>
                  <div className="md:w-2/3">
                    <input
                      className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      id="c_name"
                      type="text"
                      value={c_name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              </Col>
              <Col>
                <div className="md:flex md:items-center mb-6">
                  <div className="md:w-1/3">
                    <label
                      className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                      for="version"
                    >
                      CIF/VAT
                    </label>
                  </div>
                  <div className="md:w-2/3">
                    <input
                      className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      id="cif_vat"
                      type="text"
                      value={cifvat}
                      onChange={(e) => setCIFVAT(e.target.value)}
                    />
                  </div>
                </div>
              </Col>
              <Col>
                <div className="md:flex md:items-center mb-6">
                  <div className="md:w-1/3">
                    <label
                      className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                      for="discription"
                    >
                      Category
                    </label>
                  </div>
                  <div className="md:w-2/3">
                    <Select
                      defaultValue={getSelectedOption(currentClient?.category)}
                      onChange={(v) => {
                        handleSelectChange(v);
                        // setCategory(v.value)
                      }}
                      options={categoryOptions}
                    />
                    {/* <input
                      className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      id="category"
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    /> */}
                  </div>
                </div>
              </Col>
            </Row>

            <h3>Client's legal address</h3>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  for="version"
                >
                  Street
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="street"
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  for="version"
                >
                  Additional info
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="additional_info"
                  type="text"
                  value={additional_info}
                  onChange={(e) => setAddInfo(e.target.value)}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  for="discription"
                >
                  City
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  for="discription"
                >
                  ZIP code
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="zip_code"
                  type="text"
                  value={zip_code}
                  onChange={(e) => setZIP(e.target.value)}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  for="discription"
                >
                  Province
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="province"
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  for="discription"
                >
                  Country
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="country"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  for="discription"
                >
                  Phone office
                </label>
              </div>
              <div className="md:w-2/3">
                <PhoneInput
                  // defaultCountry="es"
                  value={phone_office}
                  onChange={(phone) => handleClientPhoneInput(phone)}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  for="discription"
                >
                  Fax
                </label>
              </div>
              <div className="md:w-2/3">
                <PhoneInput
                  // defaultCountry="es"
                  value={fax}
                  onChange={(number) => handleClientFaxInput(number)}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  for="discription"
                >
                  Mobile
                </label>
              </div>
              <div className="md:w-2/3">
                <PhoneInput
                  // defaultCountry="es"
                  value={phone_mobile}
                  onChange={(number) => handleClientPhoneMobileInput(number)}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  for="discription"
                >
                  Web link
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="email"
                  type="text"
                  value={web_link}
                  onChange={(e) => setWebLink(e.target.value)}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  for="discription"
                >
                  email
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="email"
                  type="text"
                  value={c_email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <button form="addProductModal">Edit Client</button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function ShowClientsEditModal() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Button
        variant="primary"
        onClick={() => {
          setModalShow(true);
        }}
      >
        Edit Client
      </Button>

      <ClientsEditModal show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}

export default ShowClientsEditModal;
