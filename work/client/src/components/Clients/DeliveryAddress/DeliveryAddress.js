import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useProjectContext } from '#components/contexts/Context.js';

const DeliveryAddress = ({ clickFunk = null, showSearch = false }) => {
  const { currentClient, currentDelivery, setCurrentDelivery } = useProjectContext();

  const deliveryAddresses = useSelector((state) => state.deliveryAddresses);

  const [searchFilter, setSearchFilter] = useState('');
  const [listOfDeliveryFiltered, setListOfDeliveryFiltered] =
    useState(currentDelivery);

  useEffect(() => {
    const deliveryAddress = deliveryAddresses.filter(
      (el) => el.client_id === currentClient.id
    );
    setListOfDeliveryFiltered(deliveryAddress);
  }, [deliveryAddresses, currentClient]);

  const filterListOfDeliveryHandler = (e) => {
    setSearchFilter(e.target.value);
    let filtered = deliveryAddresses.filter((el) => {
      if (el.client_id === currentClient.id) {
        return el.city?.toLowerCase().includes(e.target.value.toLowerCase());
      }
    });
    setListOfDeliveryFiltered(filtered);
  };

  return (
    <Fragment>
      {showSearch == true && (
        <div>
          <h4>Search delivery address</h4>
          <input
            value={searchFilter}
            onChange={(e) => {
              filterListOfDeliveryHandler(e);
            }}
          />
        </div>
      )}
      <table
        className="table mt-5 table-bordered text-center table-striped table-hover"
        align="left"
      >
        <thead>
          <tr>
            <th>street</th>
            <th>additional_info</th>
            <th>city</th>
            <th>zip_code</th>
            <th>province</th>
            <th>country</th>
            <th>phone_number</th>
            <th>email</th>
          </tr>
        </thead>
        <tbody>
          {listOfDeliveryFiltered?.map((entrie) => {
            if (!entrie) return;
            return (
              <tr
                onClick={() => {
                  if (!clickFunk) return;

                  clickFunk(entrie.id);
                }}
              >
                <td>{entrie?.street}</td>
                <td>{entrie?.additional_info}</td>
                <td>{entrie?.city}</td>
                <td>{entrie?.zip_code}</td>
                <td>{entrie?.province}</td>
                <td>{entrie?.country}</td>
                <td>{entrie?.phone_number}</td>
                <td>{entrie?.email}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Fragment>
  );
};

export default DeliveryAddress;
