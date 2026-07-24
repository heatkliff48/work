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
import RandomAhhOrder from './RandomAhhOrder';
import { ArticleMonoCell, makeStatusPillCell } from './ordersCells';
import './ordersView.css';

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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);

  // Только вид: подмешиваем Cell-рендереры поверх уже существующих
  // колонок из контекста (accessor/данные не трогаем).
  const StatusPillCell = useMemo(
    () => makeStatusPillCell(status_list),
    [status_list],
  );
  const displayColumns = useMemo(
    () =>
      (COLUMNS_ORDERS || []).map((col) => {
        if (col.accessor === 'article')
          return { ...col, Cell: ArticleMonoCell };
        if (col.accessor === 'status') return { ...col, Cell: StatusPillCell };
        return col;
      }),
    [COLUMNS_ORDERS, StatusPillCell],
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
            <div className="ord-page__eyebrow">Sales</div>
            <h1 className="ord-page__title">Orders</h1>
          </div>
          <div className="ord-page__stats">
            <div className="ord-stat">
              <div className="ord-stat__num">{totalCount}</div>
              <div className="ord-stat__label">Total orders</div>
            </div>
            <div className="ord-stat__divider" />
            <div className="ord-stat">
              <div className="ord-stat__num">{inProductionCount}</div>
              <div className="ord-stat__label">In production</div>
            </div>
          </div>
        </div>

        <Table
          COLUMN_DATA={displayColumns}
          dataOfTable={ordersDataList}
          userAccess={userAccess}
          tableName={'Orders'}
          variant="card"
          hideTitle
          emptyTitle="No orders match your search"
          emptySubtitle="Try a different order number, client or project name."
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
                  placeholder="Search by order, client or project…"
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
                  Add new order
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
