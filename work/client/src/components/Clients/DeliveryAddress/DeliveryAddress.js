import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useProjectContext } from '#components/contexts/Context.js';
import Table from '#components/Table/Table';

const DeliveryAddress = ({ clickFunk = null }) => {
  const { currentClient, currentDelivery, clients_delivery_addresses_table } =
    useProjectContext();

  const deliveryAddresses = useSelector((state) => state.deliveryAddresses);

  const [listOfDeliveryFiltered, setListOfDeliveryFiltered] =
    useState(currentDelivery);

  useEffect(() => {
    const deliveryAddress = deliveryAddresses.filter(
      (el) => el.client_id === currentClient.id
    );
    setListOfDeliveryFiltered(deliveryAddress);
  }, [deliveryAddresses, currentClient]);

  return (
    <Fragment>
      <Table
        COLUMN_DATA={clients_delivery_addresses_table}
        dataOfTable={listOfDeliveryFiltered}
        tableName={'Delivery addresses'}
        handleRowClick={(row) => {
          if (!clickFunk) return;

          clickFunk(row.original.id);
        }}
      />
    </Fragment>
  );
};

export default DeliveryAddress;
