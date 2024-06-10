import React, { Fragment } from 'react';
import ClientsInfo from './ClientsInfo/ClientsInfo';

function Clients() {
  return (
    <Fragment>
      <div className="container">
        <div class="row">
          <div class="col-sm-6">
            <ClientsInfo />
          </div>
          {/* <div class="col-sm-6">
            <ShowClientsAddressModal />
            <ClientsAddress />
          </div>
        </div>
      </div>
      <div className="container">
        <div class="row">
          <div class="col-xs-6">
            <ShowDeliveryAddressModal />
            <DeliveryAddress />
          </div>
          <div class="col-xs-6">
            <ShowClientsContactInfoModal />
            <ClientsContactInfo />
          </div> */}
        </div>
      </div>
    </Fragment>
  );
}

export default Clients;
