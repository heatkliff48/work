import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useProjectContext } from '#components/contexts/Context.js';

const DeliveryAddress = ({ clickFunk = null }) => {
  const { currentClient, currentDelivery } = useProjectContext();

  const deliveryAddresses = useSelector((state) => state.deliveryAddresses);

  const [listOfDeliveryFiltered, setListOfDeliveryFiltered] =
    useState(currentDelivery);

  useEffect(() => {
    const deliveryAddress = deliveryAddresses.filter(
      (el) => el.client_id === currentClient.id,
    );
    setListOfDeliveryFiltered(deliveryAddress);
  }, [deliveryAddresses, currentClient]);

  const list = listOfDeliveryFiltered || [];

  if (list.length === 0) {
    return (
      <div className="cl-empty">No delivery projects for this client yet.</div>
    );
  }

  return (
    <Fragment>
      <div className="cl-cardlist">
        {list.map((row) => {
          const title =
            row.project_name || row.street || row.address || 'Delivery site';
          const addr = [row.street, row.city, row.province]
            .filter(Boolean)
            .join(', ');
          return (
            <div
              key={row.id}
              className="cl-itemcard"
              onClick={() => {
                if (!clickFunk) return;
                clickFunk(row.id);
              }}
            >
              <svg className="cl-itemcard__pin" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#bc1212" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21c5-4.5 7.5-8 7.5-11A7.5 7.5 0 0 0 4.5 10c0 3 2.5 6.5 7.5 11z" /><circle cx="12" cy="10" r="2.4" />
              </svg>
              <div className="cl-min0 cl-itemcard__main">
                <div className="cl-itemcard__title">{title}</div>
                {addr && <div className="cl-itemcard__sub">{addr}</div>}
              </div>
              <svg className="cl-chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c4c8d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};

export default DeliveryAddress;
