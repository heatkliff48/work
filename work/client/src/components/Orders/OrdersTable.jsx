import { useProjectContext } from '#components/contexts/Context.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { getCurrentProductsOfOrders } from '#components/redux/actions/ordersAction.js';
import Table from '../Table/Table';
import { useOrderContext } from '../contexts/OrderContext';
import AddClientOrderModal from './modal/AddClientOrderModal';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RandomAhhOrder from './RandomAhhOrder';
import { ArticleMonoCell, makeStatusPillCell } from './ordersCells';
import { statusLabel } from './ordersI18n.js';
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
  } = useOrderContext();
  const { clientModalOrder, setClientModalOrder } = useModalContext();
  const { setCurrentClient } = useProjectContext();
  const { roles, checkUserAccess, userAccess, setUserAccess } =
    useUsersContext();

  const { t } = useTranslation('orders');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);

  // Статусы с переведённым Header: по нему пилюля находит цвет
  // в переведённых данных таблицы
  const translatedStatusList = useMemo(
    () =>
      (status_list || []).map((s) => ({
        ...s,
        Header: statusLabel(t, s.accessor, s.Header),
      })),
    [status_list, t],
  );

  // Только вид: подмешиваем Cell-рендереры поверх уже существующих
  // колонок из контекста (accessor/данные не трогаем).
  const StatusPillCell = useMemo(
    () => makeStatusPillCell(translatedStatusList),
    [translatedStatusList],
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
    [COLUMNS_ORDERS, StatusPillCell, t],
  );

  // В ordersDataList статус — английский Header из status_list (его же
  // использует Accounting), а ответственного нет — 'None'
  const tableData = useMemo(
    () =>
      (ordersDataList || []).map((o) => {
        const statusDef = (status_list || []).find((s) => s.Header === o.status);
        return {
          ...o,
          status: statusDef ? statusLabel(t, statusDef.accessor, o.status) : o.status,
          person_in_charge:
            o.person_in_charge === 'None' ? t('none') : o.person_in_charge,
        };
      }),
    [ordersDataList, status_list, t],
  );

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
    dispatch(getLegalAddress());
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
            <div className="ord-stat">
              <div className="ord-stat__num">{totalCount}</div>
              <div className="ord-stat__label">{t('totalOrders')}</div>
            </div>
            <div className="ord-stat__divider" />
            <div className="ord-stat">
              <div className="ord-stat__num">{inProductionCount}</div>
              <div className="ord-stat__label">{t('inProduction')}</div>
            </div>
          </div>
        </div>

        <Table
          COLUMN_DATA={displayColumns}
          dataOfTable={tableData}
          userAccess={userAccess}
          tableName={t('title')}
          variant="card"
          hideTitle
          emptyTitle={t('emptyTitle')}
          emptySubtitle={t('emptySubtitle')}
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
              </div>
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
