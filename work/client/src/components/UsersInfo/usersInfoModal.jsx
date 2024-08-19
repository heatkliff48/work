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
import {
  addNewUsersInfo,
  addNewUsersMainInfo,
} from '#components/redux/actions/usersInfoAction';
import './styles.css';
import { useProjectContext } from '#components/contexts/Context.js';

function UsersInfoModal(props) {
  const { users_main_info_table, users_additional_info_table } = useProjectContext();
  const [usersInfoInput, setUsersInfoInput] = useState({});
  const [usersMainInfoInput, setUsersMainInfoInput] = useState({});
  const regexp = new RegExp(`^[0-9]*$`);
  const isValid = (value) => value !== '' && value !== '-';
  const [valid, setValid] = useState(isValid(usersInfoInput?.zip_code));

  const groupOptions = [
    { value: 'memblex', label: 'Memblex' },
    { value: 'peplex', label: 'Peplex' },
  ];

  const roleOptions = [
    { value: 1, label: 'Production Manager' },
    { value: 2, label: 'Head of Sales Department' },
    { value: 3, label: 'System administrator' },
    { value: 4, label: 'Chief technologist' },
    { value: 5, label: 'Mill operators' },
    { value: 6, label: 'Casting operators' },
    { value: 7, label: 'Cutting operators' },
    { value: 8, label: 'Green array operators' },
    { value: 9, label: 'Autoclave operators' },
    { value: 10, label: 'White array operators' },
    { value: 11, label: 'Packaging operators' },
    { value: 12, label: 'Quality manager' },
    { value: 13, label: 'Production director' },
    { value: 14, label: 'Mechanical-electrical technicians' },
    { value: 15, label: 'Forklift drivers' },
    { value: 16, label: 'Sales department director' },
    { value: 17, label: 'Sales department manager' },
    { value: 18, label: 'Warehouse department director' },
    { value: 19, label: 'Warehouse department manager' },
    { value: 20, label: 'Accountant' },
  ];

  const dispatch = useDispatch();

  const handleUsersInfoInputChange = useCallback((e) => {
    setUsersInfoInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleUsersMainInfoInputChange = useCallback((e) => {
    setUsersMainInfoInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleUsersPhoneInput = useCallback((phone_number) => {
    setUsersInfoInput((prev) => ({ ...prev, phone: phone_number }));
  }, []);

  const handleSelectGroupChange = (selectedOption, key) => {
    // setValue(selectedOption.value);
    setUsersInfoInput((prev) => ({ ...prev, [key]: selectedOption.value }));
  };

  const handleSelectRoleChange = (selectedOption, key) => {
    // setValue(selectedOption.value);
    setUsersMainInfoInput((prev) => ({ ...prev, [key]: selectedOption.value }));
  };

  const getSelectedGroupOption = (accessor) => {
    const options = groupOptions;
    if (!options) return null;
    const groupOption = options.find(
      (option) => option.value === usersInfoInput?.[accessor]
    );
    // Если выбранная опция найдена, возвращаем ее, иначе возвращаем первую опцию по умолчанию
    return groupOption || options[0];
  };

  const getSelectedRoleOption = (accessor) => {
    const options = roleOptions;
    if (!options) return null;
    const groupOption = options.find(
      (option) => option.value === usersInfoInput?.[accessor]
    );
    // Если выбранная опция найдена, возвращаем ее, иначе возвращаем первую опцию по умолчанию
    return groupOption || options[0];
  };

  useEffect(() => {
    setUsersInfoInput((prev) => ({ ...prev, group: groupOptions[0].value }));
    setUsersMainInfoInput((prev) => ({ ...prev, role: roleOptions[0].value }));
  }, [props.show]);

  const onSubmitForm = async (e) => {
    e.preventDefault();

    dispatch(addNewUsersInfo({ usersInfo: usersInfoInput }));
    dispatch(addNewUsersMainInfo({ usersMainInfo: usersMainInfoInput }));
    // setModalShow(false);
    props.onHide();
    setUsersInfoInput({});
    setUsersMainInfoInput({});
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
        <Modal.Title id="contained-modal-title-vcenter">Add User</Modal.Title>
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
            <h3>User's info</h3>
            <Row>
              {users_main_info_table.map((el) => (
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
                      {el.accessor === 'password' ? (
                        <input
                          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                          id={el.accessor}
                          name={el.accessor}
                          type="password"
                          value={usersMainInfoInput[el.accessor] || ''}
                          onChange={(e) => handleUsersMainInfoInputChange(e)}
                        />
                      ) : el.accessor === 'role' ? (
                        <Select
                          defaultValue={getSelectedRoleOption(el.accessor)}
                          onChange={(v) => {
                            handleSelectRoleChange(v, el.accessor);
                          }}
                          options={groupOptions}
                        />
                      ) : (
                        <input
                          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                          id={el.accessor}
                          name={el.accessor}
                          type="text"
                          value={usersMainInfoInput[el.accessor] || ''}
                          onChange={(e) => handleUsersMainInfoInputChange(e)}
                        />
                      )}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>

            <h3>User's additional info</h3>
            {users_additional_info_table.map((el) => (
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
                  {el.accessor === 'phone' ? (
                    <PhoneInput
                      defaultCountry="es"
                      value={usersInfoInput[el.accessor] || ''}
                      onChange={(phone) => handleUsersPhoneInput(phone)}
                    />
                  ) : el.accessor === 'group' ? (
                    <Select
                      defaultValue={getSelectedGroupOption(el.accessor)}
                      onChange={(v) => {
                        handleSelectGroupChange(v, el.accessor);
                      }}
                      options={groupOptions}
                    />
                  ) : (
                    <input
                      className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      id={el.accessor}
                      name={el.accessor}
                      type="text"
                      value={usersInfoInput[el.accessor] || ''}
                      onChange={(e) => handleUsersInfoInputChange(e)}
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

function ShowUsersInfoModal() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Button
        variant="primary"
        onClick={() => {
          setModalShow(true);
        }}
      >
        Add User
      </Button>

      <UsersInfoModal show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}

export default ShowUsersInfoModal;
