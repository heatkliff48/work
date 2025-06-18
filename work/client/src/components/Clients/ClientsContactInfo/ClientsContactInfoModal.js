import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addNewContactInfo } from '#components/redux/actions/clientAction';
import { useProjectContext } from '#components/contexts/Context.js';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';

function ClientsContactInfoModal(props) {
  const [contactInput, setContactInput] = useState({});

  const { currentClient, clients_contact_information_table } = useProjectContext();

  const formalPositionOptions = [
    { value: 'Director general', label: 'Director general' },
    { value: 'Director ejecutivo', label: 'Director ejecutivo' },
    { value: 'Director técnico', label: 'Director técnico' },
    { value: 'Director comercial', label: 'Director comercial' },
    { value: 'Director financiero', label: 'Director financiero' },
    { value: 'Director de calidad', label: 'Director de calidad' },
    { value: 'Director de seguridad', label: 'Director de seguridad' },
    { value: 'Director de producción', label: 'Director de producción' },
    { value: 'Jefe de obra', label: 'Jefe de obra' },
    { value: 'Jefe de proyecto', label: 'Jefe de proyecto' },
    { value: 'Encargado de obra (capataz)', label: 'Encargado de obra (capataz)' },
    { value: 'Ingeniero jefe', label: 'Ingeniero jefe' },
    { value: 'Ingeniero civil', label: 'Ingeniero civil' },
    { value: 'Ingeniero de proyectos', label: 'Ingeniero de proyectos' },
    { value: 'Ingeniero de estructuras', label: 'Ingeniero de estructuras' },
    { value: 'Ingeniero de instalaciones', label: 'Ingeniero de instalaciones' },
    { value: 'Ingeniero de seguridad', label: 'Ingeniero de seguridad' },
    { value: 'Ingeniero de calidad', label: 'Ingeniero de calidad' },
    {
      value: 'Ingeniero de topografía (geómetra)',
      label: 'Ingeniero de topografía (geómetra)',
    },
    { value: 'Ingeniero de presupuestos', label: 'Ingeniero de presupuestos' },
    { value: 'Ingeniero de planificación', label: 'Ingeniero de planificación' },
    { value: 'Ingeniero eléctrico', label: 'Ingeniero eléctrico' },
    { value: 'Ingeniero mecánico', label: 'Ingeniero mecánico' },
    { value: 'Arquitecto', label: 'Arquitecto' },
    { value: 'Arquitecto jefe', label: 'Arquitecto jefe' },
    { value: 'Arquitecto técnico', label: 'Arquitecto técnico' },
    { value: 'Maestro de obras', label: 'Maestro de obras' },
    { value: 'Albañil', label: 'Albañil' },
    { value: 'Hormigonero', label: 'Hormigonero' },
    { value: 'Encofrador', label: 'Encofrador' },
    { value: 'Ferrallista', label: 'Ferrallista' },
    { value: 'Carpintero', label: 'Carpintero' },
    { value: 'Pintor', label: 'Pintor' },
    { value: 'Yesero', label: 'Yesero' },
    { value: 'Soldador', label: 'Soldador' },
    { value: 'Instalador eléctrico', label: 'Instalador eléctrico' },
    { value: 'Fontanero', label: 'Fontanero' },
    { value: 'Operador de grúa torre', label: 'Operador de grúa torre' },
    { value: 'Operador de excavadora', label: 'Operador de excavadora' },
    {
      value: 'Operador de maquinaria pesada',
      label: 'Operador de maquinaria pesada',
    },
    { value: 'Conductor de camión', label: 'Conductor de camión' },
    { value: 'Peón de obra', label: 'Peón de obra' },
    { value: 'Ayudante de obra', label: 'Ayudante de obra' },
    { value: 'Jefe de almacén', label: 'Jefe de almacén' },
    { value: 'Encargado de compras', label: 'Encargado de compras' },
    { value: 'Técnico de logística', label: 'Técnico de logística' },
    { value: 'Logista', label: 'Logista' },
    {
      value: 'Técnico de prevención de riesgos laborales',
      label: 'Técnico de prevención de riesgos laborales',
    },
    {
      value: 'Responsable de medio ambiente',
      label: 'Responsable de medio ambiente',
    },
    { value: 'Contable', label: 'Contable' },
    { value: 'Jefe de contabilidad', label: 'Jefe de contabilidad' },
    { value: 'Economista', label: 'Economista' },
    { value: 'Abogado', label: 'Abogado' },
    { value: 'Técnico de licitaciones', label: 'Técnico de licitaciones' },
    { value: 'Auxiliar administrativo', label: 'Auxiliar administrativo' },
    { value: 'Secretario/a', label: 'Secretario/a' },
    {
      value: 'Responsable de recursos humanos',
      label: 'Responsable de recursos humanos',
    },
    { value: 'Reclutador', label: 'Reclutador' },
    {
      value: 'Especialista en tecnologías de la información (IT)',
      label: 'Especialista en tecnologías de la información (IT)',
    },
  ];

  const dispatch = useDispatch();

  const handleContactInputChange = useCallback((e) => {
    setContactInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleContactPhoneMobileInput = useCallback((phone, accessor) => {
    setContactInput((prev) => ({ ...prev, [accessor]: phone }));
  }, []);

  const handleSelectChange = (selectedOption, key) => {
    // setValue(selectedOption.value);
    setContactInput((prev) => ({ ...prev, [key]: selectedOption.value }));
  };

  const getSelectedOption = (accessor) => {
    const options = formalPositionOptions;
    if (!options) return null;
    const formalPositionOption = options.find(
      (option) => option.value === contactInput?.[accessor]
    );
    return formalPositionOption || options[0];
  };

  useEffect(() => {
    setContactInput((prev) => ({
      ...prev,
      currentClientID: currentClient.id,
      formal_position: formalPositionOptions[0].value,
    }));
  }, [props.show]);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      dispatch(
        addNewContactInfo({
          contactInfo: contactInput,
        })
      );
      props.onHide();
      setContactInput({});
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add Contact Info
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form
          id="addProductModal"
          className="w-full max-w-sm"
          onSubmit={onSubmitForm}
        >
          {clients_contact_information_table.map((el) => (
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
                  {el.accessor === 'formal_position' ? (
                    <Select
                      defaultValue={getSelectedOption(el.accessor)}
                      onChange={(v) => {
                        handleSelectChange(v, el.accessor);
                      }}
                      options={formalPositionOptions}
                    />
                  ) : el.accessor === 'phone_number_office' ||
                    el.accessor === 'phone_number_mobile' ||
                    el.accessor === 'phone_number_messenger' ? (
                    <PhoneInput
                      defaultCountry="es"
                      value={contactInput[el.accessor] || ''}
                      onChange={(phone) =>
                        handleContactPhoneMobileInput(phone, el.accessor)
                      }
                    />
                  ) : (
                    <input
                      className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      id={el.accessor}
                      name={el.accessor}
                      type="text"
                      value={contactInput[el.accessor] || ''}
                      onChange={(e) => handleContactInputChange(e)}
                    />
                  )}
                </div>
              </div>
            </Col>
          ))}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button form="addProductModal">Add Contact Info</button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function ShowClientsContactInfoModal() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Add Contact Info
      </Button>

      <ClientsContactInfoModal show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}

export default ShowClientsContactInfoModal;
