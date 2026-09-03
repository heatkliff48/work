import React, { useMemo, useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearAccountingDataList } from '#components/redux/actions/ordersAction.js';
import { delUser } from '#components/redux/actions/userAction';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { useProjectContext } from '#components/contexts/Context.js';
import TabsBar from '#components/Main/TabsBar';
import '#components/Styles/dashboard.css';

// Импортируем все иконки
import adminIcon from '#components/Styles/mainpageing/admin.svg';
import autoclaveCalendarIcon from '#components/Styles/mainpageing/autoclave-calendar.svg';
import batchCalendarIcon from '#components/Styles/mainpageing/batch-calendar.svg';
import batchPlannerIcon from '#components/Styles/mainpageing/batch-planner.svg';
import blockPipelineIcon from '#components/Styles/mainpageing/block-pipeline.svg';
import clientsIcon from '#components/Styles/mainpageing/clients.svg';
import clientsPriceGroupsIcon from '#components/Styles/mainpageing/clients-price-groups.svg';
import homeIcon from '#components/Styles/mainpageing/home.svg';
import lotesListIcon from '#components/Styles/mainpageing/lotes-list.svg';
import oemPipelineIcon from '#components/Styles/mainpageing/oem-pipeline.svg';
import orderDispatchIcon from '#components/Styles/mainpageing/order-dispatch.svg';
import ordersIcon from '#components/Styles/mainpageing/orders.svg';
import pipelineIcon from '#components/Styles/mainpageing/pipeline.svg';
import prodCatalogIcon from '#components/Styles/mainpageing/prodicts-catalog.svg';
import productionPlannerIcon from '#components/Styles/mainpageing/production-planner.svg';
import qualityManIcon from '#components/Styles/mainpageing/quality-man.svg';
import rawMatCalIcon from '#components/Styles/mainpageing/raw-mat-cal.svg';
import rawMatConsIcon from '#components/Styles/mainpageing/raw-mat-cons.svg';
import recipesCatalogIcon from '#components/Styles/mainpageing/recepies-catalog.svg';
import relatedBackorderIcon from '#components/Styles/mainpageing/related-backorder.svg';
import rolesIcon from '#components/Styles/mainpageing/roles.svg';
import statisticsIcon from '#components/Styles/mainpageing/statistics.svg';
import technologyPlannerIcon from '#components/Styles/mainpageing/tecnology-planer.svg';
import userInfoIcon from '#components/Styles/mainpageing/user-info.svg';
import warehouseIcon from '#components/Styles/mainpageing/warehouse.svg';
import accountingIcon from '#components/Styles/mainpageing/accounting.svg';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const { roles, checkUserAccess } = useUsersContext();
  const { getPageTitleByPath, getRoleName } = useProjectContext();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = () => setDrawerOpen(false);

  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState({});

  const isDesktop = () =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(min-width: 901px)').matches;
  const isMobile = () =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(max-width: 900px)').matches;

  useEffect(() => {
    if (isDesktop()) {
      setCollapsed(location.pathname !== '/');
    }
    if (isMobile()) {
      setDrawerOpen(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(clearAccountingDataList());
    dispatch(delUser());
    window.localStorage.clear();
    localStorage.clear();
    navigate('/sign-in');
  };

  const username =
    user?.username || user?.login || user?.name || user?.email || 'USER';
  const userrole = user ? getRoleName(user?.role) : '';
  const title = getPageTitleByPath(location.pathname);

  const canSee = (access) => {
    if (!access) return true;
    return !!checkUserAccess(user, roles, access)?.canRead;
  };

  const menuItems = useMemo(
    () => [
      {
        type: 'group',
        title: 'Admin',
        icon: adminIcon,
        access: 'Users_info',
        children: [
          {
            title: 'Users Info',
            path: '/users_info',
            icon: userInfoIcon,
            access: 'Users_info',
          },
          {
            title: 'Roles',
            path: '/roles',
            icon: rolesIcon,
            access: 'Users_info',
          },
        ],
      },
      {
        type: 'group',
        title: 'Products catalog',
        icon: prodCatalogIcon,
        access: null,
        children: [
          {
            title: 'Products catalog',
            path: '/products_type_journal',
            icon: prodCatalogIcon,
          },
          {
            title: 'Production quality',
            path: '/production_quality',
            icon: prodCatalogIcon,
          },
          { title: 'Statistics', path: '/statistics', icon: statisticsIcon },
        ],
      },
      {
        title: 'Clients',
        path: '/clients',
        icon: clientsIcon,
        access: 'Clients',
      },
      {
        title: 'Clients price groups',
        path: '/clients_price_info',
        icon: clientsPriceGroupsIcon,
        access: 'Clients',
      },
      {
        type: 'group',
        title: 'Orders catalog',
        icon: prodCatalogIcon,
        access: null,
        children: [
          {
            title: 'Orders',
            path: '/orders',
            icon: ordersIcon,
            access: 'Orders',
          },
          {
            title: 'Orders to warehouse',
            path: '/orders_to_warehouse',
            icon: ordersIcon,
          },
        ],
      },

      {
        type: 'group',
        title: 'Ordered products pipeline',
        icon: pipelineIcon,
        access: 'List_of_ordered_production',
        children: [
          {
            title: 'Ordered blocks pipeline',
            path: '/list_of_ordered_production',
            icon: blockPipelineIcon,
          },
          {
            title: 'Ordered OEM blocks pipeline',
            path: '/list_of_ordered_production_oem',
            icon: oemPipelineIcon,
          },
          {
            title: 'Related materials backorder list',
            path: '/related_materials_backorder_list',
            icon: relatedBackorderIcon,
          },
        ],
      },
      {
        type: 'group',
        title: 'Production planner',
        icon: productionPlannerIcon,
        access: 'production_batch_designer',
        children: [
          {
            title: 'Autoclave calendar',
            path: '/autoclave_calendar',
            icon: autoclaveCalendarIcon,
          },
          {
            title: 'Batch calendar',
            path: '/batch_outside',
            icon: batchCalendarIcon,
            access: 'production_plan',
          },
        ],
      },
      
      {
        type: 'group',
        title: 'Technology planner',
        icon: technologyPlannerIcon,
        access: 'recipe_products',
        children: [
          {
            title: 'Recipes catalog',
            path: '/recipe_products',
            icon: recipesCatalogIcon,
          },
          {
            title: 'Calendar',
            path: '/technology_calendar',
            icon: batchCalendarIcon,
          },
          // {
          //   title: 'Production recipes calendar',
          //   path: '/recipe_orders',
          //   icon: rawMatCalIcon,
          // },
          {
            title: 'Casting',
            path: '/cake_fillup',
            icon: technologyPlannerIcon,
          },
          {
            title: 'Raw material consumption',
            path: '/raw_material_consumption',
            icon: rawMatConsIcon,
          },
          { title: 'Lotes list', path: '/lotes_list', icon: lotesListIcon },
        ],
      },
      {
        title: 'Quality management',
        path: '/quality_management',
        icon: qualityManIcon,
        access: 'quality_management',
      },
      {
        title: 'Warehouse',
        path: '/warehouse_products_type',
        icon: warehouseIcon,
        access: 'Warehouse',
      },
      {
        title: 'Order dispatch',
        path: '/warehouse_manager',
        icon: orderDispatchIcon,
        access: 'warehouse_manager',
      },
      {
        type: 'group',
        title: 'Accounting',
        icon: accountingIcon,
        access: 'accounting',
        children: [
          {
            title: 'Accounting',
            path: '/accounting',
            icon: accountingIcon,
            access: 'accounting',
          },
          {
            title: 'Furi',
            path: '/factura_manager',
            icon: accountingIcon,
            access: 'accounting',
          },
        ],
      },
      {
        type: 'group',
        title: 'Green Line Monitoring',
        icon: technologyPlannerIcon,
        access: 'recipe_products',
        children: [
          {
            title: 'Height Data Monitoring',
            path: '/green_line_monitoring',
            icon: batchCalendarIcon,
            access: null,
          },
          {
            title: 'Temperature Data Monitoring',
            path: '/temperature_data_monitoring',
            icon: batchCalendarIcon,
            access: null,
          },
        ],
      },
    ],
    []
  );

  const isActive = (path) => location.pathname === path;

  const isGroupActive = (g) => g.children?.some((c) => isActive(c.path));

  const toggleGroup = (title) =>
    setOpenGroups((p) => ({ ...p, [title]: !p[title] }));

  const go = (path) => {
    navigate(path);
    if (isMobile()) closeDrawer();
  };

  if (!user) return <Outlet />;

  const sidebarClassName = [
    'bb-sidebar',
    isMobile() && drawerOpen ? 'bb-open' : '',
    isDesktop() && collapsed ? 'bb-collapsed' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="bb-page">
      {isMobile() && drawerOpen && (
        <div className="bb-sidebar-overlay" onClick={closeDrawer} />
      )}
      <aside className={sidebarClassName}>
        <div className="bb-brand" title="BAUBLOCK ERP">
          BAUBLOCK ERP
        </div>
        <div className="bb-sidebar-menu">
          <button
            className={`bb-sidebar-item ${isActive('/') ? 'bb-active' : ''}`}
            onClick={() => go('/')}
            type="button"
          >
            <span className="bb-sidebar-icon">
              <img src={homeIcon} alt="Home" className="bb-sidebar-icon-img" />
            </span>
            {!collapsed && <span>Main Page</span>}
          </button>

          {menuItems.map((it) => {
            if (it.type === 'group') {
              if (!canSee(it.access)) return null;
              const visibleChildren = it.children.filter((c) => canSee(c.access));
              if (!visibleChildren.length) return null;
              const expanded = openGroups[it.title] ?? isGroupActive(it);

              return (
                <div key={it.title} className="bb-group">
                  <button
                    className={`bb-sidebar-item bb-group-btn ${
                      isGroupActive(it) ? 'bb-active' : ''
                    }`}
                    type="button"
                    onClick={() => {
                      if (isDesktop() && collapsed) {
                        setCollapsed(false);
                        return;
                      }
                      toggleGroup(it.title);
                    }}
                  >
                    <span className="bb-sidebar-icon">
                      <img
                        src={it.icon}
                        alt={it.title}
                        className="bb-sidebar-icon-img"
                      />
                    </span>

                    {!collapsed && (
                      <>
                        <span className="bb-group-title">{it.title}</span>
                        <span className={`bb-chevron ${expanded ? 'open' : ''}`}>
                          ▾
                        </span>
                      </>
                    )}
                  </button>

                  {!collapsed && expanded && (
                    <div className="bb-group-children">
                      {visibleChildren.map((c) => (
                        <button
                          key={c.path}
                          className={`bb-sidebar-item bb-child ${
                            isActive(c.path) ? 'bb-active' : ''
                          }`}
                          type="button"
                          onClick={() => go(c.path)}
                        >
                          <span className="bb-sidebar-icon">
                            <img
                              src={c.icon}
                              alt={c.title}
                              className="bb-sidebar-icon-img"
                            />
                          </span>
                          <span>{c.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            if (!canSee(it.access)) return null;

            return (
              <button
                key={it.path}
                className={`bb-sidebar-item ${isActive(it.path) ? 'bb-active' : ''}`}
                onClick={() => go(it.path)}
                type="button"
              >
                <span className="bb-sidebar-icon">
                  <img
                    src={it.icon}
                    alt={it.title}
                    className="bb-sidebar-icon-img"
                  />
                </span>
                {!collapsed && <span>{it.title}</span>}
              </button>
            );
          })}
        </div>
      </aside>

      <main className="bb-main">
        <header className="bb-topbar">
          <div className="bb-topbar-left">
            <button
              className="bb-menu-btn"
              type="button"
              onClick={() => {
                if (isDesktop()) setCollapsed((v) => !v);
                else setDrawerOpen((v) => !v);
              }}
              aria-label="Open menu"
            >
              <img
                src={require('#components/Styles/mainpageing/logo-burger.png')}
                alt="Menu"
                className="bb-burger-icon"
              />
            </button>
          </div>

          <div className="bb-topbar-center">{title}</div>

          <div className="bb-topbar-right">
            <div className="bb-userbox">
              <div className="bb-username">{username}</div>
              <div className="bb-userrole">{userrole}</div>
            </div>
            <button className="bb-logout" onClick={handleLogout} type="button">
              Logout
            </button>
          </div>
        </header>

        <TabsBar />

        <div className="bb-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
