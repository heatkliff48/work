import { useUsersContext } from '#components/contexts/UserContext.js';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './offCanvas.css';

function MainOffcanvas() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const { roles, checkUserAccess } = useUsersContext();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* Можно использовать как "mobile nav" при желании */}
      <div className="nav_link_wrapper">
        <button className="nav_home_button" onClick={handleShow}>
          Menu
        </button>
      </div>

      <Offcanvas show={show} onHide={handleClose} backdrop={true} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>BAUBLOCK ERP</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <ButtonGroup vertical style={{ width: '100%' }}>
            <Button
              className="custom-menu-button"
              onClick={() => {
                navigate('/');
                handleClose();
              }}
            >
              Main Page
            </Button>

            {checkUserAccess(user, roles, 'Users_info')?.canRead && (
              <DropdownButton
                as={ButtonGroup}
                title="Admin"
                bsPrefix="custom-menu-button"
                variant="custom"
              >
                <Dropdown.Item eventKey="1">
                  <Button
                    className="custom-submenu-button"
                    onClick={() => {
                      navigate('/users_info');
                      handleClose();
                    }}
                  >
                    Users Info
                  </Button>
                </Dropdown.Item>

                <Dropdown.Item eventKey="2">
                  <Button
                    className="custom-submenu-button"
                    onClick={() => {
                      navigate('/roles');
                      handleClose();
                    }}
                  >
                    Roles
                  </Button>
                </Dropdown.Item>
              </DropdownButton>
            )}

            <Button
              className="custom-menu-button"
              onClick={() => {
                navigate('/products_type_journal');
                handleClose();
              }}
            >
              Products Type Journal
            </Button>

            <Button
              className="custom-menu-button"
              onClick={() => {
                navigate('/statistics');
                handleClose();
              }}
            >
              Statistics
            </Button>

            {checkUserAccess(user, roles, 'Clients')?.canRead && (
              <Button
                className="custom-menu-button"
                onClick={() => {
                  navigate('/clients');
                  handleClose();
                }}
              >
                Clients
              </Button>
            )}

            {checkUserAccess(user, roles, 'Orders')?.canRead && (
              <DropdownButton
                as={ButtonGroup}
                title="Admin"
                bsPrefix="custom-menu-button"
                variant="custom"
              >
                <Dropdown.Item eventKey="1">
                  <Button
                    className="custom-menu-button"
                    onClick={() => {
                      navigate('/orders');
                      handleClose();
                    }}
                  >
                    Orders
                  </Button>
                </Dropdown.Item>

                <Dropdown.Item eventKey="2">
                  <Button
                    className="custom-submenu-button"
                    onClick={() => {
                      navigate('/orders_to_warehouse');
                      handleClose();
                    }}
                  >
                    Orders to warehouse
                  </Button>
                </Dropdown.Item>
              </DropdownButton>
            )}

            <Button
              className="custom-menu-button"
              onClick={() => {
                navigate('/cacke_fillup');
                handleClose();
              }}
            >
              Casting
            </Button>

            {checkUserAccess(user, roles, 'Warehouse')?.canRead && (
              <Button
                className="custom-menu-button"
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
                className="custom-menu-button"
                onClick={() => {
                  navigate('/warehouse_manager');
                  handleClose();
                }}
              >
                Order dispatch
              </Button>
            )}

            {checkUserAccess(user, roles, 'production_batch_designer')?.canRead && (
              <DropdownButton
                as={ButtonGroup}
                title="Production planner"
                bsPrefix="custom-menu-button"
                variant="custom"
              >
                <Dropdown.Item eventKey="1">
                  <Button
                    className="custom-submenu-button"
                    onClick={() => {
                      navigate('/autoclave_calendar');
                      handleClose();
                    }}
                  >
                    Autoclave Calendar
                  </Button>
                </Dropdown.Item>

                <Dropdown.Item eventKey="2">
                  <Button
                    className="custom-submenu-button"
                    onClick={() => {
                      navigate('/production_batch_designer_new');
                      handleClose();
                    }}
                  >
                    Batch planner
                  </Button>
                </Dropdown.Item>
              </DropdownButton>
            )}

            {checkUserAccess(user, roles, 'production_plan')?.canRead && (
              <Button
                className="custom-menu-button"
                onClick={() => {
                  navigate('/batch_outside');
                  handleClose();
                }}
              >
                Batch calendar
              </Button>
            )}

            {checkUserAccess(user, roles, 'recipe_products')?.canRead && (
              <Button
                className="custom-menu-button"
                onClick={() => {
                  navigate('/recipe_products');
                  handleClose();
                }}
              >
                Recipe Products
              </Button>
            )}

            {/* {checkUserAccess(user, roles, 'recipe_orders')?.canRead && (
              <Button
                className="custom-menu-button"
                onClick={() => {
                  navigate('/recipe_orders');
                  handleClose();
                }}
              >
                Production recipes calendar
              </Button>
            )} */}

            {checkUserAccess(user, roles, 'quality_management')?.canRead && (
              <Button
                className="custom-menu-button"
                onClick={() => {
                  navigate('/quality_management');
                  handleClose();
                }}
              >
                Quality Management
              </Button>
            )}

            {checkUserAccess(user, roles, 'accounting')?.canRead && (
              <DropdownButton
                as={ButtonGroup}
                title="Production planner"
                bsPrefix="custom-menu-button"
                variant="custom"
              >
                <Dropdown.Item eventKey="1">
                  <Button
                    className="custom-menu-button"
                    onClick={() => {
                      navigate('/accounting');
                      handleClose();
                    }}
                  >
                    Accounting
                  </Button>
                </Dropdown.Item>

                <Dropdown.Item eventKey="2">
                  <Button
                    className="custom-menu-button"
                    onClick={() => {
                      navigate('/factura_manager');
                      handleClose();
                    }}
                  >
                    Fury Warrior
                  </Button>
                </Dropdown.Item>
              </DropdownButton>
            )}

            <Button
              className="custom-menu-button"
              onClick={() => {
                navigate('/green_line_monitoring');
                handleClose();
              }}
            >
              Accounting
            </Button>
          </ButtonGroup>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default MainOffcanvas;
