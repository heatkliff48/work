import React, { Fragment, useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useOrderContext } from '../../contexts/OrderContext';
import { useProjectContext } from '#components/contexts/Context.js';
import DeliveryAddress from '#components/Clients/DeliveryAddress/DeliveryAddress.js';
import ClientsContactInfo from '#components/Clients/ClientsContactInfo/ClientsContactInfo.js';
import { createNewOrderRequest } from '#components/redux/actions/ordersAction.js';
import { errorToText } from '#components/Utils/errorToText.js';
import ShowClientsModal from '#components/Clients/ClientsInfo/ClientsInfoModal.js';
import ShowDeliveryAddressModal from '#components/Clients/DeliveryAddress/DeliveryAddressModal';
import ShowClientsContactInfoModal from '#components/Clients/ClientsContactInfo/ClientsContactInfoModal';
import Table from '#components/Table/Table';
import '#components/Styles/modals.css';
import '#components/Clients/ClientsInfo/clientsDrawer.css';
import '../ordersView.css';
import { translateColumns } from '../ordersI18n.js';

const AddClientOrderModal = React.memo(({ isOpen, toggle }) => {
  const {
    newOrder,
    setNewOrder,
    status_list,
    isOrderReady,
    setIsOrderReady,
  } = useOrderContext();
  const { setCurrentClient, clients_info_table } = useProjectContext();
  const { t } = useTranslation('orders');

  const regionOptions = [
    {
      value: 'peninsular_spain',
      label: t('newOrder.regions.peninsular_spain'),
      vat: '21% IVA',
    },
    {
      value: 'extra_peninsular_spain',
      label: t('newOrder.regions.extra_peninsular_spain'),
      vat: '0% IVA',
    },
    {
      value: 'eu_outside_spain',
      label: t('newOrder.regions.eu_outside_spain'),
      vat: '0% IVA',
    },
    {
      value: 'outside_eu',
      label: t('newOrder.regions.outside_eu'),
      vat: '0% IVA',
    },
  ];

  // Колонки клиентов — те же поля, что в карточке заказа
  const clientColumns = useMemo(
    () => translateColumns(t, clients_info_table, { c_name: 'client_name' }),
    [clients_info_table, t],
  );

  const dispatch = useDispatch();
  const list_of_clients = useSelector((state) => state.clients);

  const [searchFilter, setSearchFilter] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  // Текст ошибки висит в модалке до следующей попытки: уведомление в углу
  // экрана пропадает и его легко не заметить
  const [createError, setCreateError] = useState(null);
  const [listOfClientsFiltered, setListOfClientsFiltered] =
    useState(list_of_clients);

  let haveClient = useMemo(
    () => newOrder?.owner ?? false,
    [newOrder?.owner],
  );
  let haveAdddress = useMemo(
    () => newOrder?.del_adr_id ?? false,
    [newOrder?.del_adr_id],
  );
  let haveContactInfo = useMemo(
    () => newOrder?.contact_id ?? false,
    [newOrder?.contact_id],
  );

  useEffect(() => {
    console.log(newOrder, 'newOrder AddClientOrderModal.jsx line 53');
  }, [newOrder]);

  // Номер заказа присваивает сервер при создании
  const addClientOrderHendler = async (id) => {
    const client = list_of_clients.find((el) => el.id === id);

    setNewOrder({
      owner: id,
      status: status_list[0].accessor,
      person_in_charge: 0,
      payment_method: 'prepayment',
    });
    setCurrentClient(client);
    setSearchFilter('');
  };

  const backHanddler = () => {
    setNewOrder({});
    setCurrentClient({});
  };

  const contactInfoHendler = (contactId) => {
    setNewOrder((prev) => ({
      ...prev,
      contact_id: contactId,
    }));
  };

  const deliveryAddressHendler = (addressId) => {
    setNewOrder((prev) => ({ ...prev, del_adr_id: addressId }));
  };

  const regionHandler = (regionOption) => {
    if (isCreating) return;
    // setValue(selectedOption.value);
    setNewOrder((prev) => ({ ...prev, region: regionOption }));
  };

  // const filterListOfClientsHandler = (e) => {
  //   setSearchFilter(e.target.value);
  //   let filtered = list_of_clients.filter((el) =>
  //     el.c_name?.toLowerCase().includes(e.target.value.toLowerCase())
  //   );
  //   setListOfClientsFiltered(filtered);
  // };

  useEffect(() => {
    if (!(newOrder?.contact_id && newOrder?.del_adr_id && newOrder?.region)) {
      setIsOrderReady(false);
      return;
    }

    // Закрываем модалку только после ответа сервера: иначе при ошибке
    // или зависшем запросе пользователь не видит, что заказ не создан
    const { action, promise } = createNewOrderRequest(newOrder);
    setIsCreating(true);
    setCreateError(null);
    dispatch(action);

    promise
      .then(() => toggle())
      .catch((err) => {
        setIsCreating(false);
        setCreateError(errorToText(err));
        // Без сброса повторный клик по тому же региону не запустит создание
        setNewOrder((prev) => ({ ...prev, region: undefined }));
      });
  }, [newOrder?.contact_id, newOrder?.del_adr_id, newOrder?.region]);

  useEffect(() => {
    if (isOrderReady) {
      //   dispatch(addNewOrder(newOrder));
      //   dispatch(getOrders());
      //   getCurrentOrderInfoHandler(newOrder);
      //   setClientModalOrder(!clientModalOrder);
      //   setIsOrderReady(false);
    }
  }, [isOrderReady]);

  useEffect(() => {
    let filtered = list_of_clients.filter((el) =>
      el.c_name?.toLowerCase().includes(searchFilter.toLowerCase()),
    );
    setListOfClientsFiltered(filtered);
  }, [list_of_clients]);

  const closeHandler = () => {
    setNewOrder({});
    setCurrentClient({});
    toggle();
  };

  const stepNum = haveClient
    ? haveAdddress
      ? haveContactInfo
        ? 4
        : 3
      : 2
    : 1;

  return (
    <div className="ord-modal-root">
      <div className="ord-modal-overlay" onClick={closeHandler} />
      <div className="ord-modal-card ord-modal-card--wizard">
        <div className="ord-modal-head">
          <div>
            <div className="ord-modal-head__title">
              {haveClient ? (
                haveAdddress ? (
                  haveContactInfo ? (
                    <p style={{ margin: 0 }}>{t('newOrder.selectRegion')}</p>
                  ) : (
                    <p style={{ margin: 0 }}>
                      {t('newOrder.selectContactPerson')}
                    </p>
                  )
                ) : (
                  <p style={{ margin: 0 }}>
                    {t('newOrder.selectDeliveryAddress')}
                  </p>
                )
              ) : (
                <p style={{ margin: 0 }}>{t('newOrder.selectClient')}</p>
              )}
            </div>
            <div className="ord-modal-head__subtitle">
              {t('newOrder.step', { current: stepNum, total: 4 })}
            </div>
          </div>
          <button type="button" className="ord-iconbtn" onClick={closeHandler}>
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#565d6d"
              strokeWidth="2.1"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6 6 18" />
            </svg>
          </button>
        </div>
        <div className="ord-modal-body">
          <Fragment>
            {haveClient ? (
              haveAdddress ? (
                haveContactInfo ? (
                  <div
                    className="cl-cardlist"
                    style={isCreating ? { opacity: 0.6 } : undefined}
                  >
                    {regionOptions.map((option) => (
                      <div
                        key={option.value}
                        className="cl-itemcard"
                        onClick={() => regionHandler(option.value)}
                      >
                        <svg
                          className="cl-itemcard__pin"
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#565d6d"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="9" />
                          <path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9s1.3-6.5 3.8-9Z" />
                        </svg>
                        <div className="cl-min0 cl-itemcard__main">
                          <div className="cl-itemcard__title">
                            {option.label}
                          </div>
                        </div>
                        <span className="cl-pill">{option.vat}</span>
                        <svg
                          className="cl-chev"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#c4c8d0"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m9 6 6 6-6 6" />
                        </svg>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {/* <div className="ord-modal-inline-actions">
                    <ShowClientsContactInfoModal />
                  </div> */}
                    <ClientsContactInfo
                      clickFunk={contactInfoHendler}
                      showSearch={true}
                    />
                  </>
                )
              ) : (
                <>
                  {/* <div className="ord-modal-inline-actions">
                    <ShowDeliveryAddressModal />
                  </div> */}
                  <DeliveryAddress
                    clickFunk={deliveryAddressHendler}
                    showSearch={true}
                  />
                </>
              )
            ) : (
              <div className="ord-card-scope">
                {/* <div className="ord-modal-inline-actions">
                  <ShowClientsModal />
                </div> */}
                <Table
                  COLUMN_DATA={clientColumns}
                  dataOfTable={listOfClientsFiltered}
                  tableName={t('newOrder.clientsTable')}
                  variant="card"
                  hideTitle
                  handleRowClick={(row) => {
                    addClientOrderHendler(row.original.id);
                  }}
                />
              </div>
            )}
          </Fragment>
        </div>
        <div className="ord-modal-foot ord-modal-foot--between">
          <div>
            {haveClient && !isCreating && (
              <button
                type="button"
                className="ord-btn ord-btn--ghost"
                onClick={backHanddler}
              >
                {t('newOrder.back')}
              </button>
            )}
          </div>
          <div className="ord-modal-head__subtitle">
            {isCreating && t('newOrder.creating')}
            {createError && (
              <div style={{ color: '#c62828' }}>
                <div>{t('newOrder.createFailed')}</div>
                <div>
                  {t('newOrder.createFailedReason', { reason: createError })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
export default AddClientOrderModal;
