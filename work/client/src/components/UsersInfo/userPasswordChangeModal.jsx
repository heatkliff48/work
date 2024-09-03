import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useState } from 'react';
import 'react-international-phone/style.css';
import Container from 'react-bootstrap/Container';
import { useDispatch } from 'react-redux';
import { updateUsersMainInfo } from '#components/redux/actions/usersInfoAction';
import './styles.css';
import { useProjectContext } from '#components/contexts/Context.js';

function PasswordChangeModal(props) {
  const { currentUsersInfo, setCurrentUsersInfo } = useProjectContext();
  const [usersInfoInput, setUsersInfoInput] = useState({});
  const [usersMainInfoInput, setUsersMainInfoInput] = useState(currentUsersInfo);
  const regexp = new RegExp(`^[0-9]*$`);
  const isValid = (value) => value !== '' && value !== '-';
  const [valid, setValid] = useState(isValid(usersInfoInput?.zip_code));
  const [passwordInput, setPasswordInput] = useState('');

  const dispatch = useDispatch();

  const onSubmitForm = async (e) => {
    e.preventDefault();

    const u_id = currentUsersInfo.id;

    const usersMainInfo = {
      u_id,
      password: passwordInput,
    };
    dispatch(updateUsersMainInfo({ usersMainInfo }));
    props.onHide();
    setUsersMainInfoInput(currentUsersInfo);
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
          <div className="login_wrapper">
            <div className="login_topic">Password change</div>
            <div className="login_form_wrapper">
              <form className="login_form" onSubmit={(e) => onSubmitForm(e)}>
                <label htmlFor="password">New Password</label>
                <input
                  className="login_input"
                  type="password"
                  id="password"
                  name="password"
                  value={passwordInput || ''}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
                <button className="change_password" type="submit">
                  Change password
                </button>
              </form>
            </div>
          </div>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <button form="addClientModel">Add Client</button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function ShowPasswordChangeModal() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Button
        variant="primary"
        onClick={() => {
          setModalShow(true);
        }}
      >
        Change Password
      </Button>

      <PasswordChangeModal show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}

export default ShowPasswordChangeModal;
