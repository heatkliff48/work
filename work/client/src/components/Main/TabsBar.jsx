import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUsersContext } from '#components/contexts/UserContext.js';
import '#components/Styles/tabsbar.css';
import { useSelector } from 'react-redux';

const STORAGE_KEY = 'app_tabs_v1';

const PATH_LABELS = {
  '/': 'Home',
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
  if (!path) return 'untitled';
  if (PATH_LABELS[path]) return PATH_LABELS[path];

  const bestPrefix = Object.keys(PATH_LABELS)
    .filter((k) => k !== '/' && path.startsWith(k))
    .sort((a, b) => b.length - a.length)[0];
  if (bestPrefix) return PATH_LABELS[bestPrefix];

  const seg = (path.split('/').filter(Boolean).pop() || 'Home')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return seg || 'untitled';
}

function genId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 't_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function TabsBar() {
  // ✅ Hooks must be called unconditionally
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const { roles, checkUserAccess } = useUsersContext();

  const [tabs, setTabs] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const migrated = Array.isArray(parsed)
          ? parsed.map((t) => ({
              id: t.id || genId(),
              path: t.path,
              title: t.title || normalizeLabel(t.path),
            }))
          : [];
        if (migrated.length) return migrated;
      }
    } catch {}
    return [
      {
        id: genId(),
        path: location.pathname || '/',
        title: normalizeLabel(location.pathname || '/'),
      },
    ];
  });

  const [activeId, setActiveId] = useState(() => {
    const match = tabs.find((t) => t.path === location.pathname);
    return match ? match.id : tabs[0]?.id;
  });

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs));
    } catch {}
  }, [tabs]);

  // keep active tab in sync with route (update active tab's path/title)
  useEffect(() => {
    setTabs((prev) => {
      if (!prev.length) {
        const newTab = {
          id: genId(),
          path: location.pathname,
          title: normalizeLabel(location.pathname),
        };
        setActiveId(newTab.id);
        return [newTab];
      }

      const current = prev.find((t) => t.id === activeId) || prev[0];
      if (!current) return prev;

      const nextTitle = normalizeLabel(location.pathname);
      if (current.path === location.pathname && current.title === nextTitle)
        return prev;

      return prev.map((t) =>
        t.id === current.id ? { ...t, path: location.pathname, title: nextTitle } : t
      );
    });
  }, [location.pathname, activeId]);

  const activateTab = (id) => {
    const t = tabs.find((x) => x.id === id);
    if (!t) return;
    setActiveId(id);
    if (t.path && t.path !== location.pathname) navigate(t.path);
  };

  const closeTab = (idToClose, e) => {
    e?.stopPropagation();
    setTabs((prev) => {
      const idx = prev.findIndex((t) => t.id === idToClose);
      if (idx === -1) return prev;

      const next = [...prev.slice(0, idx), ...prev.slice(idx + 1)];

      if (activeId === idToClose) {
        const neighbor = next[idx - 1] || next[idx] || null;
        if (neighbor) {
          setActiveId(neighbor.id);
          if (neighbor.path && neighbor.path !== location.pathname)
            navigate(neighbor.path);
        } else {
          const home = { id: genId(), path: '/', title: normalizeLabel('/') };
          setActiveId(home.id);
          navigate(home.path);
          return [home];
        }
      }

      return next.length
        ? next
        : [{ id: genId(), path: '/', title: normalizeLabel('/') }];
    });
  };

  const duplicateCurrent = () => {
    if (!tabs.length) {
      const t = {
        id: genId(),
        path: location.pathname,
        title: normalizeLabel(location.pathname),
      };
      setTabs([t]);
      setActiveId(t.id);
      return;
    }
    const current = tabs.find((t) => t.id === activeId) || tabs[0];
    const clone = {
      id: genId(),
      path: current.path,
      title: normalizeLabel(current.path),
    };
    setTabs((prev) => {
      const idx = prev.findIndex((t) => t.id === current.id);
      return [...prev.slice(0, idx + 1), clone, ...prev.slice(idx + 1)];
    });
    setActiveId(clone.id);
  };

  // ✅ hide on dashboard after hooks
  if (!user) return null;

  return (
    <div className="tabsbar-container">
      <div className="tabsbar-left">
        <button
          className="tabsbar-add-current"
          title="Duplicate current tab"
          onClick={duplicateCurrent}
        >
          + Add current
        </button>
      </div>

      <div className="tabsbar-scroll">
        {tabs.map((t) => (
          <div
            key={t.id}
            className={`tab-item ${activeId === t.id ? 'active' : ''}`}
            onClick={() => activateTab(t.id)}
            title={t.title}
          >
            <span className="tab-title">{t.title}</span>
            <button className="tab-close" onClick={(e) => closeTab(t.id, e)}>
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
