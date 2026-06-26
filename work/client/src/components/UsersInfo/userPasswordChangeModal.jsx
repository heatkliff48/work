import Modal from 'react-bootstrap/Modal';
import React, { useState } from 'react';
import 'react-international-phone/style.css';
import Container from 'react-bootstrap/Container';
import { useDispatch } from 'react-redux';
import { updateUsersMainInfo } from '#components/redux/actions/usersInfoAction';
import './styles.css';
import { useProjectContext } from '#components/contexts/Context.js';

function PasswordChangeModal(props) {
  const { currentUsersInfo } = useProjectContext();
  const [usersMainInfoInput, setUsersMainInfoInput] =
    useState(currentUsersInfo);
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
        <button form="addClientModel">Add User</button>
      </Modal.Footer>
    </Modal>
  );
}

function ShowPasswordChangeModal() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <button
        type="button"
        className="usr-btn usr-btn--secondary"
        onClick={() => setModalShow(true)}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="10" width="16" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
        Change password
      </button>

      <PasswordChangeModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
}

export default ShowPasswordChangeModal;
