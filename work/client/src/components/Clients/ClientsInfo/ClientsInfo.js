import React, { Fragment, useEffect, useMemo, useState, createContext } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MydModalWithGrid from './ClientFullModal.js';
import ShowClientsModal from './ClientsInfoModal.js';
import { useProjectContext } from '#components/contexts/Context.js';
import Table from '#components/Table/Table';
import { useUsersContext } from '#components/contexts/UserContext.js';
import './clientsDrawer.css';

export const ClientContext = createContext();

const ClientsInfo = () => {
  const [modalShow, setModalShow] = useState(false);
  const {
    setCurrentClient,
    clients_info_table,
    clientsDataList,
    setClientsDataList,
    categoryOptions,
    priceCategoryOptions,
  } = useProjectContext();
  const { roles, checkUserAccess, userAccess, setUserAccess } =
    useUsersContext();

  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const clients = useSelector((state) => state.clients);

  // фильтр категории — чисто на уровне вида, поверх уже загруженных данных
  const [categoryFilter, setCategoryFilter] = useState('all');

  const clientHandler = (id) => {
    const client = clients.find((el) => el.id === id);
    setCurrentClient(client);
    setModalShow(true);
  };

  useEffect(() => {
    if (clients) {
      const newData = clients.map((client) => {
        return {
          ...client,
          category:
            categoryOptions.find((option) => option.value == client.category)
              ?.label || client.category,
          price_category:
            priceCategoryOptions.find(
              (option) => option.value == client.price_category,
            )?.label || client.price_category,
        };
      });
      setClientsDataList(newData);
    }
  }, [clients]);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Clients');
      setUserAccess(access);

      if (!access?.canRead) {
        navigate('/');
      }
    }
  }, [user, roles]);

  // список категорий для селекта — из уже имеющихся данных
  const categoryChoices = useMemo(() => {
    const seen = new Set();
    const opts = [{ value: 'all', label: 'All categories' }];
    (clientsDataList || []).forEach((c) => {
      const label = c.category;
      if (label && !seen.has(label)) {
        seen.add(label);
        opts.push({ value: label, label });
      }
    });
    return opts;
  }, [clientsDataList]);

  // применяем фильтр категории (вид)
  const visibleData = useMemo(() => {
    if (categoryFilter === 'all') return clientsDataList || [];
    return (clientsDataList || []).filter((c) => c.category === categoryFilter);
  }, [clientsDataList, categoryFilter]);

  const totalCount = (clientsDataList || []).length;
  const categoryCount = Math.max(categoryChoices.length - 1, 0);

  return (
    <Fragment>
      <div className="cl-page">
        <div className="cl-page__head">
          <div>
            <div className="cl-page__eyebrow">Sales · Directory</div>
            <h1 className="cl-page__title">Clients</h1>
          </div>
          <div className="cl-page__stats">
            <div className="cl-stat">
              <div className="cl-stat__num">{totalCount}</div>
              <div className="cl-stat__label">Total clients</div>
            </div>
            <div className="cl-stat__divider" />
            <div className="cl-stat">
              <div className="cl-stat__num">{categoryCount}</div>
              <div className="cl-stat__label">Categories</div>
            </div>
          </div>
        </div>

        <Table
          COLUMN_DATA={clients_info_table}
          dataOfTable={visibleData}
          tableName={'Clients'}
          userAccess={userAccess}
          variant="card"
          hideTitle
          handleRowClick={(row) => {
            clientHandler(row.original.id);
          }}
          renderToolbar={({ globalFilter, setGlobalFilter }) => (
            <div className="cl-toolbar">
              <div className="cl-search">
                <svg
                  className="cl-search__ic"
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9aa0ac"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.2-3.2" />
                </svg>
                <input
                  type="text"
                  className="cl-search__input"
                  placeholder="Search by name or CIF/VAT…"
                  value={globalFilter || ''}
                  onChange={(e) => setGlobalFilter(e.target.value || undefined)}
                />
              </div>

              <select
                className="cl-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categoryChoices.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <div className="cl-toolbar__spacer" />

              {/* {userAccess?.canWrite && (
                <button type="button" className="cl-btn cl-btn--primary cl-btn--new">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M12 5v14" /><path d="M5 12h14" />
                  </svg>
                  New client
                </button>
              )} */}
            </div>
          )}
        />
      </div>

      <MydModalWithGrid show={modalShow} onHide={() => setModalShow(false)} />
    </Fragment>
  );
};

export default ClientsInfo;
