import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDeliveryAddresses } from '#components/redux/actions/clientAction';
import { useProjectContext } from '#components/contexts/Context.js';

const DeliveryAddress = ({ clickFunk = null }) => {
  const { currentClient, currentDelivery, setCurrentDelivery } = useProjectContext();

  const dispatch = useDispatch();
  const deliveryAddresses = useSelector((state) => state.deliveryAddresses);

  useEffect(() => {
    // dispatch(getAllDeliveryAddresses());
    // dispatch(getAllDeliveryAddresses(currentClient.id));
    console.log(deliveryAddresses, 'DELIVERY ADDRESSES')
    const deliveryAdress = deliveryAddresses.filter((el) => el.client_id === currentClient.id);
    setCurrentDelivery(deliveryAdress);
    console.log(currentClient, 'CURRENT CLIENT')
    console.log(currentDelivery, 'CURRENT DELIVERY ADDRESS')
  }, [deliveryAddresses, currentClient]);

  return (
    <Fragment>
      {' '}
      <table
        className="table mt-5 table-bordered text-center table-striped table-hover"
        align="left"
      >
        <thead>
          <tr>
            <th>id</th>
            <th>client id</th>
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
          {currentDelivery?.map((entrie) => {
            if (!entrie) return;
            return (
              <tr
                onClick={() => {
                  if (!clickFunk) return;

                  clickFunk(entrie.id);
                }}
              >
                <td>{entrie?.id}</td>
                <td>{entrie?.client_id}</td>
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
