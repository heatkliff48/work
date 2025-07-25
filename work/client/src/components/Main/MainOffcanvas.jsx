import { useUsersContext } from '#components/contexts/UserContext.js';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function MainOffcanvas() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const { roles, checkUserAccess } = useUsersContext();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="nav_link_wrapper">
        <div className="nav_link" onClick={handleShow}>
          <p className="p_nav">Главная</p>
        </div>
      </div>

      <Offcanvas show={show} onHide={handleClose} backdrop={true}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>BAUBLOCK ERP</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ButtonGroup vertical>
            <DropdownButton
              as={ButtonGroup}
              title="Admin"
              id="bg-vertical-dropdown-1"
            >
              <Dropdown.Item eventKey="1">
                {checkUserAccess(user, roles, 'Users_info')?.canRead && (
                  <Button
                    className="nav-button"
                    onClick={() => {
                      navigate('/users_info');
                      handleClose();
                    }}
                  >
                    Users Info
                  </Button>
                )}
              </Dropdown.Item>
              <Dropdown.Item eventKey="2">
                {checkUserAccess(user, roles, 'Roles')?.canRead && (
                  <Button
                    className="nav-button"
                    onClick={() => {
                      navigate('/roles');
                      handleClose();
                    }}
                  >
                    Roles
                  </Button>
                )}
              </Dropdown.Item>
            </DropdownButton>

            {checkUserAccess(user, roles, 'Statistics')?.canRead && (
              <Button
                onClick={() => {
                  navigate('/statistics');
                  handleClose();
                }}
              >
                Statistics
              </Button>
            )}
            {checkUserAccess(user, roles, 'Clients')?.canRead && (
              <Button
                onClick={() => {
                  navigate('/clients');
                  handleClose();
                }}
              >
                Clients
              </Button>
            )}

            {checkUserAccess(user, roles, 'Orders')?.canRead && (
              <Button
                onClick={() => {
                  navigate('/orders');
                  handleClose();
                }}
              >
                Orders
              </Button>
            )}

            <DropdownButton
              as={ButtonGroup}
              title="Ordered products pipeline"
              id="bg-vertical-dropdown-1"
            >
              <Dropdown.Item eventKey="1">
                {checkUserAccess(user, roles, 'List_of_ordered_production')
                  ?.canRead && (
                  <Button
                    className="nav-button"
                    onClick={() => {
                      navigate('/list_of_ordered_production');
                      handleClose();
                    }}
                  >
                    Oredred blocks pipeline
                  </Button>
                )}
              </Dropdown.Item>
              <Dropdown.Item eventKey="2">
                {checkUserAccess(user, roles, 'list_of_ordered_production_oem')
                  ?.canRead && (
                  <Button
                    className="nav-button"
                    onClick={() => {
                      navigate('/list_of_ordered_production_oem');
                      handleClose();
                    }}
                  >
                    Oredred OEM blocks pipeline
                  </Button>
                )}
              </Dropdown.Item>
              <Dropdown.Item eventKey="3">
                {checkUserAccess(user, roles, 'related_materials_backorder_list')
                  ?.canRead && (
                  <Button
                    className="nav-button"
                    onClick={() => {
                      navigate('/related_materials_backorder_list');
                      handleClose();
                    }}
                  >
                    Related materials backorder list
                  </Button>
                )}
              </Dropdown.Item>
            </DropdownButton>

            <Button>Button</Button>
            <Button>Button</Button>

            <DropdownButton
              as={ButtonGroup}
              title="Dropdown"
              id="bg-vertical-dropdown-2"
            >
              <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
              <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
            </DropdownButton>

            <DropdownButton
              as={ButtonGroup}
              title="Dropdown"
              id="bg-vertical-dropdown-3"
            >
              <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
              <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
            </DropdownButton>
          </ButtonGroup>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default MainOffcanvas;
