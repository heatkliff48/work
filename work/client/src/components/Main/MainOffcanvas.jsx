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
        <button className="nav_home_button" onClick={handleShow}>
          Меню
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
                title="Администрирование"
                className="custom-menu-button"
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
            {checkUserAccess(user, roles, 'Products')?.canRead && (
              <DropdownButton
                as={ButtonGroup}
                title="Каталог продукции"
                className="custom-menu-button"
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
            )}

            {/* Клиенты */}
            {checkUserAccess(user, roles, 'Clients')?.canRead && (
              <Button
                className="custom-menu-button"
                onClick={() => {
                  navigate('/clients');
                  handleClose();
                }}
              >
                Клиенты
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
                Заказы
              </Button>
            )}

            {/* Производственные блоки */}
            {checkUserAccess(user, roles, 'List_of_ordered_production')?.canRead && (
              <DropdownButton
                as={ButtonGroup}
                title="Производство"
                className="custom-menu-button"
              >
                <Dropdown.Item eventKey="1">
                  <Button
                    className="custom-submenu-button"
                    onClick={() => {
                      navigate('/list_of_ordered_production');
                      handleClose();
                    }}
                  >
                    Ordered blocks
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
                    OEM blocks
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
                    Materials backorder
                  </Button>
                </Dropdown.Item>
              </DropdownButton>
            )}

            {/* Планирование */}
            {checkUserAccess(user, roles, 'production_batch_designer')?.canRead && (
              <DropdownButton
                as={ButtonGroup}
                title="Планирование"
                className="custom-menu-button"
              >
                <Dropdown.Item eventKey="1">
                  <Button
                    className="custom-submenu-button"
                    onClick={() => {
                      navigate('/production_batch_designer');
                      handleClose();
                    }}
                  >
                    Batch planner
                  </Button>
                </Dropdown.Item>
              </DropdownButton>
            )}

            {/* Технологические рецепты */}
            {checkUserAccess(user, roles, 'recipe_products')?.canRead && (
              <DropdownButton
                as={ButtonGroup}
                title="Технология"
                className="custom-menu-button"
              >
                <Dropdown.Item eventKey="1">
                  <Button
                    className="custom-submenu-button"
                    onClick={() => {
                      navigate('/recipe_products');
                      handleClose();
                    }}
                  >
                    Recipes
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
                    Recipe planner
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
              </DropdownButton>
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
                Склад
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
                Отгрузка
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
                Качество
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
                Бухгалтерия
              </Button>
            )}
          </ButtonGroup>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default MainOffcanvas;
