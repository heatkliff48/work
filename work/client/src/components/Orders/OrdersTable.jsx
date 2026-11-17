import { useProjectContext } from '#components/contexts/Context.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { getCurrentProductsOfOrders } from '#components/redux/actions/ordersAction.js';
import Table from '../Table/Table';
import { useOrderContext } from '../contexts/OrderContext';
import AddClientOrderModal from './modal/AddClientOrderModal';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { getApiUrl } from '#utils/getApiUrl.js';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RandomAhhOrder from './RandomAhhOrder';
import { ArticleMonoCell, makeStatusPillCell } from './ordersCells';
import { statusLabel } from './ordersI18n.js';
import { buildOrdersSearchIndex, makeOrdersGlobalFilter } from './ordersSearch.js';
import './ordersView.css';
import {
  getAllClients,
  getAllContactInfo,
  getAllDeliveryAddresses,
  getLegalAddress,
} from '#components/redux/actions/clientAction.js';

function OrdersTable() {
  const {
    COLUMNS_ORDERS,
    getCurrentOrderInfoHandler,
    setProductOfOrder,
    setNewOrder,
    ordersDataList,
    status_list,
    randomOrderCheck,
    setRandomOrderCheck,
    list_of_orders,
  } = useOrderContext();
  const { clientModalOrder, setClientModalOrder } = useModalContext();
  const { setCurrentClient, categoryOptions, priceCategoryOptions } =
    useProjectContext();
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  const { t } = useTranslation('orders');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const clients = useSelector((state) => state.clients);
  const deliveryAddresses = useSelector((state) => state.deliveryAddresses);
  const contactInfos = useSelector((state) => state.contactInfo);

  // Фильтры заказов
  const [statusFilter, setStatusFilter] = useState('all');
  const [personFilter, setPersonFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');

  // В redux лежит юр. адрес только одного (текущего) клиента,
  // для поиска берём все — локально, чтобы не перетирать state
  const [legalAddresses, setLegalAddresses] = useState([]);
  useEffect(() => {
    axios
      .get(`${getApiUrl()}/clientsAddress`, { withCredentials: true })
      .then((res) => setLegalAddresses(res.data?.legalAddress || []))
      .catch((err) => console.error(err.message));
  }, []);

  // Поиск и по данным клиента заказа (клиент, юр. адрес, проект,
  // контакты), а не только по колонкам таблицы
  const ordersGlobalFilter = useMemo(
    () =>
      makeOrdersGlobalFilter(
        buildOrdersSearchIndex(list_of_orders, {
          clients,
          legalAddresses,
          deliveryAddresses,
          contactInfos,
          categoryOptions,
          priceCategoryOptions,
        })
      ),
    [list_of_orders, clients, legalAddresses, deliveryAddresses, contactInfos]
  );

  // Статусы с переведённым Header: по нему пилюля находит цвет
  // в переведённых данных таблицы
  const translatedStatusList = useMemo(
    () =>
      (status_list || []).map((s) => ({
        ...s,
        Header: statusLabel(t, s.accessor, s.Header),
      })),
    [status_list, t]
  );

  // Только вид: подмешиваем Cell-рендереры поверх уже существующих
  // колонок из контекста (accessor/данные не трогаем).
  const StatusPillCell = useMemo(
    () => makeStatusPillCell(translatedStatusList),
    [translatedStatusList]
  );
  const displayColumns = useMemo(
    () =>
      (COLUMNS_ORDERS || []).map((col) => {
        const Header = t(`columns.${col.accessor}`, { defaultValue: col.Header });
        if (col.accessor === 'article')
          return { ...col, Header, Cell: ArticleMonoCell };
        if (col.accessor === 'status')
          return { ...col, Header, Cell: StatusPillCell };
        return { ...col, Header };
      }),
    [COLUMNS_ORDERS, StatusPillCell, t]
  );

  // В ordersDataList статус — английский Header из status_list (его же
  // использует Accounting), а ответственного нет — 'None'
  const tableData = useMemo(
    () =>
      (ordersDataList || []).map((o) => {
        const statusDef = (status_list || []).find((s) => s.Header === o.status);
        return {
          ...o,
          statusDef,
          statusAccessor: statusDef?.accessor,
          rawStatus: o.status,
          rawPersonInCharge: o.person_in_charge,
          status: statusDef
            ? statusLabel(t, statusDef.accessor, o.status)
            : o.status,
          person_in_charge:
            o.person_in_charge === 'None' ? t('none') : o.person_in_charge,
        };
      }),
    [ordersDataList, status_list, t]
  );

  // Опции для фильтра по статусу
  const statusChoices = useMemo(() => {
    const list = [
      {
        value: 'all',
        label: t('filters.allStatuses', { defaultValue: 'All statuses' }),
      },
      {
        value: 'in_production',
        label: t('filters.inProduction', { defaultValue: 'In production (all)' }),
      },
    ];
    (status_list || []).forEach((s) => {
      list.push({
        value: String(s.accessor),
        label: statusLabel(t, s.accessor, s.Header),
      });
    });
    return list;
  }, [status_list, t]);

  // Опции для фильтра по ответственным (менеджерам)
  const personChoices = useMemo(() => {
    const seen = new Set();
    const people = [];
    let hasNone = false;

    (ordersDataList || []).forEach((o) => {
      const person = o.person_in_charge;
      if (!person || person === 'None') {
        hasNone = true;
      } else if (!seen.has(person)) {
        seen.add(person);
        people.push(person);
      }
    });

    people.sort((a, b) => a.localeCompare(b));

    const list = [
      {
        value: 'all',
        label: t('filters.allPersonsInCharge', {
          defaultValue: 'All managers',
        }),
      },
    ];

    people.forEach((p) => {
      list.push({ value: p, label: p });
    });

    if (hasNone) {
      list.push({
        value: 'None',
        label: t('filters.unassigned', { defaultValue: t('none') }),
      });
    }

    return list;
  }, [ordersDataList, t]);

  // Опции для фильтра по клиентам
  const clientChoices = useMemo(() => {
    const seen = new Set();
    const list = [
      {
        value: 'all',
        label: t('filters.allClients', { defaultValue: 'All clients' }),
      },
    ];

    (ordersDataList || []).forEach((o) => {
      const name = o.owner?.trim();
      if (name && !seen.has(name)) {
        seen.add(name);
      }
    });

    Array.from(seen)
      .sort((a, b) => a.localeCompare(b))
      .forEach((name) => {
        list.push({ value: name, label: name });
      });

    return list;
  }, [ordersDataList, t]);

  // Применение фильтров к данным таблицы
  const visibleData = useMemo(() => {
    return (tableData || []).filter((row) => {
      // 1. Фильтр по статусу
      if (statusFilter !== 'all') {
        if (statusFilter === 'in_production') {
          const acc = row.statusAccessor;
          if (!(acc >= 6 && acc < 9)) return false;
        } else {
          const matchesAccessor =
            row.statusAccessor !== undefined &&
            String(row.statusAccessor) === statusFilter;
          const matchesRawStatus =
            row.rawStatus !== undefined &&
            String(row.rawStatus) === statusFilter;
          const matchesHeader =
            row.statusDef && row.statusDef.Header === statusFilter;

          if (!matchesAccessor && !matchesRawStatus && !matchesHeader) {
            return false;
          }
        }
      }

      // 2. Фильтр по ответственному
      if (personFilter !== 'all') {
        if (personFilter === 'None') {
          if (row.rawPersonInCharge && row.rawPersonInCharge !== 'None') {
            return false;
          }
        } else {
          if (row.rawPersonInCharge !== personFilter) {
            return false;
          }
        }
      }

      // 3. Фильтр по клиенту
      if (clientFilter !== 'all') {
        if (row.owner !== clientFilter) {
          return false;
        }
      }

      return true;
    });
  }, [tableData, statusFilter, personFilter, clientFilter]);

  const hasActiveFilters =
    statusFilter !== 'all' || personFilter !== 'all' || clientFilter !== 'all';

  const resetFilters = (clearSearchFn) => {
    setStatusFilter('all');
    setPersonFilter('all');
    setClientFilter('all');
    if (typeof clearSearchFn === 'function') {
      clearSearchFn(undefined);
    }
  };

  const totalCount = ordersDataList?.length || 0;
  const inProductionCount = useMemo(() => {
    return (ordersDataList || []).filter((o) => {
      const statusDef = (status_list || []).find((s) => s.Header === o.status);
      const n = statusDef?.accessor;
      return n >= 6 && n < 9;
    }).length;
  }, [ordersDataList, status_list]);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Orders');
      setUserAccess(access);

      if (!access?.canRead) {
        navigate('/'); // Перенаправление на главную страницу, если нет прав на чтение
      }
    }
  }, [user, roles]);

  useEffect(() => {
    setProductOfOrder({});
    setNewOrder({});
    setCurrentClient({});
    setRandomOrderCheck(false);
  }, [clientModalOrder]);

  useEffect(() => {
    dispatch(getAllDeliveryAddresses());
    dispatch(getAllClients());
    dispatch(getAllContactInfo());
  }, []);

  return (
    <>
      {clientModalOrder && (
        <AddClientOrderModal
          isOpen={clientModalOrder}
          toggle={() => setClientModalOrder(!clientModalOrder)}
        />
      )}
      {/* <RandomAhhOrder /> */}
      <div className="ord-page">
        <div className="ord-page__head">
          <div>
            <div className="ord-page__eyebrow">{t('eyebrow')}</div>
            <h1 className="ord-page__title">{t('title')}</h1>
          </div>
          <div className="ord-page__stats">
            <div
              className={`ord-stat ord-stat--clickable${
                statusFilter === 'all' && !hasActiveFilters
                  ? ' ord-stat--active'
                  : ''
              }`}
              onClick={() => setStatusFilter('all')}
              title={t('filters.showAll', { defaultValue: 'Show all orders' })}
            >
              <div className="ord-stat__num">{totalCount}</div>
              <div className="ord-stat__label">{t('totalOrders')}</div>
            </div>
            <div className="ord-stat__divider" />
            <div
              className={`ord-stat ord-stat--clickable${
                statusFilter === 'in_production' ? ' ord-stat--active' : ''
              }`}
              onClick={() => {
                setStatusFilter((prev) =>
                  prev === 'in_production' ? 'all' : 'in_production'
                );
              }}
              title={t('filters.inProduction', { defaultValue: 'In production' })}
            >
              <div className="ord-stat__num">{inProductionCount}</div>
              <div className="ord-stat__label">{t('inProduction')}</div>
            </div>
          </div>
        </div>

        <Table
          COLUMN_DATA={displayColumns}
          dataOfTable={visibleData}
          userAccess={userAccess}
          tableName={t('title')}
          variant="card"
          hideTitle
          emptyTitle={
            hasActiveFilters
              ? t('filters.noMatchingOrders', {
                  defaultValue: 'No orders match your filters',
                })
              : t('emptyTitle')
          }
          emptySubtitle={
            hasActiveFilters
              ? t('filters.tryResetFilters', {
                  defaultValue:
                    'Try changing or resetting your filters to see more orders.',
                })
              : t('emptySubtitle')
          }
          globalFilter={ordersGlobalFilter}
          handleRowClick={(row) => {
            console.log('row.original', row.original);
            getCurrentOrderInfoHandler(row.original);
            dispatch(getCurrentProductsOfOrders(row.original.id));
            navigate('/order_card');
          }}
          renderToolbar={({ globalFilter, setGlobalFilter }) => (
            <div className="ord-toolbar">
              <div className="ord-search">
                <svg
                  className="ord-search__ic"
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
                  className="ord-search__input"
                  placeholder={t('searchPlaceholder')}
                  value={globalFilter || ''}
                  onChange={(e) => setGlobalFilter(e.target.value || undefined)}
                />
                {globalFilter && (
                  <button
                    type="button"
                    className="ord-search__clear"
                    onClick={() => setGlobalFilter(undefined)}
                    aria-label="Clear search"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                )}
              </div>

              <select
                className={`ord-select${
                  statusFilter !== 'all' ? ' ord-select--active' : ''
                }`}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label={t('filters.allStatuses', { defaultValue: 'Status' })}
              >
                {statusChoices.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <select
                className={`ord-select${
                  personFilter !== 'all' ? ' ord-select--active' : ''
                }`}
                value={personFilter}
                onChange={(e) => setPersonFilter(e.target.value)}
                aria-label={t('filters.allPersonsInCharge', {
                  defaultValue: 'Manager',
                })}
              >
                {personChoices.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {clientChoices.length > 2 && (
                <select
                  className={`ord-select${
                    clientFilter !== 'all' ? ' ord-select--active' : ''
                  }`}
                  value={clientFilter}
                  onChange={(e) => setClientFilter(e.target.value)}
                  aria-label={t('filters.allClients', { defaultValue: 'Client' })}
                >
                  {clientChoices.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}

              {(hasActiveFilters || Boolean(globalFilter)) && (
                <button
                  type="button"
                  className="ord-btn--reset"
                  onClick={() => resetFilters(setGlobalFilter)}
                  title={t('filters.reset', { defaultValue: 'Reset filters' })}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                  {t('filters.reset', { defaultValue: 'Reset' })}
                </button>
              )}

              <div className="ord-toolbar__spacer" />
              {userAccess?.canWrite && (
                <button
                  type="button"
                  className="ord-btn ord-btn--primary"
                  onClick={() => setClientModalOrder(!clientModalOrder)}
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 6h16" />
                    <path d="M4 6 5.5 16.5a2 2 0 0 0 2 1.7h9a2 2 0 0 0 2-1.7L20 6" />
                    <path d="M9 12h6" />
                    <path d="M12 9v6" />
                  </svg>
                  {t('addNewOrder')}
                </button>
              )}
            </div>
          )}
        />
      </div>
    </>
  );
}
export default OrdersTable;
