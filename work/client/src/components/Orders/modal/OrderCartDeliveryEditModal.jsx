import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProjectContext } from '#components/contexts/Context.js';
import { useDispatch, useSelector } from 'react-redux';

import React, { useEffect } from 'react';
import DeliveryAddress from '#components/Clients/DeliveryAddress/DeliveryAddress';
import { updateDeliveryOfOrder } from '#components/redux/actions/ordersAction.js';
import '#components/Clients/ClientsInfo/clientsDrawer.css';
import '../ordersView.css';

function OrderDeliveryEditModal({ show, onHide }) {
  const { setCurrentClient } = useProjectContext();
  const { orderCartData } = useOrderContext();
  const deliveryAddresses = useSelector((state) => state.deliveryAddresses);
  const dispatch = useDispatch();

  const deliveryAddressHendler = (addressId) => {
    dispatch(
      updateDeliveryOfOrder({ address_id: addressId, order_id: orderCartData.id })
    );
    onHide();
  };

  useEffect(() => {
    setCurrentClient(orderCartData?.owner);
  }, [deliveryAddresses]);

  if (!show) return null;

  return (
    <div className="ord-modal-root">
      <div className="ord-modal-overlay" onClick={onHide} />
      <div className="ord-modal-card ord-modal-card--sm">
        <div className="ord-modal-head ord-modal-head--sm">
          <div className="ord-modal-head__title ord-modal-head__title--sm">
            Choose new delivery address
          </div>
          <button type="button" className="ord-iconbtn" onClick={onHide}>
            <svg
              width="16"
              height="16"
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
        <div className="ord-modal-body ord-modal-body--sm">
          <DeliveryAddress clickFunk={deliveryAddressHendler} />
        </div>
        <div className="ord-modal-foot ord-modal-foot--sm">
          <button type="button" className="ord-btn ord-btn--ghost" onClick={onHide}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function ShowOrderDeliveryEditModal() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <button
        type="button"
        className="ord-btn ord-btn--ghost ord-btn--sm"
        onClick={() => setModalShow(true)}
      >
        Edit
      </button>

      <OrderDeliveryEditModal show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}

export default ShowOrderDeliveryEditModal;
