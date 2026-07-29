// import { useUsersContext } from '#components/contexts/UserContext.js';
import { getCurrentProductsOfOrders } from '#components/redux/actions/ordersAction.js';
import Table from '../Table/Table';
import { useOrderContext } from '../contexts/OrderContext';
import AccountngOrderCard from './AccountngOrderCard';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ArticleMonoCell, makeStatusPillCell } from '../Orders/ordersCells';
import './accountingView.css';
// import { useNavigate } from 'react-router-dom';

function DateCell({ value }) {
  if (!value) return <span className="ord-muted">—</span>;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return <span>{value}</span>;
  return (
    <span>
      {d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })}
    </span>
  );
}

function Accounting() {
  // const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    ordersDataList,
    storedData,
    status_list,
    setStoredData,
    accountingDataList,
    accDataList,
    setAccDataList,
    getCurrentOrderInfoHandler,
  } = useOrderContext();

  // const { user, roles, checkUserAccess, userAccess, setUserAccess } =
  //   useUsersContext();

  // useEffect(() => {
  //   if (user && roles.length > 0) {
  //     const access = checkUserAccess(user, roles, 'Orders');
  //     setUserAccess(access);

  //     if (!access?.canRead) {
  //       navigate('/');
  //     }
  //   }
  // }, [user, roles]);

  useEffect(() => {
    const result = accountingDataList
      .filter((el) => !el.aproved)
      .map((item) => {
        const status = status_list.find((el) => {
          return el.accessor == item.orders_status;
        });
        const order = ordersDataList.find(
          (el) => el.article === item.orders_article
        );

        return {
          ...item,
          orders_status: status ? status.Header : item.orders_status,
          owner: order?.owner || '',
          shipping_date: order?.shipping_date || '',
        };
      });
    setAccDataList(result);
  }, [accountingDataList, ordersDataList, status_list]);

  const [statusFilter, setStatusFilter] = useState('all');

  const statusChoices = useMemo(() => {
    const labels = Array.from(
      new Set((accDataList || []).map((o) => o.orders_status).filter(Boolean))
    );
    return [
      { value: 'all', label: 'All statuses' },
      ...labels.map((label) => ({ value: label, label })),
    ];
  }, [accDataList]);

  const visibleData = useMemo(() => {
    if (statusFilter === 'all') return accDataList || [];
    return (accDataList || []).filter((o) => o.orders_status === statusFilter);
  }, [accDataList, statusFilter]);

  const displayColumns = useMemo(() => {
    const StatusPillCell = makeStatusPillCell(status_list);
    return [
      {
        Header: 'Order',
        accessor: 'orders_article',
        disableSortBy: true,
        Cell: ArticleMonoCell,
      },
      {
        Header: 'Client',
        accessor: 'owner',
        disableSortBy: true,
      },
      {
        Header: 'Status',
        accessor: 'orders_status',
        disableSortBy: true,
        Cell: StatusPillCell,
      },
      {
        Header: 'Shipping date',
        accessor: 'shipping_date',
        disableSortBy: true,
        Cell: DateCell,
      },
    ];
  }, [status_list]);

  return (
    <>
      {storedData === null ? (
        <div className="acc-page">
          <div className="acc-page__head">
            <div>
              <div className="acc-page__eyebrow">Finance</div>
              <h1 className="acc-page__title">Accounting</h1>
            </div>
            <div className="acc-page__stats">
              <div className="acc-stat">
                <div className="acc-stat__num">{accDataList?.length ?? 0}</div>
                <div className="acc-stat__label">Pending review</div>
              </div>
            </div>
          </div>

          <Table
            COLUMN_DATA={displayColumns}
            dataOfTable={visibleData}
            variant="card"
            hideTitle
            emptyTitle="No accounting entries match your search"
            emptySubtitle="Try a different order number, client or status."
            handleRowClick={(row) => {
              const order = ordersDataList.find(
                (el) => el.article === row.original.orders_article
              );
              getCurrentOrderInfoHandler(order);
              setStoredData(row.original);
              dispatch(getCurrentProductsOfOrders(order.id));
            }}
            renderToolbar={({ globalFilter, setGlobalFilter }) => (
              <div className="acc-toolbar">
                <div className="acc-search">
                  <svg
                    className="acc-search__ic"
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9aa0ac"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <circle cx="11" cy="11" r="7"></circle>
                    <path d="m20 20-3.2-3.2"></path>
                  </svg>
                  <input
                    type="text"
                    className="acc-search__input"
                    placeholder="Search by order article or client…"
                    value={globalFilter || ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                  />
                </div>
                <select
                  className="acc-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statusChoices.map((choice) => (
                    <option key={choice.value} value={choice.value}>
                      {choice.label}
                    </option>
                  ))}
                </select>
                <div className="acc-toolbar__spacer" />
              </div>
            )}
          />
        </div>
      ) : (
        <AccountngOrderCard />
      )}
    </>
  );
}
export default Accounting;
