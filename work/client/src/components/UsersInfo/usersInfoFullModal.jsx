import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import './styles.css';

import ShowPasswordChangeModal from './userPasswordChangeModal';
import { useProjectContext } from '#components/contexts/Context.js';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useUsersContext } from '#components/contexts/UserContext.js';

function UsersInfoFullModal({ show, onHide }) {
  const usersInfo = useSelector((state) => state.usersInfo);
  const usersMainInfo = useSelector((state) => state.usersMainInfo);
  const { currentUsersInfo, setCurrentUsersInfo } = useProjectContext();
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();
  const user = useSelector((state) => state.user);

  const combine = (a, b, prop) =>
    Object.values(
      [...a, ...b].reduce((acc, v) => {
        if (v[prop])
          acc[v[prop]] = acc[v[prop]] ? { ...acc[v[prop]], ...v } : { ...v };
        return acc;
      }, {})
    );

  useEffect(() => {
    if (Object.keys(currentUsersInfo).length === 0) {
      return;
    }
    const combined = combine(usersInfo, usersMainInfo, 'id');
    const user = combined.filter((el) => el.id === currentUsersInfo.id)[0];
    setCurrentUsersInfo(user);
  }, [usersMainInfo, usersInfo]);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Clients');
      setUserAccess(access);
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
        <Modal.Title id="contained-modal-title-vcenter">
          Users's full info
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
                  {currentUsersInfo?.fullName}'s user card
                </h3>
                <p>Username:{currentUsersInfo?.username}</p>
                <p>Email:{currentUsersInfo?.email}</p>
                <p>Role:{currentUsersInfo?.role}</p>
                <p>Shift:{currentUsersInfo?.shift}</p>
                <p>Subdivision:{currentUsersInfo?.subdivision}</p>
                <p>Work phone:{currentUsersInfo?.phone}</p>
              </div>
            </div>
          </form>

          <Row>
            <Col xs={12} md={8}></Col>
            <Col xs={6} md={4}>
              {userAccess?.canWrite && <ShowPasswordChangeModal />}
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UsersInfoFullModal;
