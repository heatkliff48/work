import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { clearBatchState } from '#components/redux/actions/batchDesignerAction.js';
import { getBatchOutside } from '#components/redux/actions/batchOutsideAction.js';
import {
  getAllClients,
  getAllContactInfo,
  getAllDeliveryAddresses,
} from '#components/redux/actions/clientAction.js';
import {
  getAnchorProductsOfOrders,
  getDryMixedProductsOfOrders,
  getOrders,
  getProductsOfOrders,
  getToolProductsOfOrders,
  getRelMatProductsOfOrders,
} from '#components/redux/actions/ordersAction.js';
import { getAllProducts } from '#components/redux/actions/productsAction.js';
import {
  getAnchor,
  getDryMixesJournal,
  getProductCode,
  getRelatedMaterialsJournal,
  getTool,
} from '#components/redux/actions/productsTypeJournalAction.js';
import {
  getAnchorsWarehouse,
  getDryMixesWarehouse,
  getRelatedMaterialsWarehouse,
  getToolsWarehouse,
} from '#components/redux/actions/productsTypeWarehouseAction.js';
import {
  getRecipe,
  getRecipeOrdersData,
} from '#components/redux/actions/recipeAction.js';
import { getRelatedMaterialsBackorder } from '#components/redux/actions/relatedMaterialsBackorderListAction.js';
import { getAllRoles } from '#components/redux/actions/rolesAction.js';
import { getAllStockBalance } from '#components/redux/actions/stockBalanceAction.js';
import {
  getAllWarehouse,
  getAutoclaveCalendar,
  getListOfAnchorReservedProducts,
  getListOfDryMixedReservedProducts,
  getListOfOrderedProduction,
  getListOfOrderedProductionOEM,
  getListOfRelMatReservedProducts,
  getListOfReservedProducts,
  getListOfToolReservedProducts,
} from '#components/redux/actions/warehouseAction.js';
import { getFilesWarehouse } from '#components/redux/actions/filesWarehouseAction.js';
import { getFilesProduct } from '#components/redux/actions/filesProductAction.js';
import { getFilesOrder } from '#components/redux/actions/filesOrderAction.js';
import { getAllProductionBatchLogs } from '#components/redux/actions/productionBatchLogAction.js';
import { getQualityManagement } from '#components/redux/actions/qualityManagementAction.js';
import { getPagesList } from '#components/redux/actions/pagesAction';
import {
  getAllUsersInfo,
  getAllUsersMainInfo,
} from '#components/redux/actions/usersInfoAction';
import { getAldabaran } from '#components/redux/actions/aldabaranAction.js';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function MainOffcanvas() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const { roles, checkUserAccess } = useUsersContext();
  const { setStoredData } = useOrderContext();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const CustomDropdownToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Button
      ref={ref}
      className="custom-menu-button d-flex justify-content-between align-items-center"
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      <span className="ms-2">▼</span> {/* Добавляем стрелку вручную */}
    </Button>
  ));

  useEffect(() => {
    dispatch(getAldabaran());
    dispatch(getAutoclaveCalendar());
    dispatch(getAllDeliveryAddresses());
    dispatch(getAllClients());
    dispatch(getAllContactInfo());
    dispatch(getAllProducts());
    dispatch(getAllProductionBatchLogs());
    dispatch(getAllRoles());
    dispatch(getAllStockBalance());
    dispatch(getAllUsersInfo());
    dispatch(getAllUsersMainInfo());
    dispatch(getAllWarehouse());
    dispatch(getAnchor());
    dispatch(getAnchorProductsOfOrders());
    dispatch(getAnchorsWarehouse());
    dispatch(getBatchOutside());
    dispatch(getDryMixesJournal());
    dispatch(getDryMixedProductsOfOrders());
    dispatch(getDryMixesWarehouse());
    dispatch(getFilesOrder());
    dispatch(getFilesProduct());
    dispatch(getFilesWarehouse());
    dispatch(getRelMatProductsOfOrders());
    dispatch(getListOfReservedProducts());
    dispatch(getListOfDryMixedReservedProducts());
    dispatch(getListOfAnchorReservedProducts());
    dispatch(getListOfToolReservedProducts());
    dispatch(getListOfRelMatReservedProducts());
    dispatch(getListOfOrderedProduction());
    dispatch(getListOfOrderedProductionOEM());
    dispatch(getOrders());
    dispatch(getPagesList());
    dispatch(getProductsOfOrders());
    dispatch(getRecipeOrdersData());
    dispatch(getRecipe());
    dispatch(getRelatedMaterialsBackorder());
    dispatch(getRelatedMaterialsJournal());
    dispatch(getRelatedMaterialsWarehouse());
    dispatch(getTool());
    dispatch(getToolProductsOfOrders());
    dispatch(getToolsWarehouse());
    dispatch(getProductCode());

    dispatch(getQualityManagement());
    dispatch(clearBatchState());

    setStoredData(null);
  }, []);

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
