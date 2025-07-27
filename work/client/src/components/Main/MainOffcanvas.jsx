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
          <p className="p_nav">Home</p>
        </div>
      </div>

      <Offcanvas show={show} onHide={handleClose} backdrop={true}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>BAUBLOCK ERP</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ButtonGroup vertical>
            {checkUserAccess(user, roles, 'Users_info')?.canRead && (
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
            )}
            {checkUserAccess(user, roles, 'Products')?.canRead && (
              <DropdownButton
                as={ButtonGroup}
                title="Products catalog"
                id="bg-vertical-dropdown-1"
              >
                <Dropdown.Item eventKey="1">
                  {checkUserAccess(user, roles, 'Products')?.canRead && (
                    <Button
                      onClick={() => {
                        navigate('/products_type_journal');
                        handleClose();
                      }}
                    >
                      Products catalog
                    </Button>
                  )}
                </Dropdown.Item>
                <Dropdown.Item eventKey="2">
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
                </Dropdown.Item>
              </DropdownButton>
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
            {checkUserAccess(user, roles, 'List_of_ordered_production')?.canRead && (
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
            )}
            {checkUserAccess(user, roles, 'production_batch_designer')?.canRead && (
              <DropdownButton
                as={ButtonGroup}
                title="Production planner"
                id="bg-vertical-dropdown-2"
              >
                <Dropdown.Item eventKey="1">
                  <Button>Autoclave calender</Button>
                </Dropdown.Item>
                <Dropdown.Item eventKey="2">
                  {checkUserAccess(user, roles, 'production_batch_designer')
                    ?.canRead && (
                    <Button
                      onClick={() => {
                        navigate('/production_batch_designer');
                        handleClose();
                      }}
                    >
                      Batch planner
                    </Button>
                  )}
                </Dropdown.Item>
              </DropdownButton>
            )}
            {checkUserAccess(user, roles, 'production_plan')?.canRead && (
              <Button
                onClick={() => {
                  navigate('/batch_outside');
                  handleClose();
                }}
              >
                Batch calender
              </Button>
            )}

            {checkUserAccess(user, roles, 'recipe_products')?.canRead && (
              <DropdownButton
                as={ButtonGroup}
                title="Production planner"
                id="bg-vertical-dropdown-2"
              >
                {checkUserAccess(user, roles, 'recipe_products')?.canRead && (
                  <Dropdown.Item eventKey="1">
                    <Button
                      onClick={() => {
                        navigate('/recipe_products');
                        handleClose();
                      }}
                    >
                      Recepies catalog
                    </Button>
                  </Dropdown.Item>
                )}

                {checkUserAccess(user, roles, 'raw_materials_plan')?.canRead && (
                  <Dropdown.Item eventKey="2">
                    <Button
                      onClick={() => {
                        navigate('/raw_materials_plan');
                        handleClose();
                      }}
                    >
                      Batch recepie planner
                    </Button>
                  </Dropdown.Item>
                )}
                {checkUserAccess(user, roles, 'recipe_orders')?.canRead && (
                  <Dropdown.Item eventKey="3">
                    <Button
                      onClick={() => {
                        navigate('/recipe_orders');
                        handleClose();
                      }}
                    >
                      Raw material calender
                    </Button>
                  </Dropdown.Item>
                )}
              </DropdownButton>
            )}
            {checkUserAccess(user, roles, 'recipe_orders')?.canRead && (
              <Button
                onClick={() => {
                  navigate('/recipe_orders');
                  handleClose();
                }}
              >
                Technology calender
              </Button>
            )}
            {checkUserAccess(user, roles, 'quality_management')?.canRead && (
              <Button
                onClick={() => {
                  navigate('/quality_management');
                  handleClose();
                }}
              >
                Quality management
              </Button>
            )}

            {checkUserAccess(user, roles, 'Warehouse')?.canRead && (
              <Button
                onClick={() => {
                  navigate('/warehouse_products_type');
                  handleClose();
                }}
              >
                Warehouse
              </Button>
            )}

            {checkUserAccess(user, roles, 'warehouse_manager')?.canRead && (
              <Button
                onClick={() => {
                  navigate('/warehouse_manager');
                  handleClose();
                }}
              >
                Order dispatch
              </Button>
            )}
            {checkUserAccess(user, roles, 'accounting')?.canRead && (
              <Button
                onClick={() => {
                  navigate('/accounting');
                  handleClose();
                }}
              >
                Accounting
              </Button>
            )}
          </ButtonGroup>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default MainOffcanvas;
