import { useUsersContext } from '#components/contexts/UserContext.js';
import React, { useState } from 'react';
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

  // const CustomDropdownToggle = React.forwardRef(({ children, onClick }, ref) => (
  //   <Button
  //     ref={ref}
  //     className="custom-menu-button d-flex justify-content-between align-items-center"
  //     onClick={(e) => {
  //       e.preventDefault();
  //       onClick(e);
  //     }}
  //   >
  //     {children}
  //     <span className="ms-2">▼</span> {/* Добавляем стрелку вручную */}
  //   </Button>
  // ));

  return (
    <>
      <div className="nav_link_wrapper">
        <button className="nav_home_button" onClick={handleShow}>
          Home
        </button>
      </div>

      <Offcanvas show={show} onHide={handleClose} backdrop={true}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>BAUBLOCK ERP</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ButtonGroup vertical>
            {/* Администрирование */}
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

            {/* Продукты */}
            <DropdownButton
              as={ButtonGroup}
              title="Products catalog"
              bsPrefix="custom-menu-button"
              variant="custom"
            >
              <Dropdown.Item eventKey="1">
                <Button
                  className="custom-submenu-button"
                  onClick={() => {
                    navigate('/products_type_journal');
                    handleClose();
                  }}
                >
                  Products catalog
                </Button>
              </Dropdown.Item>
              <Dropdown.Item eventKey="2">
                <Button
                  className="custom-submenu-button"
                  onClick={() => {
                    navigate('/statistics');
                    handleClose();
                  }}
                >
                  Statistics
                </Button>
              </Dropdown.Item>
            </DropdownButton>

            {/* Клиенты */}
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

            {/* Заказы */}
            {checkUserAccess(user, roles, 'Orders')?.canRead && (
              <Button
                className="custom-menu-button"
                onClick={() => {
                  navigate('/orders');
                  handleClose();
                }}
              >
                Orders
              </Button>
            )}

            {/* Производственные блоки */}
            {checkUserAccess(user, roles, 'List_of_ordered_production')?.canRead && (
              <DropdownButton
                as={ButtonGroup}
                title="Ordered products pipeline"
                bsPrefix="custom-menu-button"
                variant="custom"
              >
                <Dropdown.Item eventKey="1">
                  <Button
                    className="custom-submenu-button"
                    onClick={() => {
                      navigate('/list_of_ordered_production');
                      handleClose();
                    }}
                  >
                    Ordered blocks pipeline
                  </Button>
                </Dropdown.Item>
                <Dropdown.Item eventKey="2">
                  <Button
                    className="custom-submenu-button"
                    onClick={() => {
                      navigate('/list_of_ordered_production_oem');
                      handleClose();
                    }}
                  >
                    Ordered OEM blocks pipeline
                  </Button>
                </Dropdown.Item>
                <Dropdown.Item eventKey="3">
                  <Button
                    className="custom-submenu-button"
                    onClick={() => {
                      navigate('/related_materials_backorder_list');
                      handleClose();
                    }}
                  >
                    Related materials backorder list
                  </Button>
                </Dropdown.Item>
              </DropdownButton>
            )}

            {/* Планирование */}
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
                    Autoclave calendar
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

            {/* Технологические рецепты */}
            {checkUserAccess(user, roles, 'recipe_products')?.canRead && (
              <DropdownButton
                as={ButtonGroup}
                title="Technology planner"
                bsPrefix="custom-menu-button"
                variant="custom"
              >
                <Dropdown.Item eventKey="1">
                  <Button
                    className="custom-submenu-button"
                    onClick={() => {
                      navigate('/recipe_products');
                      handleClose();
                    }}
                  >
                    Recipes catalog
                  </Button>
                </Dropdown.Item>
                <Dropdown.Item eventKey="2">
                  <Button
                    className="custom-submenu-button"
                    onClick={() => {
                      navigate('/raw_materials_plan');
                      handleClose();
                    }}
                  >
                    Batch recipe planner
                  </Button>
                </Dropdown.Item>
                <Dropdown.Item eventKey="3">
                  <Button
                    className="custom-submenu-button"
                    onClick={() => {
                      navigate('/recipe_orders');
                      handleClose();
                    }}
                  >
                    Raw material calendar
                  </Button>
                </Dropdown.Item>
                <Dropdown.Item eventKey="4">
                  <Button
                    className="custom-submenu-button"
                    onClick={() => {
                      navigate('/raw_material_consumption');
                      handleClose();
                    }}
                  >
                    Raw material consumption
                  </Button>
                </Dropdown.Item>
              </DropdownButton>
            )}
            {checkUserAccess(user, roles, 'recipe_orders')?.canRead && (
              <Button
                className="custom-menu-button"
                onClick={() => {
                  navigate('/recipe_orders');

                  handleClose();
                }}
              >
                Technology calendar
              </Button>
            )}
            {/* Качество */}
            {checkUserAccess(user, roles, 'quality_management')?.canRead && (
              <Button
                className="custom-menu-button"
                onClick={() => {
                  navigate('/quality_management');
                  handleClose();
                }}
              >
                Quality management
              </Button>
            )}

            {/* Склад */}
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

            {/* Отгрузка */}
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

            {/* Бухгалтерия */}
            {checkUserAccess(user, roles, 'accounting')?.canRead && (
              <Button
                className="custom-menu-button"
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
