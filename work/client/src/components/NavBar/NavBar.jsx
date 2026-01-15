import React, { useMemo, useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { clearAccountingDataList } from '#components/redux/actions/ordersAction.js';
import { delUser } from '#components/redux/actions/userAction';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { useProjectContext } from '#components/contexts/Context.js';
import TabsBar from '#components/Main/TabsBar';
import '#components/Styles/dashboard.css';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const { roles, checkUserAccess } = useUsersContext();
  const { getPageTitleByPath, getRoleName } = useProjectContext();

  // мобилка: drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = () => setDrawerOpen(false);

  // десктоп: collapsed
  const [collapsed, setCollapsed] = useState(false);

  // раскрытие групп меню
  const [openGroups, setOpenGroups] = useState({});

  const isDesktop = () =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(min-width: 901px)').matches;

  const isMobile = () =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(max-width: 900px)').matches;

  // На десктопе: все страницы кроме "/" — по умолчанию свернуты
  // На мобилке: drawer закрывать при переходе
  useEffect(() => {
    if (isDesktop()) {
      setCollapsed(location.pathname !== '/');
    }
    if (isMobile()) {
      setDrawerOpen(false);
    }
  }, [location.pathname]);

  /* ---------- logout ---------- */
  const handleLogout = () => {
    dispatch(clearAccountingDataList());
    dispatch(delUser());
    window.localStorage.clear();
    localStorage.clear();
    navigate('/sign-in');
  };

  /* ---------- user info ---------- */
  const username =
    user?.username || user?.login || user?.name || user?.email || 'USER';

  const userrole = user ? getRoleName(user?.role) : '';
  const title = getPageTitleByPath(location.pathname);

  /* ---------- permissions ---------- */
  const canSee = (access) => {
    if (!access) return true;
    return !!checkUserAccess(user, roles, access)?.canRead;
  };

  /* ---------- menu ---------- */
  const menuItems = useMemo(
    () => [
      {
        type: 'group',
        title: 'Admin',
        icon: '🛡️',
        access: 'Users_info',
        children: [
          {
            title: 'Users Info',
            path: '/users_info',
            icon: '👥',
            access: 'Users_info',
          },
          { title: 'Roles', path: '/roles', icon: '🔑', access: 'Users_info' },
        ],
      },
      {
        type: 'group',
        title: 'Products catalog',
        icon: '🧱',
        access: null,
        children: [
          { title: 'Products catalog', path: '/products_type_journal', icon: '📦' },
          { title: 'Statistics', path: '/statistics', icon: '📊' },
        ],
      },
      { title: 'Clients', path: '/clients', icon: '🤝', access: 'Clients' },
      {
        title: 'Clients price groups',
        path: '/clients_price_info',
        icon: '🪙',
        access: 'Clients',
      },
      { title: 'Orders', path: '/orders', icon: '🧾', access: 'Orders' },
      {
        type: 'group',
        title: 'Ordered products pipeline',
        icon: '🚚',
        access: 'List_of_ordered_production',
        children: [
          {
            title: 'Ordered blocks pipeline',
            path: '/list_of_ordered_production',
            icon: '🧱',
          },
          {
            title: 'Ordered OEM blocks pipeline',
            path: '/list_of_ordered_production_oem',
            icon: '🏭',
          },
          {
            title: 'Related materials backorder list',
            path: '/related_materials_backorder_list',
            icon: '🧩',
          },
        ],
      },
      {
        type: 'group',
        title: 'Production planner',
        icon: '🗓️',
        access: 'production_batch_designer',
        children: [
          { title: 'Autoclave calendar', path: '/autoclave_calendar', icon: '♨️' },
          {
            title: 'Batch planner',
            path: '/production_batch_designer_new',
            icon: '🧪',
          },
        ],
      },
      {
        title: 'Batch calendar',
        path: '/batch_outside',
        icon: '📅',
        access: 'production_plan',
      },
      {
        type: 'group',
        title: 'Technology planner',
        icon: '🧠',
        access: 'recipe_products',
        children: [
          { title: 'Recipes catalog', path: '/recipe_products', icon: '📚' },
          { title: 'Batch recipe planner', path: '/raw_materials_plan', icon: '🧮' },
          { title: 'Raw material calendar', path: '/recipe_orders', icon: '🧱' },
          {
            title: 'Raw material consumption',
            path: '/raw_material_consumption',
            icon: '🧾',
          },
          { title: 'Lotes list', path: '/lotes_list', icon: '🏷️' },
        ],
      },
      {
        title: 'Quality management',
        path: '/quality_management',
        icon: '✅',
        access: 'quality_management',
      },
      {
        title: 'Warehouse',
        path: '/warehouse_products_type',
        icon: '🏬',
        access: 'Warehouse',
      },
      {
        title: 'Order dispatch',
        path: '/warehouse_manager',
        icon: '📤',
        access: 'warehouse_manager',
      },
      { title: 'Accounting', path: '/accounting', icon: '💰', access: 'accounting' },
    ],
    []
  );

  const isActive = (path) => location.pathname === path;
  const isGroupActive = (g) => g.children?.some((c) => isActive(c.path));

  const toggleGroup = (title) =>
    setOpenGroups((p) => ({ ...p, [title]: !p[title] }));

  // клики по пунктам: на мобилке закрываем drawer
  const go = (path) => {
    navigate(path);
    if (isMobile()) closeDrawer();
  };

  // ✅ render
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
      {/* overlay только на мобилке */}
      {isMobile() && drawerOpen && (
        <div className="bb-sidebar-overlay" onClick={closeDrawer} />
      )}

      {/* ===== SIDEBAR ===== */}
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
              <span className="bb-emoji" title="Main Page">
                🏠
              </span>
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
                      <span className="bb-emoji" title={it.title}>
                        {it.icon || '•'}
                      </span>
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

                  {/* детей показываем только когда НЕ collapsed */}
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
                            <span className="bb-emoji" title={c.title}>
                              {c.icon || '•'}
                            </span>
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
                  <span className="bb-emoji" title={it.title}>
                    {it.icon || '•'}
                  </span>
                </span>
                {!collapsed && <span>{it.title}</span>}
              </button>
            );
          })}
        </div>
      </aside>

      {/* ===== MAIN ===== */}
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
