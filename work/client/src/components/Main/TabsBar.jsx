import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUsersContext } from '#components/contexts/UserContext.js';
import '#components/Styles/tabsbar.css';

const STORAGE_KEY = 'app_tabs_v1';

const PATH_LABELS = {
  '/users_info': 'Users Info',
  '/roles': 'Roles',
  '/warehouse_manager': 'Order dispatch',
  '/products_type_journal': 'Products Type Journal',
  '/statistics': 'Statistics',
  '/orders': 'Orders',
  '/accounting': 'Accounting',
  '/clients': 'Clients',
  '/warehouse_products_type': 'Warehouse',
  '/production_batch_designer_new': 'Batch planner New',
  '/autoclave_calendar': 'Autoclave Calendar',
  '/list_of_ordered_production': 'Ordered pipeline',
  '/list_of_ordered_production_oem': 'Ordered OEM pipeline',
  '/related_materials_backorder_list': 'Related mat backorder',
  '/batch_outside': 'Batch calendar',
  '/recipe_products': 'Recipe products',
  '/raw_materials_plan': 'Raw Materials Plan',
  '/recipe_orders': 'Raw material calendar',
  '/quality_management': 'Quality Management',
};

function normalizeLabel(path) {
  return PATH_LABELS[path] || path || 'untitled';
}

export default function TabsBar() {
  const location = useLocation();
  const navigate = useNavigate();

  // контекст (без условного вызова хуков)
  let roles = null;
  let checkUserAccess = () => ({ canRead: true });
  try {
    const usersCtx = useUsersContext();
    if (usersCtx) {
      roles = usersCtx.roles ?? null;
      checkUserAccess = usersCtx.checkUserAccess ?? (() => ({ canRead: true }));
    }
  } catch (err) {
    roles = null;
    checkUserAccess = () => ({ canRead: true });
  }

  const initial = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [{ path: '/', title: 'Home' }];
  };

  const [tabs, setTabs] = useState(initial);
  const [active, setActive] = useState(location.pathname);

  // при смене location обновляем активную вкладку
  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  // сохраняем tabs в localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs));
  }, [tabs]);

  // --- ВАЖНО: авто-добавление текущего пути в tabs
  useEffect(() => {
    // не добавляем пустой root если он уже есть
    const path = location.pathname;
    if (!path) return;

    // Если у тебя динамические роуты (/orders/123), и хочешь группировать их по /orders,
    // можно нормализовать path: const key = path.split('/').slice(0,2).join('/') || path;
    const key = path;

    setTabs((prev) => {
      if (prev.find((t) => t.path === key)) return prev;
      return [...prev, { path: key, title: normalizeLabel(key) }];
    });
    // не навигируем здесь — просто добавляем запись в панель
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]); // выполняем при каждом изменении маршрута

  const addTab = (path, title) => {
    if (!path) return;
    setTabs((prev) => {
      if (prev.find((t) => t.path === path)) return prev;
      return [...prev, { path, title: title || normalizeLabel(path) }];
    });
    navigate(path);
  };

  const closeTab = (pathToClose, e) => {
    e?.stopPropagation();
    setTabs((prev) => {
      const idx = prev.findIndex((t) => t.path === pathToClose);
      if (idx === -1) return prev;
      const next = [...prev.slice(0, idx), ...prev.slice(idx + 1)];
      if (active === pathToClose) {
        const newActive =
          (next[idx - 1] && next[idx - 1].path) || (next[0] && next[0].path) || '/';
        navigate(newActive);
      }
      return next.length ? next : [{ path: '/', title: 'Home' }];
    });
  };

  const activateTab = (path) => navigate(path);

  const quickEntries = useMemo(() => {
    const items = Object.keys(PATH_LABELS).map((p) => ({
      path: p,
      title: PATH_LABELS[p],
    }));
    if (checkUserAccess && roles) {
      return items.filter(
        (it) => checkUserAccess(null, roles, it.title)?.canRead || true
      );
    }
    return items;
  }, [roles, checkUserAccess]);

  return (
    <div className="tabsbar-container">
      <div className="tabsbar-left">
        <button
          className="tabsbar-add-current"
          title="Add current page to tabs"
          onClick={() =>
            addTab(
              location.pathname,
              document.title || normalizeLabel(location.pathname)
            )
          }
        >
          + Add current
        </button>
      </div>

      <div className="tabsbar-scroll">
        {tabs.map((t) => (
          <div
            key={t.path}
            className={`tab-item ${active === t.path ? 'active' : ''}`}
            onClick={() => activateTab(t.path)}
            title={t.title}
          >
            <span className="tab-title">{t.title}</span>
            <button className="tab-close" onClick={(e) => closeTab(t.path, e)}>
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="tabsbar-right">
        <div className="dropdown-quick">
          <label className="quick-label">Quick:</label>
          <select
            onChange={(e) => {
              const p = e.target.value;
              if (!p) return;
              addTab(p, normalizeLabel(p));
              e.target.selectedIndex = 0;
            }}
            defaultValue=""
          >
            <option value="" disabled>
              Add...
            </option>
            {quickEntries.map((it) => (
              <option key={it.path} value={it.path}>
                {it.title}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
